import { redis, pushInfo } from '@src/model/api';
import { getDataList } from '@src/model/DataList';
import { notUndAndNull } from '@src/model/common';
import { Harm } from '@src/model/battle';
import { readShop, writeShop } from '@src/model/shop';
import { addNajieThing } from '@src/model/najie';
import { __PATH, keysByPath } from '@src/model/keys';
import { getDataByUserId, setDataByUserId } from '@src/model/Redis';
import { safeParse } from '@src/model/utils/safe';
import type { ActionState, CoreNajieCategory as NajieCategory } from '@src/types';
import { Mention, DataMention } from 'alemonjs';
import { NAJIE_CATEGORIES } from '@src/model/settions';
import { getAuctionKeyManager } from '@src/model/constants';

function isNajieCategory(v): v is NajieCategory {
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

/**
 * 遍历所有玩家，检查每个玩家的当前动作（action），判断是否处于逃跑等特殊状态。
对于处于逃跑状态且到达结算时间的玩家，进行相关结算处理，包括奖励发放、状态变更等。
处理与怪物、商店、纳戒物品等相关的逻辑，支持多种奖励类型（如装备、道具等）。
推送结算消息到玩家或群组。
 * @returns
 */
export const Taopaotask = async () => {
  // 获取缓存中人物列表
  const playerList = await keysByPath(__PATH.player_path);

  for (const playerId of playerList) {
    let log_mag = ''; // 查询当前人物动作日志信息

    log_mag = log_mag + '查询' + playerId + '是否有动作,';
    // 得到动作

    const actionRaw = await getDataByUserId(playerId, 'action');
    const action = safeParse<ActionState | null>(actionRaw, null);

    if (action) {
      let push_address: string | undefined;
      let isGroup = false; // 是否推送到群

      if ('group_id' in action) {
        if (notUndAndNull(action.group_id)) {
          isGroup = true;
          push_address = action.group_id;
        }
      }

      // 最后发送的消息
      const msg: Array<DataMention | string> = [Mention(playerId)];
      // 动作结束时间
      let end_time = action.end_time;
      // 现在的时间
      const now_time = Date.now();

      // 有洗劫状态:这个直接结算即可
      if (action.xijie === '-2') {
        // 5分钟后开始结算阶段一
        const actTime
          = typeof action.time === 'string' ? parseInt(action.time) : Number(action.time);

        end_time = end_time - (isNaN(actTime) ? 0 : actTime) + 60000 * 5;
        // 时间过了
        if (now_time >= end_time) {
          const weizhi = action.Place_address;

          if (!weizhi) {
            return;
          }
          const npcList = await getDataList('NPC');
          let i = 0; // 获取对应npc列表的位置

          for (i = 0; i < npcList.length; i++) {
            if (npcList[i].name === '万仙盟') {
              break;
            }
          }
          const playerA = action.playerA;

          if (!playerA) {
            return;
          }
          let monster: MonsterSlot;

          if (weizhi.Grade === 1) {
            const monsterLength = npcList[i].one.length;
            const monsterIndex = Math.trunc(Math.random() * monsterLength);

            monster = npcList[i].one[monsterIndex];
          } else if (weizhi.Grade === 2) {
            const monsterLength = npcList[i].two.length;
            const monsterIndex = Math.trunc(Math.random() * monsterLength);

            monster = npcList[i].two[monsterIndex];
          } else {
            const monsterLength = npcList[i].three.length;
            const monsterIndex = Math.trunc(Math.random() * monsterLength);

            monster = npcList[i].three[monsterIndex];
          }
          // 设定npc数值
          const playerB = {
            名号: monster.name,
            攻击: Math.floor(Number(monster.atk || 0) * Number(playerA.攻击 || 0)),
            防御: Math.floor(
              (Number(monster.def || 0) * Number(playerA.防御 || 0))
                / (1 + Number(weizhi.Grade ?? 0) * 0.05)
            ),
            当前血量: Math.floor(
              (Number(monster.blood || 0) * Number(playerA.当前血量 || 0))
                / (1 + Number(weizhi.Grade ?? 0) * 0.05)
            ),
            暴击率: Number(monster.baoji || 0),
            灵根: monster.灵根 ?? { name: '野怪', type: '普通', 法球倍率: 0.1 },
            法球倍率: Number(monster.灵根?.法球倍率 ?? 0.1)
          };
          const Random = Math.random();
          const npc_damage = Math.trunc(
            Harm(playerB.攻击 * 0.85, Number(playerA.防御 || 0))
              + Math.trunc(playerB.攻击 * playerB.法球倍率)
              + playerB.防御 * 0.1
          );
          let lastMessage = '';

          if (Random < 0.1) {
            playerA.当前血量 = Number(playerA.当前血量 || 0) - npc_damage;
            lastMessage += `${playerB.名号}似乎不屑追你,只是随手丢出神通,剩余血量${playerA.当前血量}`;
          } else if (Random < 0.25) {
            playerA.当前血量 = Number(playerA.当前血量 || 0) - Math.trunc(npc_damage * 0.3);
            lastMessage += `你引起了${playerB.名号}的兴趣,${playerB.名号}决定试探你,只用了三分力,剩余血量${playerA.当前血量}`;
          } else if (Random < 0.5) {
            playerA.当前血量 = Number(playerA.当前血量 || 0) - Math.trunc(npc_damage * 1.5);
            lastMessage += `你的逃跑让${playerB.名号}愤怒,${playerB.名号}使用了更加强大的一次攻击,剩余血量${playerA.当前血量}`;
          } else if (Random < 0.7) {
            playerA.当前血量 = Number(playerA.当前血量 || 0) - Math.trunc(npc_damage * 1.3);
            lastMessage += `你成功的吸引了所有的仇恨,${playerB.名号}已经快要抓到你了,强大的攻击已经到了你的面前,剩余血量${playerA.当前血量}`;
          } else if (Random < 0.9) {
            playerA.当前血量 = Number(playerA.当前血量 || 0) - Math.trunc(npc_damage * 1.8);
            lastMessage += `你们近乎贴脸飞行,${playerB.名号}的攻势愈加猛烈,已经快招架不住了,剩余血量${playerA.当前血量}`;
          } else {
            playerA.当前血量 = Number(playerA.当前血量 || 0) - Math.trunc(npc_damage * 0.5);
            lastMessage += `身体快到极限了嘛,你暗暗问道,脚下逃跑的步伐更加迅速,剩余血量${playerA.当前血量}`;
          }
          if (playerA.当前血量 < 0) {
            playerA.当前血量 = 0;
          }
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
            const num = Number(weizhi.Grade ?? 0) + 1;

            lastMessage += `\n在躲避追杀中,没能躲过此劫,被抓进了天牢\n在天牢中你找到了秘境之匙x${num}`;
            await addNajieThing(playerId, '秘境之匙', '道具', num);
            delete arr.group_id;
            if (slot) {
              slot.state = 0;
            }
            await writeShop(shop);
            const time = 60; // 时间（分钟）
            const action_time = 60000 * time; // 持续时间，单位毫秒

            arr.action = '天牢';
            arr.xijie = 1; // 关闭洗劫
            arr.end_time = Date.now() + action_time;
            const auctionKeyManager = getAuctionKeyManager();
            const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
            const groupList = await redis.smembers(groupListKey);
            const notice = `【全服公告】${playerA.名号}被${playerB.名号}抓进了地牢,希望大家遵纪守法,引以为戒`;

            for (const gid of groupList) {
              pushInfo(gid, true, notice);
            }
          }
          if ((arr.cishu ?? 0) === 0) {
            lastMessage += '\n你成功躲过了万仙盟的追杀,躲进了宗门';
            arr.xijie = 1;
            arr.end_time = Date.now();
            delete arr.group_id;
            if (Array.isArray(arr.thing)) {
              for (const t of arr.thing) {
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
          }
          // 写入redis
          await setDataByUserId(playerId, 'action', JSON.stringify(arr));
          msg.push('\n' + lastMessage);
          if (isGroup && push_address) {
            pushInfo(push_address, isGroup, msg.join('\n'));
          } else {
            pushInfo(playerId, isGroup, msg.join('\n'));
          }
        }
      }
    }
  }
};
