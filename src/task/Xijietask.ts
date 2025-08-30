import { redis, pushInfo } from '@src/model/api';
import { notUndAndNull } from '@src/model/common';
import { zdBattle } from '@src/model/battle';
import { addNajieThing } from '@src/model/najie';
import { readShop, writeShop, existshop } from '@src/model/shop';
import { __PATH, keysAction, keysByPath } from '@src/model/keys';
import { screenshot } from '@src/image';
import { getAvatar } from '@src/model/utils/utilsx.js';
import { getDataList } from '@src/model/DataList';
import { getAuctionKeyManager } from '@src/model/auction';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model';
import type { Player } from '@src/types/player';
import type { BattleEntity, BattleResult } from '@src/types/model';

interface PlaceAddress {
  name: string;
  Grade: number;
}

interface Action {
  group_id?: string;
  end_time: number;
  time?: number;
  Place_address?: PlaceAddress;
  playerA: Player & { 魔值?: number };
  xijie?: string | number;
  action?: string;
  thing?: any[];
  cishu?: number;
}

interface Monster {
  name: string;
  atk: number;
  def: number;
  blood: number;
  baoji: number;
  灵根: any;
}

const onXijie = async (playerId: string, action: Action, npcList: any[]): Promise<void> => {
  let pushAddress: string | undefined; // 消息推送地址
  let isGroup = false; // 是否推送到群

  if (Object.prototype.hasOwnProperty.call(action, 'group_id')) {
    if (notUndAndNull(action.group_id)) {
      isGroup = true;
      pushAddress = action.group_id;
    }
  }

  // 最后发送的消息
  const msg: string[] = [];
  // 动作结束时间
  let endTime: number = action.end_time;
  // 现在的时间
  const nowTime = Date.now();

  // 10分钟后开始结算阶段一
  const durRaw = typeof action.time === 'number' ? action.time : parseInt(String(action.time ?? 0), 10);
  const dur: number = isNaN(durRaw) ? 0 : durRaw;

  endTime = endTime - dur + 60000 * 10;
  // 时间过了
  if (typeof endTime === 'number' && nowTime >= endTime) {
    const weizhi = action.Place_address;

    if (!weizhi) {
      return;
    }
    let i: number; // 获取对应npc列表的位置

    for (i = 0; i < npcList.length; i++) {
      if (npcList[i].name === weizhi.name) {
        break;
      }
    }
    const playerA: Player & { 魔值?: number } = action.playerA;
    let monsterLength: number;
    let monsterIndex: number;
    let monster: Monster;

    if (weizhi.Grade === 1) {
      monsterLength = npcList[i].one.length;
      monsterIndex = Math.trunc(Math.random() * monsterLength);
      monster = npcList[i].one[monsterIndex];
    } else if (weizhi.Grade === 2) {
      monsterLength = npcList[i].two.length;
      monsterIndex = Math.trunc(Math.random() * monsterLength);
      monster = npcList[i].two[monsterIndex];
    } else {
      monsterLength = npcList[i].three.length;
      monsterIndex = Math.trunc(Math.random() * monsterLength);
      monster = npcList[i].three[monsterIndex];
    }
    // 设定npc数值
    const playerB: BattleEntity = {
      名号: monster.name,
      攻击: Math.floor(monster.atk * playerA.攻击),
      防御: Math.floor((monster.def * playerA.防御) / (1 + weizhi.Grade * 0.05)),
      当前血量: Math.floor((monster.blood * playerA.当前血量) / (1 + weizhi.Grade * 0.05)),
      暴击率: monster.baoji,
      灵根: monster.灵根
    };
    let dataBattle: BattleResult;
    let lastMessage = '';
    // 构造满足 BattleEntity 最小字段的参战对象（填补缺失字段的默认值）
    const talent = playerA.灵根;
    const getTalentName = (t: any): string => (typeof t === 'object' && t !== null && 'name' in t ? String((t as { name: string }).name) : '凡灵根');
    const getTalentType = (t: any): string => (typeof t === 'object' && t !== null && 'type' in t ? String((t as { type: string }).type) : '普通');
    const getTalentRate = (t: any): number => (typeof t === 'object' && t !== null && '法球倍率' in t ? Number((t as { 法球倍率: number }).法球倍率) || 1 : 1);
    const dataBattleA: BattleEntity = {
      名号: playerA.名号,
      攻击: playerA.攻击,
      防御: playerA.防御,
      当前血量: playerA.当前血量,
      暴击率: playerA.暴击率 ?? 0.05,
      灵根: {
        name: getTalentName(talent),
        type: getTalentType(talent),
        法球倍率: getTalentRate(talent)
      }
    };

    if ((playerA.魔值 ?? 0) === 0) {
      // 根据魔道值决定先后手顺序 (0 视为先手)
      dataBattle = await zdBattle(dataBattleA, playerB);
      lastMessage += playerA.名号 + '悄悄靠近' + playerB.名号;
      playerA.当前血量 += dataBattle.A_xue;
    } else {
      dataBattle = await zdBattle(playerB, dataBattleA);
      lastMessage += playerA.名号 + '杀气过重,被' + playerB.名号 + '发现了';
      playerA.当前血量 += dataBattle.B_xue;
    }
    const msgg: string[] = dataBattle.msg;

    const winA = `${playerA.名号}击败了${playerB.名号}`;
    const winB = `${playerB.名号}击败了${playerA.名号}`;

    try {
      const playerAInfo = {
        id: playerId,
        name: dataBattleA?.名号,
        avatar: getAvatar(playerId),
        power: playerA.攻击 * playerA.防御, // 使用攻击*防御作为战力
        hp: dataBattleA?.当前血量 ?? 0,
        maxHp: playerA.血量上限 ?? playerA.当前血量
      };
      const playerBInfo = {
        id: '1715713638',
        name: playerB?.名号,
        avatar: getAvatar('1715713638'),
        power: playerB.攻击 * playerB.防御, // 使用攻击*防御作为战力
        hp: playerB?.当前血量 ?? 0,
        maxHp: playerB.当前血量 // 使用当前血量作为最大血量
      };
      const img = await screenshot('CombatResult', playerId, {
        msg: msgg,
        playerA: playerAInfo,
        playerB: playerBInfo,
        result: msgg.includes(winA) ? 'A' : msgg.includes(winB) ? 'B' : 'draw'
      });

      if (Buffer.isBuffer(img) && pushAddress) {
        pushInfo(pushAddress, isGroup, img);
      }
    } catch (error) {
      logger.error(error);
    }

    const arr = action;

    // 后续阶段会重新以 const 定义 time / actionTime
    if (msgg.find(item => item === winA)) {
      const time = 10; // 时间（分钟）
      const actionTime = 60000 * time; // 持续时间，单位毫秒

      arr.playerA = playerA;
      arr.action = '搜刮';
      arr.end_time = Date.now() + actionTime;
      arr.time = actionTime;
      arr.xijie = -1; // 进入二阶段
      lastMessage += ',经过一番战斗,击败对手,剩余' + playerA.当前血量 + '血量,开始搜刮物品';
    } else if (msgg.find(item => item === winB)) {
      const num = weizhi.Grade;

      lastMessage += ',经过一番战斗,败下阵来,被抓进了地牢\n在地牢中你找到了秘境之匙x' + num;
      await addNajieThing(playerId, '秘境之匙', '道具', num);
      // 结算完去除
      delete arr.group_id;
      const shop = await readShop();

      for (i = 0; i < shop.length; i++) {
        if (shop[i].name === weizhi.name) {
          (shop[i] as any).state = 0; // 使用类型断言避免类型错误
          break;
        }
      }
      await writeShop(shop);
      const time = 60; // 时间（分钟）
      const actionTime = 60000 * time; // 持续时间，单位毫秒

      arr.action = '禁闭';
      arr.xijie = 1; // 关闭洗劫
      arr.end_time = Date.now() + actionTime;
      const auctionKeyManager = getAuctionKeyManager();
      const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
      const groupList = await redis.smembers(groupListKey);

      const tip = `【全服公告】${playerA.名号}被${playerB.名号}抓进了地牢,希望大家遵纪守法,引以为戒`;

      for (const groupId of groupList) {
        pushInfo(groupId, true, tip);
      }
    }
    // 写入redis

    await setDataJSONStringifyByKey(keysAction.action(playerId), arr);

    msg.push('\n' + lastMessage);
    if (isGroup && pushAddress) {
      pushInfo(pushAddress, isGroup, msg.join('\n'));
    } else {
      pushInfo(playerId, isGroup, msg.join('\n'));
    }
  }
};

const onXijieNext = async (playerId: string, action: Action): Promise<void> => {
  let pushAddress: string | undefined; // 消息推送地址
  let isGroup = false; // 是否推送到群

  if (Object.prototype.hasOwnProperty.call(action, 'group_id')) {
    if (notUndAndNull(action.group_id)) {
      isGroup = true;
      pushAddress = action.group_id;
    }
  }

  // 最后发送的消息
  const msg: string[] = [];
  // 动作结束时间
  let endTime: number = action.end_time;
  // 现在的时间
  const nowTime = Date.now();

  // 5分钟后开始结算阶段二
  const dur2Raw = typeof action.time === 'number' ? action.time : parseInt(String(action.time || 0), 10);
  const dur2: number = isNaN(dur2Raw) ? 0 : dur2Raw;

  endTime = endTime - dur2 + 60000 * 5;
  // 时间过了
  if (typeof endTime === 'number' && nowTime >= endTime) {
    const weizhi = action.Place_address;

    if (!weizhi) {
      return;
    }

    let thing: any = await existshop(weizhi.name);
    const arr: Action = action;
    let lastMessage = '';
    const thingName: any[] = [];
    let shop: any = await readShop();
    let i: number;

    for (i = 0; i < shop.length; i++) {
      if (shop[i].name === weizhi.name) {
        break;
      }
    }
    if (!thing) {
      // 没有物品,进入下一阶段
      lastMessage += '已经被搬空了';
    } else {
      const gradeNum = Number(shop[i].Grade ?? 0) || 0;
      let x = gradeNum * 2;

      while (x > 0 && thing !== false) {
        const t = (() => {
          const thingIndex = Math.trunc(Math.random() * thing.length);

          return thing[thingIndex];
        })(); // 临时存储物品名

        thingName.push(t);
        shop = await readShop();
        for (let j = 0; j < shop[i].one.length; j++) {
          if (shop[i].one[j].name === t.name && shop[i].one[j].数量 > 0) {
            shop[i].one[j].数量 = 0;
            await writeShop(shop);
            break;
          }
        }
        thing = await existshop(weizhi.name);
        x--;
      }
      lastMessage += '经过一番搜寻' + arr.playerA.名号 + '找到了';
      for (let j = 0; j < thingName.length; j++) {
        lastMessage += '\n' + thingName[j].name + ' x ' + thingName[j].数量;
      }
      lastMessage += '\n刚出门就被万仙盟的人盯上了,他们仗着人多，你一人无法匹敌，于是撒腿就跑';
    }
    arr.action = '逃跑';
    const time = 30; // 时间（分钟）
    const actionTime = 60000 * time; // 持续时间，单位毫秒

    arr.end_time = Date.now() + actionTime;
    arr.time = actionTime;
    arr.xijie = -2; // 进入三阶段
    arr.thing = thingName;
    const gradeNumFinal = Number(action.Place_address?.Grade ?? 0) || 0;

    arr.cishu = gradeNumFinal + 1;
    // 写入redis

    await setDataJSONStringifyByKey(keysAction.action(playerId), arr);

    msg.push('\n' + lastMessage);
    if (isGroup && pushAddress) {
      pushInfo(pushAddress, isGroup, msg.join('\n'));
    } else {
      pushInfo(playerId, isGroup, msg.join('\n'));
    }
  }
};

export const Xijietask = async (): Promise<void> => {
  const playerList: string[] = await keysByPath(__PATH.player_path);

  const npcList: any[] = await getDataList('NPC');

  for (const playerId of playerList) {
    const action: Action | null = await getDataJSONParseByKey(keysAction.action(playerId));

    if (!action) {
      continue;
    }
    // 不为空，存在动作
    if (action !== null) {
      // 有洗劫状态:这个直接结算即可
      if (action.xijie === '0') {
        void onXijie(playerId, action, npcList);
      } else if (action.xijie === '-1') {
        void onXijieNext(playerId, action);
      }
    }
  }
};
