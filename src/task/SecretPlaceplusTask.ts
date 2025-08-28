import { pushInfo } from '@src/model/api';
import { notUndAndNull } from '@src/model/common';
import { readPlayer, writePlayer } from '@src/model/xiuxian';
import { existNajieThing, addNajieThing } from '@src/model/najie';
import { zdBattle } from '@src/model/battle';
import { readDanyao, writeDanyao } from '@src/model/danyao';
import { addExp2, addExp, addHP } from '@src/model/economy';
import { readTemp, writeTemp } from '@src/model/temp';
import { __PATH, keysByPath } from '@src/model/keys';
import { DataMention, Mention } from 'alemonjs';
import { getDataByUserId, setDataByUserId } from '@src/model/Redis';
import type { CoreNajieCategory as NajieCategory } from '@src/types';
import { getConfig } from '@src/model';
import { getDataList } from '@src/model/DataList';

// === 本文件局部类型声明，避免 any ===
interface SecretPlaceItem {
  name: string;
  class?: NajieCategory;
}
interface SecretPlaceAddress {
  name: string;
  one: SecretPlaceItem[];
  two: SecretPlaceItem[];
  three: SecretPlaceItem[];
}
interface ActionLike {
  end_time: number;
  time: number | string;
  Place_actionplus?: number; // 只在运行时使用数字判等
  Place_address?: SecretPlaceAddress;
  cishu: number;
  group_id?: string | number;
}
// 怪物最小结构
interface MonsterLike {
  名号: string;
  攻击: number;
  防御: number;
  当前血量: number;
  暴击率: number;
}

/**
 * 遍历所有玩家，检查每个玩家的当前动作（action），判断是否处于闭关（shutup === '0'）或降妖（working === '0'）状态。
对于闭关：
判断是否到达结算时间（提前2分钟）。
计算修为、血气等收益，处理炼丹师丹药、特殊道具加成，以及顿悟/走火入魔等随机事件。
更新玩家属性、道具、经验，并推送结算消息。
结算后关闭相关状态。
对于降妖：
判断是否到达结算时间（提前2分钟）。
计算灵石、血气等收益，处理各种随机事件（如额外收益、损失等）。
更新玩家属性、灵石，并推送结算消息。
结算后关闭相关状态。
兼容旧版数据结构，处理炼丹师丹药、特殊道具等逻辑。
 */
export const SecretPlaceplusTask = async () => {
  const playerList = await keysByPath(__PATH.player_path);

  for (const player_id of playerList) {
    const raw = await getDataByUserId(player_id, 'action');
    let action: ActionLike | null = null;

    try {
      action = raw ? (JSON.parse(raw) as ActionLike) : null;
    } catch {
      action = null;
    }
    if (!action) {
      continue;
    }

    let push_address: string | undefined;
    let isGroup = false;

    if ('group_id' in action && notUndAndNull(action.group_id)) {
      isGroup = true;
      push_address = String(action.group_id);
    }

    const msg: Array<DataMention | string> = [Mention(player_id)];
    let end_time = Number(action.end_time) || 0;
    const now_time = Date.now();
    const player = await readPlayer(player_id);

    if (!player) {
      continue;
    }

    if (String(action.Place_actionplus) === '0') {
      const rawTime = action.time;
      const duration = typeof rawTime === 'string' ? parseInt(rawTime) : Number(rawTime);
      const safeDuration = Number.isFinite(duration) ? duration : 0;

      end_time = end_time - safeDuration;
      if (now_time > end_time) {
        const weizhi = action.Place_address;

        if (!weizhi) {
          continue;
        }
        if (player.当前血量 < 0.3 * player.血量上限) {
          if (await existNajieThing(player_id, '起死回生丹', '丹药')) {
            player.当前血量 = player.血量上限;
            await addNajieThing(player_id, '起死回生丹', '丹药', -1);
            await writePlayer(player_id, player);
          }
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
        const monsterList = await getDataList('Monster');
        const monsterLength = monsterList.length;

        if (monsterLength === 0) {
          continue;
        }
        const monsterIndex = Math.trunc(Math.random() * monsterLength);
        const monster = monsterList[monsterIndex] as MonsterLike;
        const playerB = {
          名号: monster.名号,
          攻击: Math.floor(Number(monster.攻击 || 0) * player.攻击),
          防御: Math.floor(Number(monster.防御 || 0) * player.防御),
          当前血量: Math.floor(Number(monster.当前血量 || 0) * player.血量上限),
          暴击率: monster.暴击率 || 0,
          法球倍率: 0.1,
          灵根: { name: '野怪', type: '普通', 法球倍率: 0.1 }
        };
        const dataBattle = await zdBattle(playerA, playerB);
        const msgg = dataBattle.msg || [];
        const winA = `${playerA.名号}击败了${playerB.名号}`;
        const winB = `${playerB.名号}击败了${playerA.名号}`;
        let thingName: string | undefined;
        let thingClass: NajieCategory | undefined;
        const cf = await getConfig('xiuxian', 'xiuxian');
        const x = Number(cf.SecretPlace.one) || 0;
        const y = Number(cf.SecretPlace.two) || 0;
        const z = Number(cf.SecretPlace.three) || 0;
        const random1 = Math.random();
        const random2 = Math.random();
        const random3 = Math.random();
        let m = '';
        let fyd_msg = '';
        let t1 = 1;
        let t2 = 1;
        let n = 1;

        if (random1 <= x) {
          if (random2 <= y) {
            if (random3 <= z) {
              if (weizhi.three.length) {
                const random4 = Math.floor(Math.random() * weizhi.three.length);

                thingName = weizhi.three[random4].name;
                thingClass = weizhi.three[random4].class;
                m = `抬头一看，金光一闪！有什么东西从天而降，定睛一看，原来是：[${thingName}`;
                t1 = 2 + Math.random();
                t2 = 2 + Math.random();
              }
            } else if (weizhi.two.length) {
              const random4 = Math.floor(Math.random() * weizhi.two.length);

              thingName = weizhi.two[random4].name;
              thingClass = weizhi.two[random4].class;
              m = `在洞穴中拿到[${thingName}`;
              t1 = 1 + Math.random();
              t2 = 1 + Math.random();
              if (weizhi.name === '太极之阳' || weizhi.name === '太极之阴') {
                n = 5;
                m = '捡到了[' + thingName;
              }
            }
          } else if (weizhi.one.length) {
            const random4 = Math.floor(Math.random() * weizhi.one.length);

            thingName = weizhi.one[random4].name;
            thingClass = weizhi.one[random4].class;
            m = `捡到了[${thingName}`;
            t1 = 0.5 + Math.random() * 0.5;
            t2 = 0.5 + Math.random() * 0.5;
            if (weizhi.name === '诸神黄昏·旧神界') {
              n = thingName === '洗根水' ? 130 : 100;
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
          const random = Math.random();

          if (random < (Number(player.幸运) || 0)) {
            if (random < (Number(player.addluckyNo) || 0)) {
              m += '';
            } else if (player.仙宠?.type === '幸运') {
              m += '';
            }
            n *= 2;
          }
          if ((player.islucky ?? 0) > 0) {
            player.islucky--;
            if (player.islucky !== 0) {
              fyd_msg = `  \n福源丹的效力将在${player.islucky}次探索后失效\n`;
            } else {
              fyd_msg = '  \n本次探索后，福源丹已失效\n';
              player.幸运 = Number(player.幸运 ?? 0) - Number(player.addluckyNo ?? 0);
              player.addluckyNo = 0;
            }
            await writePlayer(player_id, JSON.parse(JSON.stringify(player)));
          }
        }
        m += `]×${n}个。`;
        let xiuwei = 0;
        const now_level_id = player.level_id || 0;
        const now_physique_id = player.Physique_id || 0;
        let qixue = 0;
        let lastMessage = '';

        if (msgg.includes(winA)) {
          xiuwei = Math.trunc(2000 + (100 * now_level_id * now_level_id * t1 * 0.1) / 5);
          qixue = Math.trunc(2000 + 100 * now_physique_id * now_physique_id * t2 * 0.1);
          if (thingName && thingClass) {
            await addNajieThing(player_id, thingName, thingClass, n);
          }
          lastMessage += `${m}不巧撞见[${playerB.名号}],经过一番战斗,击败对手,获得修为${xiuwei},气血${qixue},剩余血量${playerA.当前血量 + dataBattle.A_xue},剩余次数${(action.cishu || 0) - 1}`;
          const random = Math.random();
          let newrandom = 0.995;
          const dy = await readDanyao(player_id);

          newrandom -= Number(dy.beiyong1 || 0);
          if (dy.ped > 0) {
            dy.ped--;
          } else {
            dy.beiyong1 = 0;
            dy.ped = 0;
          }
          await writeDanyao(player_id, dy);
          if (random > newrandom) {
            const xianchonkouliang = await getDataList('Xianchonkouliang');
            const length = xianchonkouliang.length;

            if (length > 0) {
              const index = Math.trunc(Math.random() * length);
              const kouliang = xianchonkouliang[index];

              lastMessage += `\n七彩流光的神奇仙谷[${kouliang.name}]深埋在土壤中，是仙兽们的最爱。`;
              await addNajieThing(player_id, kouliang.name, '仙宠口粮', 1);
            }
          }
          if (random > 0.1 && random < 0.1002) {
            lastMessage += `\n${playerB.名号}倒下后,你正准备离开此地，看见路边草丛里有个长相奇怪的石头，顺手放进了纳戒。`;
            await addNajieThing(player_id, '长相奇怪的小石头', '道具', 1);
          }
        } else if (msgg.includes(winB)) {
          xiuwei = 800;
          lastMessage = `不巧撞见[${playerB.名号}],经过一番战斗,败下阵来,还好跑得快,只获得了修为${xiuwei},剩余血量${playerA.当前血量}`;
        }
        msg.push('\n' + player.名号 + lastMessage + fyd_msg);
        const arr: ActionLike & {
          shutup?: number;
          working?: number;
          power_up?: number;
          Place_action?: number;
          Place_actionplus?: number;
        } = action;

        if (arr.cishu === 1) {
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
        } else {
          arr.cishu = (arr.cishu || 0) - 1;
          await setDataByUserId(player_id, 'action', JSON.stringify(arr));
          await addExp2(player_id, qixue);
          await addExp(player_id, xiuwei);
          await addHP(player_id, dataBattle.A_xue);
          try {
            const temp = await readTemp();
            const p: { msg: string; qq_group?: string | undefined } = {
              msg: player.名号 + lastMessage + fyd_msg,
              qq_group: push_address
            };

            temp.push(p);
            await writeTemp(temp);
          } catch {
            const temp: Array<Record<string, unknown>> = [];
            const p = {
              msg: player.名号 + lastMessage + fyd_msg,
              qq: player_id,
              qq_group: push_address
            };

            temp.push(p);
            await writeTemp(temp);
          }
        }
      }
    }
  }
};
