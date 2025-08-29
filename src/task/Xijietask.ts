import { redis, pushInfo } from '@src/model/api';
import { notUndAndNull } from '@src/model/common';
import { zdBattle } from '@src/model/battle';
import { addNajieThing } from '@src/model/najie';
import { readShop, writeShop, existshop } from '@src/model/shop';
import { __PATH, keysByPath } from '@src/model/keys';
import { getDataByUserId, setDataByUserId } from '@src/model/Redis';
import type { RaidActionState } from '@src/types';
import { screenshot } from '@src/image';
import { getAvatar } from '@src/model/utils/utilsx.js';
import { getDataList } from '@src/model/DataList';
import { getAuctionKeyManager } from '@src/model/auction';

/**
 * 获取所有玩家，逐个检查其当前动作（action）。
若玩家处于秘境探索状态且到达结算时间：
随机生成探索地点和怪物，调用 zdBattle 进行战斗模拟。
根据战斗胜负，计算并发放奖励（如修为、气血、装备、道具等），并处理幸运、仙宠等特殊加成。
处理特殊事件（如获得稀有物品、特殊掉落等）。
更新玩家属性、背包、经验、血量等，并推送结算消息（支持私聊或群聊）。
结算后关闭所有相关状态（如 Place_action、shutup、working 等），并写回玩家数据。
兼容多种奖励类型和探索地点，支持多样化的探索体验。
简言之，该任务脚本实现了“秘境探索”玩法的自动结算，包括战斗、奖励、特殊事件和状态管理，是游戏自动化和奖励分发的关键逻辑之一。
 */
export const Xijietask = async () => {
  const playerList = await keysByPath(__PATH.player_path);

  for (const playerId of playerList) {
    const raw = await getDataByUserId(playerId, 'action');
    let action: RaidActionState | null = null;

    try {
      action = raw ? (JSON.parse(raw) as RaidActionState) : null;
    } catch {
      action = null;
    }
    // 不为空，存在动作
    if (action !== null) {
      let push_address; // 消息推送地址
      let isGroup = false; // 是否推送到群

      if (Object.prototype.hasOwnProperty.call(action, 'group_id')) {
        if (notUndAndNull(action.group_id)) {
          isGroup = true;
          push_address = action.group_id;
        }
      }

      // 最后发送的消息
      const msg: string[] = [];
      // 动作结束时间
      let end_time = action.end_time;
      // 现在的时间
      const now_time = Date.now();

      // 有洗劫状态:这个直接结算即可
      if (action.xijie === '0') {
        // 10分钟后开始结算阶段一
        const durRaw =
          typeof action.time === 'number' ? action.time : parseInt(String(action.time ?? 0), 10);
        const dur = isNaN(durRaw) ? 0 : durRaw;

        end_time = end_time - dur + 60000 * 10;
        // 时间过了
        if (typeof end_time === 'number' && now_time >= end_time) {
          const weizhi = action.Place_address;

          if (!weizhi) {
            continue;
          }
          let i; // 获取对应npc列表的位置
          const npc_list = await getDataList('NPC');

          for (i = 0; i < npc_list.length; i++) {
            if (npc_list[i].name === weizhi.name) {
              break;
            }
          }
          const playerA = action.playerA;
          let monsterLength;
          let monsterIndex;
          let monster;

          if (weizhi.Grade === 1) {
            monsterLength = npc_list[i].one.length;
            monsterIndex = Math.trunc(Math.random() * monsterLength);
            monster = npc_list[i].one[monsterIndex];
          } else if (weizhi.Grade === 2) {
            monsterLength = npc_list[i].two.length;
            monsterIndex = Math.trunc(Math.random() * monsterLength);
            monster = npc_list[i].two[monsterIndex];
          } else {
            monsterLength = npc_list[i].three.length;
            monsterIndex = Math.trunc(Math.random() * monsterLength);
            monster = npc_list[i].three[monsterIndex];
          }
          // 设定npc数值
          const playerB = {
            名号: monster.name,
            攻击: Math.floor(monster.atk * playerA.攻击),
            防御: Math.floor((monster.def * playerA.防御) / (1 + weizhi.Grade * 0.05)),
            当前血量: Math.floor((monster.blood * playerA.当前血量) / (1 + weizhi.Grade * 0.05)),
            暴击率: monster.baoji,
            灵根: monster.灵根,
            法球倍率: monster.灵根.法球倍率
          };
          let dataBattle;
          let lastMessage = '';
          // 构造满足 BattleEntity 最小字段的参战对象（填补缺失字段的默认值）
          const talent = playerA.灵根;
          const getTalentName = (t): string =>
            typeof t === 'object' && t !== null && 'name' in t
              ? String((t as { name }).name)
              : '凡灵根';
          const getTalentType = (t): string =>
            typeof t === 'object' && t !== null && 'type' in t
              ? String((t as { type }).type)
              : '普通';
          const getTalentRate = (t): number =>
            typeof t === 'object' && t !== null && '法球倍率' in t
              ? Number((t as { 法球倍率 }).法球倍率) || 1
              : 1;
          const dataBattleA = {
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
          const msgg = dataBattle.msg;

          logger.info(msgg);

          const winA = `${playerA.名号}击败了${playerB.名号}`;
          const winB = `${playerB.名号}击败了${playerA.名号}`;

          try {
            const playerA = {
              id: playerId,
              name: dataBattleA?.名号,
              avatar: getAvatar(playerId),
              power: dataBattleA?.战力 ?? 0,
              hp: dataBattleA?.当前血量 ?? 0,
              maxHp: dataBattleA?.血量上限 ?? 0
            };
            const playerB = {
              id: '1715713638',
              name: playerB?.名号,
              avatar: getAvatar('1715713638'),
              power: playerB?.战力 ?? 0,
              hp: playerB?.当前血量 ?? 0,
              maxHp: playerB?.血量上限 ?? 0
            };
            const img = await screenshot('CombatResult', playerId, {
              msg: msgg,
              playerA: playerA,
              playerB: playerB,
              result: msgg.includes(winA) ? 'A' : msgg.includes(winB) ? 'B' : 'draw'
            });

            if (Buffer.isBuffer(img)) {
              pushInfo(push_address, isGroup, img);
            }
          } catch (error) {
            logger.error(error);
          }

          const arr = action;

          // 后续阶段会重新以 const 定义 time / action_time
          if (msgg.find(item => item === winA)) {
            const time = 10; // 时间（分钟）
            const action_time = 60000 * time; // 持续时间，单位毫秒

            arr.playerA = playerA;
            arr.action = '搜刮';
            arr.end_time = Date.now() + action_time;
            arr.time = action_time;
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
                shop[i].state = 0;
                break;
              }
            }
            await writeShop(shop);
            const time = 60; // 时间（分钟）
            const action_time = 60000 * time; // 持续时间，单位毫秒

            arr.action = '禁闭';
            arr.xijie = 1; // 关闭洗劫
            arr.end_time = Date.now() + action_time;
            const auctionKeyManager = getAuctionKeyManager();
            const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
            const groupList = await redis.smembers(groupListKey);
            const xx =
              '【全服公告】' +
              playerA.名号 +
              '被' +
              playerB.名号 +
              '抓进了地牢,希望大家遵纪守法,引以为戒';

            for (const group_id of groupList) {
              pushInfo(group_id, true, xx);
            }
          }
          // 写入redis
          await setDataByUserId(playerId, 'action', JSON.stringify(arr));
          msg.push('\n' + lastMessage);
          if (isGroup) {
            pushInfo(push_address, isGroup, msg.join('\n'));
          } else {
            pushInfo(playerId, isGroup, msg.join('\n'));
          }
        }
      } else if (action.xijie === '-1') {
        // 5分钟后开始结算阶段二
        const dur2Raw =
          typeof action.time === 'number' ? action.time : parseInt(String(action.time || 0), 10);
        const dur2 = isNaN(dur2Raw) ? 0 : dur2Raw;

        end_time = end_time - dur2 + 60000 * 5;
        // 时间过了
        if (typeof end_time === 'number' && now_time >= end_time) {
          const weizhi = action.Place_address;
          let thing = await existshop(weizhi.name);
          const arr = action;
          let lastMessage = '';
          const thingName: any[] = [];
          let shop = await readShop();
          let i;

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
                const thing_index = Math.trunc(Math.random() * thing.length);

                return thing[thing_index];
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
            lastMessage +=
              '\n刚出门就被万仙盟的人盯上了,他们仗着人多，你一人无法匹敌，于是撒腿就跑';
          }
          arr.action = '逃跑';
          const time = 30; // 时间（分钟）
          const action_time = 60000 * time; // 持续时间，单位毫秒

          arr.end_time = Date.now() + action_time;
          arr.time = action_time;
          arr.xijie = -2; // 进入三阶段
          arr.thing = thingName;
          const gradeNumFinal = Number(action.Place_address?.Grade ?? 0) || 0;

          arr.cishu = gradeNumFinal + 1;
          // 写入redis
          await setDataByUserId(playerId, 'action', JSON.stringify(arr));

          msg.push('\n' + lastMessage);
          if (isGroup) {
            pushInfo(push_address, isGroup, msg.join('\n'));
          } else {
            pushInfo(playerId, isGroup, msg.join('\n'));
          }
        }
      }
    }
  }
};
