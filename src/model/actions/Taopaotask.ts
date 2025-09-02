import { redis } from '@src/model/api';
import { notUndAndNull } from '@src/model/common';
import { Harm } from '@src/model/battle';
import { readShop, writeShop } from '@src/model/shop';
import { addNajieThing } from '@src/model/najie';
import { __PATH, keysAction } from '@src/model/keys';
import type { ActionState, CoreNajieCategory as NajieCategory } from '@src/types';
import { Mention, DataMention, Text } from 'alemonjs';
import { NAJIE_CATEGORIES } from '@src/model/settions';
import { getAuctionKeyManager } from '@src/model/auction';
import { setDataJSONStringifyByKey } from '@src/model';
import { pushMessage } from '../MessageSystem';

function isNajieCategory(v: any): v is NajieCategory {
  return typeof v === 'string' && (NAJIE_CATEGORIES as readonly string[]).includes(v);
}

interface MonsterSlot {
  name: string;
  atk: number;
  def: number;
  blood: number;
  baoji: number;
  灵根?: { 法球倍率?: number };
}

interface ShopSlotLike {
  name: string;
  state?: number;
  Grade?: number;
  one?: any[];
  two?: any[];
  three?: any[];
}

interface PlayerData {
  名号: string;
  攻击: number;
  防御: number;
  当前血量: number;
}

interface MonsterData {
  名号: string;
  攻击: number;
  防御: number;
  当前血量: number;
  暴击率: number;
  灵根: any;
  法球倍率: number;
}

/**
 * 获取万仙盟NPC索引
 * @param npcList NPC列表
 * @returns 万仙盟NPC索引
 */
const getWanxianmengIndex = (npcList: any[]): number => {
  return npcList.findIndex(npc => npc.name === '万仙盟');
};

/**
 * 根据等级获取随机怪物
 * @param npcList NPC列表
 * @param wanxianmengIndex 万仙盟索引
 * @param grade 等级
 * @returns 怪物数据
 */
const getRandomMonster = (npcList: any[], wanxianmengIndex: number, grade: number): MonsterSlot => {
  const npc = npcList[wanxianmengIndex];
  let monsterList: MonsterSlot[];

  if (grade === 1) {
    monsterList = npc.one || [];
  } else if (grade === 2) {
    monsterList = npc.two || [];
  } else {
    monsterList = npc.three || [];
  }

  const monsterIndex = Math.trunc(Math.random() * monsterList.length);

  return monsterList[monsterIndex] || monsterList[0];
};

/**
 * 创建怪物战斗数据
 * @param monster 怪物数据
 * @param player 玩家数据
 * @param grade 等级
 * @returns 怪物战斗数据
 */
const createMonsterData = (monster: MonsterSlot, player: PlayerData, grade: number): MonsterData => {
  return {
    名号: monster.name,
    攻击: Math.floor(Number(monster.atk || 0) * Number(player.攻击 || 0)),
    防御: Math.floor((Number(monster.def || 0) * Number(player.防御 || 0)) / (1 + Number(grade) * 0.05)),
    当前血量: Math.floor((Number(monster.blood || 0) * Number(player.当前血量 || 0)) / (1 + Number(grade) * 0.05)),
    暴击率: Number(monster.baoji || 0),
    灵根: monster.灵根 ?? { name: '野怪', type: '普通', 法球倍率: 0.1 },
    法球倍率: Number(monster.灵根?.法球倍率 ?? 0.1)
  };
};

/**
 * 计算NPC伤害
 * @param monster 怪物数据
 * @param player 玩家数据
 * @returns 伤害值
 */
const calculateNpcDamage = (monster: MonsterData, player: PlayerData): number => {
  return Math.trunc(Harm(monster.攻击 * 0.85, Number(player.防御 || 0)) + Math.trunc(monster.攻击 * monster.法球倍率) + monster.防御 * 0.1);
};

/**
 * 生成逃跑结果消息
 * @param random 随机数
 * @param npcDamage NPC伤害
 * @param monster 怪物数据
 * @param player 玩家数据
 * @returns 消息和剩余血量
 */
const generateEscapeResult = (random: number, npcDamage: number, monster: MonsterData, player: PlayerData): { message: string; remainingHp: number } => {
  let damage: number;
  let message: string;

  if (random < 0.1) {
    damage = npcDamage;
    message = `${monster.名号}似乎不屑追你,只是随手丢出神通,剩余血量`;
  } else if (random < 0.25) {
    damage = Math.trunc(npcDamage * 0.3);
    message = `你引起了${monster.名号}的兴趣,${monster.名号}决定试探你,只用了三分力,剩余血量`;
  } else if (random < 0.5) {
    damage = Math.trunc(npcDamage * 1.5);
    message = `你的逃跑让${monster.名号}愤怒,${monster.名号}使用了更加强大的一次攻击,剩余血量`;
  } else if (random < 0.7) {
    damage = Math.trunc(npcDamage * 1.3);
    message = `你成功的吸引了所有的仇恨,${monster.名号}已经快要抓到你了,强大的攻击已经到了你的面前,剩余血量`;
  } else if (random < 0.9) {
    damage = Math.trunc(npcDamage * 1.8);
    message = `你们近乎贴脸飞行,${monster.名号}的攻势愈加猛烈,已经快招架不住了,剩余血量`;
  } else {
    damage = Math.trunc(npcDamage * 0.5);
    message = '身体快到极限了嘛,你暗暗问道,脚下逃跑的步伐更加迅速,剩余血量';
  }

  const remainingHp = Math.max(0, Number(player.当前血量 || 0) - damage);

  return { message, remainingHp };
};

/**
 * 处理玩家被抓进天牢
 * @param playerId 玩家ID
 * @param player 玩家数据
 * @param monster 怪物数据
 * @param grade 等级
 * @param action 动作状态
 * @param shop 商店数据
 * @param slot 商店槽位
 * @returns 消息
 */
const handlePlayerCaught = async (
  playerId: string,
  player: PlayerData,
  monster: MonsterData,
  grade: number,
  action: ActionState,
  shop: any[],
  slot: ShopSlotLike | undefined
): Promise<string> => {
  const num = Number(grade) + 1;
  const message = `\n在躲避追杀中,没能躲过此劫,被抓进了天牢\n在天牢中你找到了秘境之匙x${num}`;

  await addNajieThing(playerId, '秘境之匙', '道具', num);
  delete action.group_id;

  if (slot) {
    slot.state = 0;
  }
  await writeShop(shop);

  const time = 60; // 时间（分钟）
  const actionTime = 60000 * time; // 持续时间，单位毫秒

  action.action = '天牢';
  action.xijie = 1; // 关闭洗劫
  action.end_time = Date.now() + actionTime;

  const auctionKeyManager = getAuctionKeyManager();
  const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
  const groupList = await redis.smembers(groupListKey);
  const notice = `【全服公告】${player.名号}被${monster.名号}抓进了地牢,希望大家遵纪守法,引以为戒`;

  for (const gid of groupList) {
    const isGroup = true;
    const pushAddress = gid;

    const msg = [notice];

    void pushMessage(
      {
        uid: playerId,
        cid: isGroup && pushAddress ? pushAddress : ''
      },
      [Text(msg.join(''))]
    );
  }

  return message;
};

/**
 * 处理玩家成功逃脱
 * @param playerId 玩家ID
 * @param action 动作状态
 * @param shop 商店数据
 * @param slot 商店槽位
 * @param weizhi 位置信息
 * @returns 消息
 */
const handlePlayerEscaped = async (playerId: string, action: ActionState, shop: any[], slot: ShopSlotLike | undefined): Promise<string> => {
  const message = '\n你成功躲过了万仙盟的追杀,躲进了宗门';

  action.xijie = 1;
  action.end_time = Date.now();
  delete action.group_id;

  if (Array.isArray(action.thing)) {
    for (const t of action.thing) {
      if (!t) {
        continue;
      }
      const tn = t.name;
      const tc = isNajieCategory(t.class) ? t.class : '道具';
      const count = t.数量 ?? 0;

      if (tn && count > 0) {
        await addNajieThing(playerId, tn, tc, count);
      }
    }
  }

  if (slot) {
    if (typeof slot.Grade === 'number') {
      slot.Grade = Math.min(3, (slot.Grade || 0) + 1);
    }
    slot.state = 0;
    await writeShop(shop);
  }

  return message;
};

/**
 * 处理单个玩家的逃跑任务
 * @param playerId 玩家ID
 * @param action 动作状态
 * @param npcList NPC列表
 * @returns 是否处理成功
 */
const processPlayerEscape = async (playerId: string, action: ActionState, npcList: any[]): Promise<boolean> => {
  try {
    let pushAddress: string | undefined;
    let isGroup = false;

    if ('group_id' in action && notUndAndNull(action.group_id)) {
      isGroup = true;
      pushAddress = action.group_id;
    }

    const msg: Array<DataMention | string> = [Mention(playerId)];
    let endTime = action.end_time;
    const nowTime = Date.now();

    if (action.xijie === '-2') {
      const actTime = typeof action.time === 'string' ? parseInt(action.time) : Number(action.time);

      endTime = endTime - (isNaN(actTime) ? 0 : actTime) + 60000 * 5;

      if (nowTime >= endTime) {
        const weizhi = action.Place_address;

        if (!weizhi) {
          return false;
        }

        const wanxianmengIndex = getWanxianmengIndex(npcList);

        if (wanxianmengIndex === -1) {
          // logger.error('未找到万仙盟NPC数据'); // Original code had logger, but logger is not defined.
          return false;
        }

        const playerA = action.playerA;

        if (!playerA) {
          return false;
        }

        const monster = getRandomMonster(npcList, wanxianmengIndex, weizhi.Grade);
        const monsterData = createMonsterData(monster, playerA, weizhi.Grade);
        const npcDamage = calculateNpcDamage(monsterData, playerA);

        const random = Math.random();
        const { message, remainingHp } = generateEscapeResult(random, npcDamage, monsterData, playerA);

        playerA.当前血量 = remainingHp;
        let lastMessage = message + remainingHp;

        const arr: ActionState = action;
        const shop = await readShop();
        const slot = shop.find(s => s.name === weizhi.name) as ShopSlotLike | undefined;

        if (slot) {
          slot.state = 0;
        }

        if (playerA.当前血量 > 0) {
          arr.playerA = playerA;
          if (typeof arr.cishu === 'number') {
            arr.cishu -= 1;
          }
        } else {
          lastMessage += await handlePlayerCaught(playerId, playerA, monsterData, weizhi.Grade, arr, shop, slot);
        }

        if ((arr.cishu ?? 0) === 0) {
          lastMessage += await handlePlayerEscaped(playerId, arr, shop, slot);
        }

        await setDataJSONStringifyByKey(keysAction.action(playerId), arr);
        msg.push('\n' + lastMessage);

        void pushMessage(
          {
            uid: playerId,
            cid: isGroup && pushAddress ? pushAddress : ''
          },
          [Text(msg.join(''))]
        );

        return true;
      }
    }

    return false;
  } catch (error) {
    logger.error(error);

    return false;
  }
};

/**
 * 逃跑任务 - 处理玩家逃跑状态
 * 遍历所有玩家，检查处于逃跑状态的玩家，进行结算处理
 * @description xijie 为 -2 时，进行逃跑,逃跑成功后，不进行结算
 */
export const handelAction = async (playerId: string, action: ActionState, { npcList }): Promise<void> => {
  try {
    if (!npcList || npcList.length === 0) {
      return;
    }
    await processPlayerEscape(playerId, action, npcList);
  } catch (error) {
    logger.error(error);
  }
};
