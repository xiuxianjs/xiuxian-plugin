import { pushInfo } from '@src/model/api';
import { getDataList } from '@src/model/DataList';
import { notUndAndNull } from '@src/model/common';
import { readPlayer } from '@src/model/xiuxian';
import { zdBattle } from '@src/model/battle';
import { addNajieThing } from '@src/model/najie';
import { readDanyao, writeDanyao } from '@src/model/danyao';
import { addExp2, addExp, addHP } from '@src/model/economy';
import { __PATH, keysByPath } from '@src/model/keys';
import { DataMention, Mention } from 'alemonjs';
import { getDataByUserId, setDataByUserId } from '@src/model/Redis';
import { safeParse } from '@src/model/utils/safe';
import type { CoreNajieCategory as NajieCategory, ActionState } from '@src/types';
import { writePlayer } from '@src/model/xiuxian';
import { getConfig } from '@src/model';
import { NAJIE_CATEGORIES } from '@src/model/settions';

/**
 *
 * @param v
 * @returns
 */
function isNajieCategory(v): v is NajieCategory {
  return typeof v === 'string' && (NAJIE_CATEGORIES as readonly string[]).includes(v);
}

/**
 * 遍历所有玩家，检查每个玩家的当前动作（action），判断是否处于秘境探索状态（Place_action === '0'）。
对于处于秘境探索状态且到达结算时间的玩家：
随机生成探索地点和怪物，进行战斗模拟（zdBattle）。
根据战斗结果，计算并发放奖励（如修为、气血、装备、道具等），并处理幸运、仙宠等特殊加成。
处理特殊事件（如获得稀有物品、特殊掉落等）。
更新玩家属性、背包、经验、血量等，并推送结算消息。
结算后关闭相关状态。
兼容多种奖励类型和探索地点，支持多样化的探索体验。
 * @returns
 */
export const SecretPlaceTask = async () => {
  const playerList = await keysByPath(__PATH.player_path);

  for (const player_id of playerList) {
    // 得到动作
    const actionRaw = await getDataByUserId(player_id, 'action');
    const action = safeParse<ActionState | null>(actionRaw, null);

    // 不为空，存在动作
    if (action) {
      let push_address; // 消息推送地址
      let isGroup = false; // 是否推送到群

      if ('group_id' in action) {
        if (notUndAndNull(action.group_id)) {
          isGroup = true;
          push_address = action.group_id;
        }
      }
      // 最后发送的消息
      const msg: Array<DataMention | string> = [Mention(player_id)];
      // 动作结束时间
      let end_time = action.end_time;
      // 现在的时间
      const now_time = Date.now();
      // 用户信息
      const player = await readPlayer(player_id);

      if (!player) {
        continue;
      }
      // 有秘境状态:这个直接结算即可
      if (action.Place_action === '0') {
        // 这里改一改,要在结束时间的前两分钟提前结算
        end_time = end_time - 60000 * 2;
        // 时间过了
        if (now_time > end_time) {
          const weizhi = action.Place_address;

          if (!weizhi) {
            continue;
          }
          const playerA = {
            名号: player.名号,
            攻击: player.攻击,
            防御: player.防御,
            当前血量: player.当前血量,
            暴击率: player.暴击率,
            法球倍率: Number(player.灵根?.法球倍率) || 1,
            灵根: {
              name: player.灵根?.name || '未知',
              type: player.灵根?.type || '普通',
              法球倍率: Number(player.灵根?.法球倍率) || 1
            },
            仙宠: player.仙宠 || { name: '无', type: 'none', 加成: 0 }
          };
          let buff = 1;

          if (weizhi.name === '大千世界' || weizhi.name === '仙界矿场') {
            buff = 0.6;
          }
          const monsterList = await getDataList('Monster');
          const monsterLength = monsterList.length;

          if (monsterLength === 0) {
            return;
          }
          const monsterIndex = Math.trunc(Math.random() * monsterLength);
          const monster = monsterList[monsterIndex] as {
            名号: string;
            攻击: number;
            防御: number;
            当前血量: number;
            暴击率: number;
          };
          const playerB = {
            名号: monster.名号,
            攻击: Math.floor(Number(monster.攻击 || 0) * player.攻击 * buff),
            防御: Math.floor(Number(monster.防御 || 0) * player.防御 * buff),
            当前血量: Math.floor(Number(monster.当前血量 || 0) * player.血量上限 * buff),
            暴击率: Number(monster.暴击率 || 0) * buff,
            法球倍率: 0.1,
            灵根: { name: '野怪', type: '普通', 法球倍率: 0.1 }
          };
          const dataBattle = await zdBattle(playerA, playerB);
          const msgg = dataBattle.msg;
          const winA = `${playerA.名号}击败了${playerB.名号}`;
          const winB = `${playerB.名号}击败了${playerA.名号}`;
          let thingName: string | undefined;
          let thingClass: NajieCategory | undefined;
          const cf = await getConfig('xiuxian', 'xiuxian');
          const x = cf.SecretPlace.one;
          const random1 = Math.random();
          const y = cf.SecretPlace.two;
          const random2 = Math.random();
          const z = cf.SecretPlace.three;
          const random3 = Math.random();
          let random4;
          let m = '';
          // let fyd_msg = '' // 已不再使用
          // 查找秘境
          let t1 = 1;
          let t2 = 1;
          let n = 1;
          let lastMessage = '';

          if (random1 <= x) {
            if (random2 <= y) {
              if (random3 <= z) {
                random4 = Math.floor(Math.random() * weizhi.three.length);
                thingName = weizhi.three[random4].name;
                if (isNajieCategory(weizhi.three[random4].class)) {
                  thingClass = weizhi.three[random4].class as NajieCategory;
                }
                m = `抬头一看，金光一闪！有什么东西从天而降，定睛一看，原来是：[${thingName}`;
                t1 = 2 + Math.random();
                t2 = 2 + Math.random();
              } else {
                random4 = Math.floor(Math.random() * weizhi.two.length);
                thingName = weizhi.two[random4].name;
                if (isNajieCategory(weizhi.two[random4].class)) {
                  thingClass = weizhi.two[random4].class as NajieCategory;
                }
                m = `在洞穴中拿到[${thingName}`;
                t1 = 1 + Math.random();
                t2 = 1 + Math.random();
                if (weizhi.name === '太极之阳' || weizhi.name === '太极之阴') {
                  n = 5;
                  m = '捡到了[' + thingName;
                }
              }
            } else {
              random4 = Math.floor(Math.random() * weizhi.one.length);
              thingName = weizhi.one[random4].name;
              if (isNajieCategory(weizhi.one[random4].class)) {
                thingClass = weizhi.one[random4].class as NajieCategory;
              }
              m = `捡到了[${thingName}`;
              t1 = 0.5 + Math.random() * 0.5;
              t2 = 0.5 + Math.random() * 0.5;
              if (weizhi.name === '诸神黄昏·旧神界') {
                n = 100;
                if (thingName === '洗根水') {
                  n = 130;
                }
                m = '捡到了[' + thingName;
              }
              if (weizhi.name === '太极之阳' || weizhi.name === '太极之阴') {
                n = 5;
                m = '捡到了[' + thingName;
              }
            }
          } else {
            m = '走在路上看见了一只蚂蚁！蚂蚁大仙送了你[起死回生丹';
            await addNajieThing(player_id, '起死回生丹', '丹药', 1);
            t1 = 0.5 + Math.random() * 0.5;
            t2 = 0.5 + Math.random() * 0.5;
          }
          if (weizhi.name !== '诸神黄昏·旧神界') {
            // 判断是不是旧神界
            const random = Math.random();

            if (random < player.幸运) {
              if (random < player.addluckyNo) {
                lastMessage += '福源丹生效，所以在';
              } else if (player.仙宠.type === '幸运') {
                lastMessage += '仙宠使你在探索中欧气满满，所以在';
              }
              n *= 2;
              lastMessage += '本次探索中获得赐福加成\n';
            }
            if (player.islucky > 0) {
              player.islucky--;
              if (player.islucky !== 0) {
                // fyd_msg = `  \n福源丹的效力将在${player.islucky}次探索后失效\n`
              } else {
                // fyd_msg = `  \n本次探索后，福源丹已失效\n`
                player.幸运 -= player.addluckyNo;
                player.addluckyNo = 0;
              }
              await writePlayer(player_id, player);
            }
          }
          m += `]×${n}个。`;
          let xiuwei = 0;
          // 默认结算装备数
          const now_level_id = player.level_id;
          const now_physique_id = player.Physique_id;
          // 结算
          let qixue = 0;

          if (msgg.find(item => item === winA)) {
            xiuwei = Math.trunc(2000 + (100 * now_level_id * now_level_id * t1 * 0.1) / 5);
            qixue = Math.trunc(2000 + 100 * now_physique_id * now_physique_id * t2 * 0.1);
            if (thingName && thingClass) {
              await addNajieThing(player_id, thingName, thingClass, n);
            }
            lastMessage += `${m}不巧撞见[${
              playerB.名号
            }],经过一番战斗,击败对手,获得修为${xiuwei},气血${qixue},剩余血量${
              playerA.当前血量 + dataBattle.A_xue
            }`;
            const random = Math.random(); // 万分之一出神迹
            let newrandom = 0.995;
            const dy = await readDanyao(player_id);

            newrandom -= Number(dy.beiyong1 || 0);
            if (dy.ped > 0) {
              dy.ped--;
            } else {
              dy.beiyong1 = 0;
              dy.ped = 0;
            }
            // 旧逻辑写回：无法直接存储状态对象，只能原样写回列表（保持兼容）
            await writeDanyao(player_id, dy);
            if (random > newrandom) {
              const xianchonkouliangList = await getDataList('Xianchonkouliang');
              const length = xianchonkouliangList.length;

              if (length > 0) {
                const index = Math.trunc(Math.random() * length);
                const kouliang = xianchonkouliangList[index];

                lastMessage
                  += '\n七彩流光的神奇仙谷[' + kouliang.name + ']深埋在土壤中，是仙兽们的最爱。';
                await addNajieThing(player_id, kouliang.name, '仙宠口粮', 1);
              }
            }
            if (random > 0.1 && random < 0.1002) {
              lastMessage
                += '\n'
                + playerB.名号
                + '倒下后,你正准备离开此地，看见路边草丛里有个长相奇怪的石头，顺手放进了纳戒。';
              await addNajieThing(player_id, '长相奇怪的小石头', '道具', 1);
            }
          } else if (msgg.find(item => item === winB)) {
            xiuwei = 800;
            lastMessage
              = '不巧撞见['
              + playerB.名号
              + '],经过一番战斗,败下阵来,还好跑得快,只获得了修为'
              + xiuwei
              + ']';
          }
          msg.push('\n' + player.名号 + lastMessage);
          const arr: ActionState = action;

          // 把状态都关了(强制置数字 1)
          arr.shutup = 1;
          arr.working = 1;
          arr.power_up = 1;
          arr.Place_action = 1;
          arr.Place_actionplus = 1;
          arr.end_time = Date.now();
          delete arr.group_id;
          await setDataByUserId(player_id, 'action', JSON.stringify(arr));
          await addExp2(player_id, qixue);
          await addExp(player_id, xiuwei);
          await addHP(player_id, dataBattle.A_xue);
          if (isGroup && push_address) {
            pushInfo(push_address, isGroup, msg);
          } else {
            pushInfo(player_id, isGroup, msg);
          }
        }
      }
    }
  }
};
