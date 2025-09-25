import { notUndAndNull } from '@src/model/common';
import { delDataByKey, readPlayer, setDataJSONStringifyByKey, writePlayer } from '@src/model';
import { existNajieThing, addNajieThing } from '@src/model/najie';
import { zdBattle } from '@src/model/battle';
import { readDanyao, writeDanyao } from '@src/model/danyao';
import { addExp2, addExp } from '@src/model/economy';
import { __PATH, keysAction } from '@src/model/keys';
import { Text } from 'alemonjs';
import type { CoreNajieCategory as NajieCategory } from '@src/types';
import { getDataList } from '@src/model/DataList';
import type { Player } from '@src/types/player';
import { pushMessage } from '../MessageSystem';

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
  Place_actionplus?: number;
  Place_address?: SecretPlaceAddress;
  cishu: number;
  group_id?: string | number;
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

interface ExplorationResult {
  message: string;
  thingName?: string;
  thingClass?: NajieCategory;
  quantity: number;
  xiuwei: number;
  qixue: number;
  isVictory: boolean;
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
  TAIJI_YANG: '太极之阳',
  TAIJI_YIN: '太极之阴',
  ZHUSHEN_HUANGHUN: '诸神黄昏·旧神界'
} as const;

/**
 * 血量阈值配置
 */
const HEALTH_THRESHOLD = 0.3;

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
 * @returns 怪物战斗数据
 */
const createMonsterBattleData = (monster: any, player: Player): BattlePlayer => {
  return {
    名号: monster.名号,
    攻击: Math.floor(Number(monster.攻击 || 0) * player.攻击),
    防御: Math.floor(Number(monster.防御 || 0) * player.防御),
    当前血量: Math.floor(Number(monster.当前血量 || 0) * player.血量上限),
    暴击率: monster.暴击率 || 0,
    法球倍率: 0.1,
    灵根: { name: '野怪', type: '普通', 法球倍率: 0.1 }
  };
};

/**
 * 检查并处理玩家血量
 * @param playerId 玩家ID
 * @param player 玩家数据
 */
const handlePlayerHealth = async (playerId: string, player: Player): Promise<void> => {
  if (player.当前血量 < HEALTH_THRESHOLD * player.血量上限) {
    if (await existNajieThing(playerId, '起死回生丹', '丹药')) {
      player.当前血量 = player.血量上限;
      await addNajieThing(playerId, '起死回生丹', '丹药', -1);
      await writePlayer(playerId, player);
    }
  }
};

/**
 * 获取随机物品
 * @param weizhi 位置信息
 * @param config 配置信息
 * @returns 物品信息和奖励系数
 */
const getRandomItem = (
  weizhi: SecretPlaceAddress,
  config: any
): { item?: { name: string; class: NajieCategory }; message: string; t1: number; t2: number; quantity: number } => {
  const random1 = Math.random();
  const random2 = Math.random();
  const random3 = Math.random();
  const x = Number(config.SecretPlace.one) || 0;
  const y = Number(config.SecretPlace.two) || 0;
  const z = Number(config.SecretPlace.three) || 0;

  if (random1 <= x) {
    if (random2 <= y) {
      if (random3 <= z && weizhi.three.length > 0) {
        const random4 = Math.floor(Math.random() * weizhi.three.length);
        const item = weizhi.three[random4];

        return {
          item: {
            name: item.name,
            class: item.class || '道具'
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
            class: item.class || '道具'
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
          class: item.class || '道具'
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

  if (random < (Number(player.幸运) || 0)) {
    if (random < (Number(player.addluckyNo) || 0)) {
      // 福源丹生效，但消息为空
    } else if (player.仙宠?.type === '幸运') {
      // 仙宠生效，但消息为空
    }

    return {
      message: '',
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
 * @returns 福源丹消息
 */
const handleLuckyPill = async (playerId: string, player: Player, placeName: string): Promise<string> => {
  if (placeName === SPECIAL_PLACES.ZHUSHEN_HUANGHUN || (player.islucky ?? 0) <= 0) {
    return '';
  }

  player.islucky--;
  let message = '';

  if (player.islucky !== 0) {
    message = `  \n福源丹的效力将在${player.islucky}次探索后失效\n`;
  } else {
    message = '  \n本次探索后，福源丹已失效\n';
    player.幸运 = Number(player.幸运 ?? 0) - Number(player.addluckyNo ?? 0);
    player.addluckyNo = 0;
  }

  await writePlayer(playerId, JSON.parse(JSON.stringify(player)));

  return message;
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

  const levelId = player.level_id || 0;
  const physiqueId = player.Physique_id || 0;

  const xiuwei = Math.trunc(BASE_REWARDS.XIUWEI_BASE + (BASE_REWARDS.LEVEL_MULTIPLIER * levelId * levelId * t1 * 0.1) / 5);
  const qixue = Math.trunc(BASE_REWARDS.QIXUE_BASE + BASE_REWARDS.PHYSIQUE_MULTIPLIER * physiqueId * physiqueId * t2 * 0.1);

  return { xiuwei, qixue };
};

/**
 * 处理特殊掉落
 * @param playerId 玩家ID
 * @param random 随机数
 * @param monsterName 怪物名称
 * @param threshold 掉落阈值，默认为0.995
 * @returns 特殊掉落消息
 */
const handleSpecialDrops = async (playerId: string, random: number, monsterName: string, threshold = 0.995): Promise<string> => {
  let message = '';

  // 万分之一出神迹（使用动态阈值）
  if (random > threshold) {
    const xianchonkouliang = await getDataList('Xianchonkouliang');

    if (xianchonkouliang.length > 0) {
      const index = Math.trunc(Math.random() * xianchonkouliang.length);
      const kouliang = xianchonkouliang[index];

      message += `\n七彩流光的神奇仙谷[${kouliang.name}]深埋在土壤中，是仙兽们的最爱。`;
      await addNajieThing(playerId, kouliang.name, '仙宠口粮', 1);
    }
  }

  // 特殊石头掉落
  if (random > 0.1 && random < 0.1002) {
    message += `\n${monsterName}倒下后,你正准备离开此地，看见路边草丛里有个长相奇怪的石头，顺手放进了纳戒。`;
    await addNajieThing(playerId, '长相奇怪的小石头', '道具', 1);
  }

  return message;
};

/**
 * 处理丹药效果
 * @param playerId 玩家ID
 * @param random 随机数
 * @returns 调整后的随机数
 */
const handleDanyaoEffect = async (playerId: string): Promise<number> => {
  const dy = await readDanyao(playerId);
  let newRandom = 0.995;

  // 应用仙缘效果
  newRandom -= Number(dy.beiyong1 || 0);

  if (dy.ped > 0) {
    dy.ped--;
  } else {
    dy.beiyong1 = 0;
    dy.ped = 0;
  }

  await writeDanyao(playerId, dy);

  return newRandom;
};

/**
 * 处理探索完成
 * @param playerId 玩家ID
 * @param player 玩家数据
 * @param action 动作状态
 * @param result 探索结果
 * @param luckyMessage 幸运消息
 * @param fydMessage 福源丹消息
 * @param pushAddress 推送地址
 * @param isGroup 是否群组
 * @param remainingCount 剩余次数
 */
const handleExplorationComplete = async (
  playerId: string,
  player: Player,
  action: ActionLike,
  result: ExplorationResult,
  luckyMessage: string,
  fydMessage: string,
  pushAddress: string | undefined,
  isGroup: boolean,
  remainingCount: number
): Promise<void> => {
  const msg: Array<string> = [];
  const lastMessage = `${result.message},获得修为${result.xiuwei},气血${result.qixue},剩余次数${remainingCount}`;

  msg.push('\n' + player.名号 + luckyMessage + lastMessage + fydMessage);

  const arr: ActionLike & {
    shutup?: number;
    working?: number;
    power_up?: number;
    Place_action?: number;
    Place_actionplus?: number;
  } = action;

  if (arr.cishu === 1) {
    // 关闭所有状态
    void delDataByKey(keysAction.action(playerId));

    await addExp2(playerId, result.qixue);
    await addExp(playerId, result.xiuwei);

    void pushMessage(
      {
        uid: playerId,
        cid: isGroup && pushAddress ? pushAddress : ''
      },
      [Text(msg.join(''))]
    );
  } else {
    // 继续探索
    arr.cishu = (arr.cishu || 0) - 1;
    await setDataJSONStringifyByKey(keysAction.action(playerId), arr);
    await addExp2(playerId, result.qixue);
    await addExp(playerId, result.xiuwei);

    void pushMessage(
      {
        uid: playerId,
        cid: isGroup && pushAddress ? pushAddress : ''
      },
      [Text(msg.join(''))]
    );
  }
};

/**
 * 处理单个玩家的秘境探索
 * @param playerId 玩家ID
 * @param action 动作状态
 * @param monsterList 怪物列表
 * @param config 配置信息
 * @returns 是否处理成功
 */
const processPlayerExploration = async (playerId: string, action: ActionLike, monsterList: any[], config: any): Promise<boolean> => {
  try {
    let pushAddress: string | undefined;
    let isGroup = false;

    if ('group_id' in action && notUndAndNull(action.group_id)) {
      isGroup = true;
      pushAddress = String(action.group_id);
    }

    let endTime = Number(action.end_time) || 0;
    const nowTime = Date.now();
    const player = await readPlayer(playerId);

    if (!player) {
      return false;
    }

    if (String(action.Place_actionplus) === '0') {
      const rawTime = action.time;
      const duration = typeof rawTime === 'string' ? parseInt(rawTime) : Number(rawTime);
      const safeDuration = Number.isFinite(duration) ? duration : 0;

      endTime = endTime - safeDuration;

      if (nowTime > endTime) {
        const weizhi = action.Place_address;

        if (!weizhi) {
          return false;
        }

        // 检查并处理玩家血量
        await handlePlayerHealth(playerId, player);

        const playerA = createBattlePlayer(player);
        const monster = getRandomMonster(monsterList);

        if (!monster) {
          return false;
        }

        const playerB = createMonsterBattleData(monster, player);
        const dataBattle = await zdBattle(playerA, playerB);
        const msgg = dataBattle.msg || [];
        const winA = `${playerA.名号}击败了${playerB.名号}`;
        const isVictory = msgg.includes(winA);

        // 获取随机物品
        const { item, message, t1, t2, quantity: baseQuantity } = getRandomItem(weizhi, config);

        // 检查幸运加成
        const luckyBonus = checkLuckyBonus(player, weizhi.name);
        const finalQuantity = baseQuantity * luckyBonus.quantity;

        // 处理福源丹效果
        const fydMessage = await handleLuckyPill(playerId, player, weizhi.name);

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
          lastMessage += `${finalMessage}不巧撞见[${playerB.名号}],经过一番战斗,击败对手,获得修为${xiuwei},气血${qixue},剩余血量${playerA.当前血量 + dataBattle.A_xue},剩余次数${(action.cishu || 0) - 1}`;

          // 处理特殊掉落
          const random = Math.random();

          // 获取仙缘丹调整后的阈值
          const adjustedThreshold = await handleDanyaoEffect(playerId);

          const specialDropsMessage = await handleSpecialDrops(playerId, random, playerB.名号, adjustedThreshold);

          lastMessage += specialDropsMessage;
        } else {
          lastMessage = `不巧撞见[${playerB.名号}],经过一番战斗,败下阵来,还好跑得快,只获得了修为${xiuwei},剩余血量${playerA.当前血量}`;
        }

        const result: ExplorationResult = {
          message: lastMessage,
          thingName: item?.name,
          thingClass: item?.class,
          quantity: finalQuantity,
          xiuwei,
          qixue,
          isVictory
        };

        // 处理探索完成
        await handleExplorationComplete(playerId, player, action, result, luckyBonus.message, fydMessage, pushAddress, isGroup, (action.cishu || 0) - 1);

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
 * 秘境增强任务 - 处理玩家秘境探索
 * 遍历所有玩家，检查处于秘境探索状态的玩家，进行结算处理
 * @description Place_actionplus 为 0 时，进行探索
 */
export const handelAction = async (playerId: string, action: ActionLike, { monsterList, config }): Promise<void> => {
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
