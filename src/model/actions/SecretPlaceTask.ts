import { getDataList } from '@src/model/DataList';
import { notUndAndNull } from '@src/model/common';
import { delDataByKey, readPlayer } from '@src/model';
import { zdBattle } from '@src/model/battle';
import { addNajieThing } from '@src/model/najie';
import { addExp2, addExp, addHP } from '@src/model/economy';
import { __PATH, keysAction } from '@src/model/keys';
import { DataMention, Text } from 'alemonjs';
import type { CoreNajieCategory as NajieCategory, ActionRecord } from '@src/types';
import { writePlayer } from '@src/model';
import { NAJIE_CATEGORIES } from '@src/model/settions';
import type { Player } from '@src/types/player';
import { pushMessage } from '../MessageSystem';

function isNajieCategory(v: any): v is NajieCategory {
  return typeof v === 'string' && (NAJIE_CATEGORIES as readonly string[]).includes(v);
}

interface BattlePlayer {
  名号: string;
  攻击: number;
  防御: number;
  当前血量: number;
  暴击率: number;
  法球倍率: number;
  灵根: {
    name: string;
    type: string;
    法球倍率: number;
  };
  仙宠: any;
}

interface LuckyBonus {
  message: string;
  quantity: number;
}

/**
 * 基础奖励配置
 */
const BASE_REWARDS = {
  XIUWEI_BASE: 2000,
  QIXUE_BASE: 2000,
  LEVEL_MULTIPLIER: 100,
  PHYSIQUE_MULTIPLIER: 100,
  DEFEAT_XIUWEI: 800
} as const;

/**
 * 特殊地点配置
 */
const SPECIAL_PLACES = {
  DAQIAN_SHIJIE: '大千世界',
  XIANJIE_KUANGCHANG: '仙界矿场',
  TAIJI_YANG: '太极之阳',
  TAIJI_YIN: '太极之阴',
  ZHUSHEN_HUANGHUN: '诸神黄昏·旧神界'
} as const;

/**
 * 创建玩家战斗数据
 * @param player 玩家数据
 * @returns 战斗数据
 */
const createBattlePlayer = (player: Player): BattlePlayer => {
  return {
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
};

/**
 * 获取地点buff系数
 * @param placeName 地点名称
 * @returns buff系数
 */
const getPlaceBuff = (placeName: string): number => {
  if (placeName === SPECIAL_PLACES.DAQIAN_SHIJIE || placeName === SPECIAL_PLACES.XIANJIE_KUANGCHANG) {
    return 0.6;
  }

  return 1;
};

/**
 * 获取随机怪物
 * @param monsterList 怪物列表
 * @returns 怪物数据
 */
const getRandomMonster = (monsterList: any[]): any => {
  if (monsterList.length === 0) {
    return null;
  }
  const monsterIndex = Math.trunc(Math.random() * monsterList.length);

  return monsterList[monsterIndex];
};

/**
 * 创建怪物战斗数据
 * @param monster 怪物数据
 * @param player 玩家数据
 * @param buff buff系数
 * @returns 怪物战斗数据
 */
const createMonsterBattleData = (monster: any, player: Player, buff: number): BattlePlayer => {
  return {
    名号: monster.名号,
    攻击: Math.floor(Number(monster.攻击 ?? 0) * player.攻击 * buff),
    防御: Math.floor(Number(monster.防御 ?? 0) * player.防御 * buff),
    当前血量: Math.floor(Number(monster.当前血量 ?? 0) * player.血量上限 * buff),
    暴击率: Number(monster.暴击率 ?? 0) * buff,
    法球倍率: 0.1,
    灵根: { name: '野怪', type: '普通', 法球倍率: 0.1 }
  };
};

/**
 * 获取随机物品
 * @param weizhi 位置信息
 * @param config 配置信息
 * @returns 物品信息和奖励系数
 */
const getRandomItem = (
  weizhi: any,
  config: any
): { item?: { name: string; class: NajieCategory }; message: string; t1: number; t2: number; quantity: number } => {
  const random1 = Math.random();
  const random2 = Math.random();
  const random3 = Math.random();

  if (random1 <= config.SecretPlace.one) {
    if (random2 <= config.SecretPlace.two) {
      if (random3 <= config.SecretPlace.three && weizhi.three.length > 0) {
        const random4 = Math.floor(Math.random() * weizhi.three.length);
        const item = weizhi.three[random4];

        return {
          item: {
            name: item.name,
            class: isNajieCategory(item.class) ? item.class : '道具'
          },
          message: `抬头一看，金光一闪！有什么东西从天而降，定睛一看，原来是：[${item.name}`,
          t1: 2 + Math.random(),
          t2: 2 + Math.random(),
          quantity: 1
        };
      } else if (weizhi.two.length > 0) {
        const random4 = Math.floor(Math.random() * weizhi.two.length);
        const item = weizhi.two[random4];
        let quantity = 1;
        let message = `在洞穴中拿到[${item.name}`;

        if (weizhi.name === SPECIAL_PLACES.TAIJI_YANG || weizhi.name === SPECIAL_PLACES.TAIJI_YIN) {
          quantity = 5;
          message = '捡到了[' + item.name;
        }

        return {
          item: {
            name: item.name,
            class: isNajieCategory(item.class) ? item.class : '道具'
          },
          message,
          t1: 1 + Math.random(),
          t2: 1 + Math.random(),
          quantity
        };
      }
    } else if (weizhi.one.length > 0) {
      const random4 = Math.floor(Math.random() * weizhi.one.length);
      const item = weizhi.one[random4];
      let quantity = 1;
      let message = `捡到了[${item.name}`;

      if (weizhi.name === SPECIAL_PLACES.ZHUSHEN_HUANGHUN) {
        quantity = item.name === '洗根水' ? 130 : 100;
        message = '捡到了[' + item.name;
      } else if (weizhi.name === SPECIAL_PLACES.TAIJI_YANG || weizhi.name === SPECIAL_PLACES.TAIJI_YIN) {
        quantity = 5;
        message = '捡到了[' + item.name;
      }

      return {
        item: {
          name: item.name,
          class: isNajieCategory(item.class) ? item.class : '道具'
        },
        message,
        t1: 0.5 + Math.random() * 0.5,
        t2: 0.5 + Math.random() * 0.5,
        quantity
      };
    }
  }

  return {
    message: '走在路上看见了一只蚂蚁！蚂蚁大仙送了你[起死回生丹',
    t1: 0.5 + Math.random() * 0.5,
    t2: 0.5 + Math.random() * 0.5,
    quantity: 1
  };
};

/**
 * 检查幸运加成
 * @param player 玩家数据
 * @param placeName 地点名称
 * @returns 幸运加成信息
 */
const checkLuckyBonus = (player: Player, placeName: string): LuckyBonus => {
  if (placeName === SPECIAL_PLACES.ZHUSHEN_HUANGHUN) {
    return { message: '', quantity: 1 };
  }

  const random = Math.random();

  if (random < player.幸运) {
    let message = '';

    if (random < player.addluckyNo) {
      message = '福源丹生效，所以在';
    } else if (player.仙宠?.type === '幸运') {
      message = '仙宠使你在探索中欧气满满，所以在';
    }

    message += '本次探索中获得赐福加成\n';

    return {
      message,
      quantity: 2
    };
  }

  return {
    message: '',
    quantity: 1
  };
};

/**
 * 处理福源丹效果
 * @param playerId 玩家ID
 * @param player 玩家数据
 * @param placeName 地点名称
 */
const handleLuckyPill = async (playerId: string, player: Player, placeName: string): Promise<void> => {
  if (placeName === SPECIAL_PLACES.ZHUSHEN_HUANGHUN || (player.islucky || 0) <= 0) {
    return;
  }

  player.islucky--;

  if (player.islucky === 0) {
    player.幸运 -= player.addluckyNo;
    player.addluckyNo = 0;
  }

  await writePlayer(playerId, player);
};

/**
 * 计算探索奖励
 * @param player 玩家数据
 * @param t1 修为系数
 * @param t2 气血系数
 * @param isVictory 是否胜利
 * @returns 奖励数值
 */
const calculateRewards = (player: Player, t1: number, t2: number, isVictory: boolean): { xiuwei: number; qixue: number } => {
  if (!isVictory) {
    return {
      xiuwei: BASE_REWARDS.DEFEAT_XIUWEI,
      qixue: 0
    };
  }

  const levelId = player.level_id ?? 0;
  const physiqueId = player.Physique_id ?? 0;

  const xiuwei = Math.trunc(BASE_REWARDS.XIUWEI_BASE + (BASE_REWARDS.LEVEL_MULTIPLIER * levelId * levelId * t1 * 0.1) / 5);
  const qixue = Math.trunc(BASE_REWARDS.QIXUE_BASE + BASE_REWARDS.PHYSIQUE_MULTIPLIER * physiqueId * physiqueId * t2 * 0.1);

  return { xiuwei, qixue };
};

/**
 * 处理特殊掉落
 * @param playerId 玩家ID
 * @param random 随机数
 * @returns 特殊掉落消息
 */
const handleSpecialDrops = async (playerId: string, random: number): Promise<string> => {
  let message = '';

  // 万分之一出神迹
  if (random > 0.995) {
    const xianchonkouliangList = await getDataList('Xianchonkouliang');

    if (xianchonkouliangList.length > 0) {
      const index = Math.trunc(Math.random() * xianchonkouliangList.length);
      const kouliang = xianchonkouliangList[index];

      message += '\n七彩流光的神奇仙谷[' + kouliang.name + ']深埋在土壤中，是仙兽们的最爱。';
      await addNajieThing(playerId, kouliang.name, '仙宠口粮', 1);
    }
  }

  // 特殊石头掉落
  if (random > 0.1 && random < 0.1002) {
    message += '\n倒下后,你正准备离开此地，看见路边草丛里有个长相奇怪的石头，顺手放进了纳戒。';
    await addNajieThing(playerId, '长相奇怪的小石头', '道具', 1);
  }

  return message;
};

/**
 * 处理单个玩家的秘境探索
 * @param playerId 玩家ID
 * @param action 动作状态
 * @param monsterList 怪物列表
 * @param config 配置信息
 * @returns 是否处理成功
 */
const processPlayerExploration = async (playerId: string, action: ActionRecord, monsterList: any[], config: any): Promise<boolean> => {
  try {
    let pushAddress: string | undefined;
    let isGroup = false;

    if ('group_id' in action && notUndAndNull(action.group_id)) {
      isGroup = true;
      pushAddress = action.group_id;
    }

    let endTime = action.end_time;
    const nowTime = Date.now();
    const player = await readPlayer(playerId);

    if (!player) {
      return false;
    }

    if (action.Place_action === '0') {
      // 提前2分钟结算
      endTime = endTime - 60000 * 2;

      if (nowTime > endTime) {
        const weizhi = action.Place_address;

        if (!weizhi) {
          return false;
        }

        const playerA = createBattlePlayer(player);
        const buff = getPlaceBuff(weizhi.name);
        const monster = getRandomMonster(monsterList);

        if (!monster) {
          return false;
        }

        const playerB = createMonsterBattleData(monster, player, buff);
        const dataBattle = await zdBattle(playerA, playerB);
        const msgg = dataBattle.msg;
        const winA = `${playerA.名号}击败了${playerB.名号}`;
        const isVictory = msgg.find(item => item === winA) !== undefined;

        // 获取随机物品
        const { item, message, t1, t2, quantity: baseQuantity } = getRandomItem(weizhi, config);

        // 检查幸运加成
        const luckyBonus = checkLuckyBonus(player, weizhi.name);
        const finalQuantity = baseQuantity * luckyBonus.quantity;

        // 处理福源丹效果
        await handleLuckyPill(playerId, player, weizhi.name);

        // 计算奖励
        const { xiuwei, qixue } = calculateRewards(player, t1, t2, isVictory);

        // 添加物品奖励
        if (item) {
          await addNajieThing(playerId, item.name, item.class, finalQuantity);
        } else if (message.includes('起死回生丹')) {
          await addNajieThing(playerId, '起死回生丹', '丹药', 1);
        }

        let lastMessage = luckyBonus.message;
        const finalMessage = message + `]×${finalQuantity}个。`;

        if (isVictory) {
          lastMessage += `${finalMessage}不巧撞见[${playerB.名号}],经过一番战斗,击败对手,获得修为${xiuwei},气血${qixue},剩余血量${playerA.当前血量 + dataBattle.A_xue}`;

          // 处理特殊掉落
          const random = Math.random();
          const specialDropsMessage = await handleSpecialDrops(playerId, random);

          lastMessage += specialDropsMessage;
        } else {
          lastMessage = `不巧撞见[${playerB.名号}],经过一番战斗,败下阵来,还好跑得快,只获得了修为${xiuwei}]`;
        }

        // 发送消息
        const msg: Array<DataMention | string> = [];

        msg.push('\n' + player.名号 + lastMessage);

        // 关闭所有状态
        void delDataByKey(keysAction.action(playerId));

        await addExp2(playerId, qixue);
        await addExp(playerId, xiuwei);
        await addHP(playerId, dataBattle.A_xue);

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
 * 秘境任务 - 处理玩家秘境探索
 * 遍历所有玩家，检查处于秘境探索状态的玩家，进行结算处理
 * @description Place_action 为 0 时，进行探索
 */
export const handelAction = async (playerId: string, action, { monsterList, config }): Promise<void> => {
  try {
    if (!monsterList || monsterList.length === 0) {
      return;
    }

    if (!config) {
      return;
    }
    await processPlayerExploration(playerId, action, monsterList, config);
  } catch (error) {
    logger.error(error);
  }
};
