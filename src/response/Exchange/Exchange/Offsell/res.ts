import { getRedisKey } from '@src/model/keys';
import { Text, useSend } from 'alemonjs';
import { redis } from '@src/model/api';
import { existplayer, readPlayer, readExchange, writeExchange, addNajieThing, keysLock, compulsoryToNumber } from '@src/model/index';
import { withLock } from '@src/model/locks';
import type { ExchangeRecord as RawExchangeRecord, NajieCategory } from '@src/types/model';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';

export const regular = /^(#|＃|\/)?下架[1-9]\d*$/;

// 锁配置
const EXCHANGE_OFFSELL_LOCK_CONFIG = {
  timeout: 30000, // 30秒超时
  retryDelay: 100, // 100ms重试间隔
  maxRetries: 5, // 最大重试5次
  enableRenewal: true, // 启用锁续期
  renewalInterval: 10000 // 10秒续期间隔
} as const;

// 错误消息常量
const ERROR_MESSAGES = {
  PLAYER_NOT_EXIST: '玩家不存在',
  CD_LIMIT: (cdMinutes: number, remainMinutes: number, remainSeconds: number) => `每${cdMinutes}分钟操作一次，CD: ${remainMinutes}分${remainSeconds}秒`,
  INVALID_INDEX: '编号格式错误',
  ITEM_NOT_FOUND: (index: number) => `没有编号为${index}的物品`,
  NOT_OWNER: '不能下架别人上架的物品',
  MISSING_NAME: '物品名称缺失',
  LOCK_ERROR: '系统繁忙，请稍后重试',
  SUCCESS: (playerName: string, itemName: string) => `${playerName}下架${itemName}成功！`
} as const;

interface LegacyRecord {
  qq: string;
  name: { name: string; class: NajieCategory } | string;
  amount?: number;
  pinji2?: number;
  class?: NajieCategory;
  // 新增：保存完整装备属性信息
  fullEquipment?: any;
}

// 数值转换函数
function toInt(v: any, d = 0): number {
  const n = Number(v);

  return Number.isFinite(n) ? Math.trunc(n) : d;
}

/**
 * 记录映射函数 - 修复装备属性丢失问题
 *
 * 问题描述：原函数在处理新格式ExchangeRecord时，只提取了基本的name和class信息，
 * 丢失了装备的完整属性（攻击、防御、血量等），导致下架后装备属性重置。
 *
 * 解决方案：检查并保存装备的完整属性信息，确保下架时能正确返还原装备。
 */
function mapRecord(r: any): LegacyRecord | null {
  if (!r || typeof r !== 'object') {
    return null;
  }

  const rec = r as LegacyRecord;

  logger.info('rec:', rec, 'qq' in rec, rec.name);
  if ('qq' in rec && rec.name) {
    return rec;
  }

  const er = r as RawExchangeRecord;

  if (er.thing) {
    const name = {
      name: String(er.thing.name || ''),
      class: (er.thing.class || '道具') as NajieCategory
    };

    // 检查是否有完整的装备属性（新格式记录）
    let fullEquipment: any = null;

    if (er.thing.atk !== undefined || er.thing.def !== undefined || er.thing.HP !== undefined || er.thing.bao !== undefined) {
      // 保存完整装备对象，包含所有属性
      fullEquipment = {
        name: er.thing.name,
        class: er.thing.class,
        pinji: er.thing.pinji2, // 使用数字品阶
        atk: er.thing.atk, // 攻击力
        def: er.thing.def, // 防御力
        HP: er.thing.HP, // 血量
        bao: er.thing.bao, // 暴击
        type: er.thing.type, // 装备类型
        数量: er.amount, // 数量
        出售价: er.thing.出售价 // 出售价
      };
    }

    return {
      qq: String(er.qq || ''),
      name,
      amount: er.amount,
      pinji2: er.thing.pinji2,
      fullEquipment // 保存完整装备信息
    };
  }

  return null;
}

// 解析下架索引
function parseOffsellIndex(messageText: string): number | null {
  const indexStr = messageText.replace(/^(#|＃|\/)?下架/, '').trim();

  if (!indexStr || !/^[1-9]\d*$/.test(indexStr)) {
    return null;
  }

  const index = compulsoryToNumber(indexStr, 1) - 1;

  return index >= 0 ? index : null;
}

// 验证物品所有权
function validateItemOwnership(record: LegacyRecord, userId: string): boolean {
  return String(record.qq) === String(userId);
}

// 获取物品信息
function getItemInfo(record: LegacyRecord): { name: string; class: NajieCategory } {
  let thingName = '';
  let thingClass: NajieCategory = '道具';

  if (typeof record.name === 'string') {
    thingName = record.name;
    thingClass = record.class || '道具';
  } else {
    thingName = record.name.name;
    thingClass = record.name.class;
  }

  return { name: thingName, class: thingClass };
}

// 核心下架逻辑（在锁保护下执行）
const executeOffsellWithLock = async (e: any, userId: string, itemIndex: number) => {
  const Send = useSend(e);

  // 检查玩家是否存在
  if (!(await existplayer(userId))) {
    void Send(Text(ERROR_MESSAGES.PLAYER_NOT_EXIST));

    return;
  }

  const rawList = await readExchange();
  const list: LegacyRecord[] = rawList.map(mapRecord).filter((item): item is LegacyRecord => item !== null);

  logger.info('list:', list);
  if (itemIndex >= list.length) {
    void Send(Text(ERROR_MESSAGES.ITEM_NOT_FOUND(itemIndex + 1)));

    return;
  }

  const record = list[itemIndex];

  // 验证物品所有权
  if (!validateItemOwnership(record, userId)) {
    void Send(Text(ERROR_MESSAGES.NOT_OWNER));

    return;
  }

  const { name: thingName, class: thingClass } = getItemInfo(record);

  if (!thingName) {
    void Send(Text(ERROR_MESSAGES.MISSING_NAME));

    return;
  }

  const amount = toInt(record.amount, 1);
  const category: NajieCategory = thingClass || '道具';

  /**
   * 返还物品到纳戒 - 修复装备属性丢失问题
   *
   * 问题描述：原逻辑在返还装备时只传递装备名称和品阶，导致addNajieThing函数
   * 从数据表中查找基础模板，丢失了装备的强化属性。
   *
   * 解决方案：
   * 1. 检查是否有完整装备属性（新格式记录）
   * 2. 如果有，使用完整装备对象调用addNajieThing
   * 3. 如果没有，使用原有逻辑保持向后兼容性
   */
  if (category === '装备' || category === '仙宠') {
    const equipName = typeof record.name === 'string' ? record.name : record.name.name;

    // 检查是否有完整的装备属性（新格式记录）
    if (record.fullEquipment) {
      // 使用保存的完整装备对象，确保所有属性正确返还
      await addNajieThing(userId, record.fullEquipment, category, amount);
    } else {
      // 向后兼容：旧格式记录使用原有逻辑
      await addNajieThing(userId, equipName, category, amount, record.pinji2);
    }
  } else {
    await addNajieThing(userId, thingName, category, amount);
  }

  // 从交易所移除物品
  rawList.splice(itemIndex, 1);
  await writeExchange(rawList);

  // 重置交易所状态
  await redis.set(getRedisKey(userId, 'Exchange'), '0');

  const player = await readPlayer(userId);
  const playerName = player?.名号 || userId;

  void Send(Text(ERROR_MESSAGES.SUCCESS(playerName, thingName)));
};

// 使用锁执行下架操作
const executeOffsellWithLockWrapper = async (e: any, userId: string, itemIndex: number) => {
  const lockKey = keysLock.exchange(String(itemIndex));

  const result = await withLock(
    lockKey,
    async () => {
      await executeOffsellWithLock(e, userId, itemIndex);
    },
    EXCHANGE_OFFSELL_LOCK_CONFIG
  );

  if (!result.success) {
    const Send = useSend(e);

    logger.error('Exchange offsell lock error:', result.error);
    void Send(Text('操作失败，请稍后再试'));
  }
};

const res = onResponse(selects, e => {
  const Send = useSend(e);
  const userId = e.UserId;

  // 解析下架索引
  const itemIndex = parseOffsellIndex(e.MessageText);

  if (itemIndex === null) {
    void Send(Text(ERROR_MESSAGES.INVALID_INDEX));

    return false;
  }

  // 使用锁执行下架操作
  void executeOffsellWithLockWrapper(e, userId, itemIndex);

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
