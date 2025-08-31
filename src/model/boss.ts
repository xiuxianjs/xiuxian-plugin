import * as _ from 'lodash-es';
import { pushInfo, redis } from '@src/model/api';
import { readPlayer } from '@src/model/xiuxiandata';
import { __PATH, KEY_RECORD, KEY_RECORD_TWO, KEY_WORLD_BOOS_STATUS_INIT, KEY_WORLD_BOOS_STATUS_INIT_TWO, keys, keysByPath } from '@src/model/keys';
import { KEY_WORLD_BOOS_STATUS, KEY_WORLD_BOOS_STATUS_TWO } from '@src/model/settions';
import { getAuctionKeyManager } from './auction';
import dayjs from 'dayjs';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl';
import { Image, Text, useSend } from 'alemonjs';
import { Player } from '@src/types';
import { WorldBossStatus, WorldBossPlayerRecord } from '@src/types/task';
import { screenshot } from '@src/image';
import { getAvatar } from './utils/utilsx';
import { zdBattle, Harm } from './battle';
import { addCoin, addHP } from './economy';
import { getConfig } from './Config';

const bossKeys = {
  1: {
    init: KEY_WORLD_BOOS_STATUS_INIT,
    status: KEY_WORLD_BOOS_STATUS,
    record: KEY_RECORD
  },
  2: {
    init: KEY_WORLD_BOOS_STATUS_INIT_TWO,
    status: KEY_WORLD_BOOS_STATUS_TWO,
    record: KEY_RECORD_TWO
  }
};

export const isBossWord = async () => {
  const now = dayjs();

  const cfg = await getConfig('xiuxian', 'xiuxian');

  const time = cfg.bossTime[1];

  const wordStartTime = dayjs().hour(time.start.hour).minute(time.start.minute).second(0).millisecond(0);
  const wordEndTime = dayjs().hour(time.end.hour).minute(time.end.minute).second(0).millisecond(0);

  return now.isAfter(wordStartTime) && now.isBefore(wordEndTime);
};

export const isBossWord2 = async () => {
  const now = dayjs();

  const cfg = await getConfig('xiuxian', 'xiuxian');

  const time = cfg.bossTime[2];

  const wordStartTime = dayjs().hour(time.start.hour).minute(time.start.minute).second(0).millisecond(0);
  const wordEndTime = dayjs().hour(time.end.hour).minute(time.end.minute).second(0).millisecond(0);

  return now.isAfter(wordStartTime) && now.isBefore(wordEndTime);
};

// 进程内存cd
export const WorldBossBattleInfo = {
  CD: {},
  setCD(userId: string, time: number) {
    this.CD[userId] = time;
  }
};

// 初始化妖王
export async function InitWorldBoss() {
  const k = bossKeys[1];

  await redis.set(k.init, '1', 'EX', 10 * 60 * 60);

  const averageDamageStruct = await GetAverageDamage();
  let playerQuantity = Math.floor(averageDamageStruct.player_quantity);
  let averageDamage = Math.floor(averageDamageStruct.AverageDamage);
  let reward = 12000000;

  if (playerQuantity < 5) {
    playerQuantity = 6;
    averageDamage = 12000000;
    reward = 6000000;
  }
  const x = averageDamage * 0.05;

  const health = Math.trunc(x * 150 * playerQuantity * 3); // 血量要根据人数来

  await redis.set(
    k.status,
    JSON.stringify({
      Health: health,
      Healthmax: health,
      KilledTime: -1,
      Reward: reward
    })
  );
  await redis.set(k.record, '0');

  // 全服推送
  const msg = '【全服公告】妖王已经苏醒,击杀者额外获得100w灵石';
  const auctionKeyManager = getAuctionKeyManager();
  const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
  const groupList = await redis.smembers(groupListKey);

  for (const group of groupList) {
    pushInfo(group, true, msg);
  }

  return false;
}

export const bossStatus = async (key: '1' | '2') => {
  // 如果未初始化。则进行初始化。提示在初始化，让玩家重新进行攻击。
  const initStatus = await getDataJSONParseByKey(bossKeys[key].init);

  if (!initStatus) {
    if (key === '1') {
      void InitWorldBoss();
    } else {
      void InitWorldBoss2();
    }

    return 'initializing'; // Boss正在初始化
  }

  // 检查Boss是否已经死亡
  const statusStr = await getDataJSONParseByKey(bossKeys[key].status);

  if (statusStr && statusStr.Health <= 0) {
    return 'dead'; // Boss已死亡
  }

  return ''; // Boss正常，可以攻击
};

export async function InitWorldBoss2() {
  const k = bossKeys[2];

  // 设置 key。并在1h后删除
  await redis.set(k.init, '1', 'EX', 10 * 60 * 60);

  const averageDamageStruct = await GetAverageDamage();
  let playerQuantity = Math.floor(averageDamageStruct.player_quantity);
  let averageDamage = Math.floor(averageDamageStruct.AverageDamage);
  let reward = 6000000;

  if (playerQuantity < 5) {
    playerQuantity = 6;
    averageDamage = 6000000;
    reward = 6000000;
  }
  const x = averageDamage * 0.01;

  const health = Math.trunc(x * 150 * playerQuantity * 2); // 血量要根据人数来

  await redis.set(
    k.status,
    JSON.stringify({
      Health: health,
      Healthmax: health,
      KilledTime: -1,
      Reward: reward
    })
  );
  await redis.set(k.record, '0');

  /**
   * 全服推送
   */
  const msg = '【全服公告】金角大王已经苏醒,击杀者额外获得50w灵石';
  const auctionKeyManager = getAuctionKeyManager();
  const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
  const groupList = await redis.smembers(groupListKey);

  for (const groupId of groupList) {
    pushInfo(groupId, true, msg);
  }

  return false;
}

// 获取玩家平均实力和化神以上人数
export async function GetAverageDamage() {
  const playerList = await keysByPath(__PATH.player_path);
  const temp: number[] = [];
  let totalPlayer = 0;

  await Promise.all(
    playerList.map(async p => {
      const player = await readPlayer(p);

      if (!player) {
        return;
      }
      if (player.level_id > 21 && player.level_id < 42 && player.lunhui === 0) {
        temp[totalPlayer] = parseInt(String(player.攻击));
        totalPlayer++;
      }
    })
  );

  // 排序
  temp.sort(function (a, b) {
    return b - a;
  });
  let averageDamage = 0;

  if (totalPlayer > 15) {
    for (let i = 2; i < temp.length - 4; i++) {
      averageDamage += temp[i];
    }
  } else {
    for (let i = 0; i < temp.length; i++) {
      averageDamage += temp[i];
    }
  }
  averageDamage = totalPlayer > 15 ? averageDamage / (temp.length - 6) : temp.length === 0 ? 0 : averageDamage / temp.length;

  return { player_quantity: totalPlayer, AverageDamage: averageDamage };
}

// 排序 - 修复重复值处理问题
export function SortPlayer(playerRecordJSON) {
  if (!playerRecordJSON?.TotalDamage) {
    return [];
  }

  // 创建索引和伤害的配对数组
  const indexedDamage = playerRecordJSON.TotalDamage.map((damage, index) => ({
    index,
    damage
  }));

  // 按伤害降序排序，相同伤害按索引升序排序
  indexedDamage.sort((a, b) => {
    if (b.damage !== a.damage) {
      return b.damage - a.damage;
    }

    return a.index - b.index;
  });

  // 提取排序后的索引
  return indexedDamage.map(item => item.index);
}

/**
 *
 * @param e
 * @param userId
 * @param player
 * @param boss
 * @returns
 */
export const WorldBossBattle = async (
  e,
  {
    userId,
    player,
    boss,
    key,
    // 终结灵石
    endLingshi,
    // 均分灵石
    averageLingshi
  }: {
    userId: string;
    player: Player;
    boss: WorldBossStatus;
    key: '1' | '2';
    endLingshi: number;
    averageLingshi: number;
  }
) => {
  const Send = useSend(e);

  // 读取boss数据
  const statusStr = await getDataJSONParseByKey(bossKeys[key].status);

  if (!statusStr) {
    void Send(Text('状态数据缺失, 请联系管理员重新开启!'));

    return false;
  }

  // 读取战斗记录
  const recordStr = await getDataJSONParseByKey(bossKeys[key].record);

  // 玩家伤害记录
  let playerRecordJson: WorldBossPlayerRecord | null = null;
  let userIdx = 0;

  if (!recordStr || +recordStr === 0) {
    playerRecordJson = { QQ: [String(userId)], TotalDamage: [0], Name: [player.名号] };
  } else {
    playerRecordJson = recordStr as WorldBossPlayerRecord;
    userIdx = playerRecordJson.QQ.indexOf(String(userId));
    if (userIdx === -1) {
      playerRecordJson.QQ.push(String(userId));
      playerRecordJson.Name.push(player.名号);
      playerRecordJson.TotalDamage.push(0);
      userIdx = playerRecordJson.QQ.length - 1;
    }
  }

  player.法球倍率 = player.灵根?.法球倍率;

  const dataBattle = await zdBattle(player, boss);

  const msg = dataBattle.msg;

  const winA = `${player.名号}击败了${boss.名号}`;
  const winB = `${boss.名号}击败了${player.名号}`;

  let dealt = 0;
  const playerWin = msg.includes(winA);
  const bossWin = msg.includes(winB);

  // 显示Boss当前状态
  const bossStatus = statusStr as WorldBossStatus;

  const powerA = player.攻击 + player.防御 + player.当前血量;
  const powerB = boss.攻击 + bossStatus.Health + bossStatus.Healthmax;
  const postImage = async () => {
    const img = await screenshot('CombatResult', userId, {
      msg: msg,
      playerA: {
        id: userId,
        name: player.名号,
        avatar: getAvatar(userId),
        power: powerA ?? 0,
        hp: player.当前血量,
        maxHp: player.血量上限
      },
      playerB: {
        id: '1715713638',
        name: boss.名号,
        avatar: getAvatar('1715713638'),
        power: powerB ?? 0,
        hp: bossStatus.Health,
        maxHp: bossStatus.Healthmax
      },
      result: msg.includes(winA) ? 'A' : msg.includes(winB) ? 'B' : 'draw'
    });

    if (Buffer.isBuffer(img)) {
      void Send(Image(img));
    }
  };

  void postImage();

  if (playerWin) {
    // 玩家胜利时对Boss造成伤害
    dealt = Math.trunc(bossStatus.Healthmax * 0.06 + Harm(player.攻击 * 0.85, boss.防御) * 10);
    bossStatus.Health -= dealt;
    // 确保Boss血量不为负数
    if (bossStatus.Health < 0) {
      bossStatus.Health = 0;
    }
    void Send(Text(`${player.名号}击败了[${boss.名号}],重创[${boss.名号}],造成伤害${dealt}`));
  } else if (bossWin) {
    // Boss胜利时，玩家只造成少量伤害
    dealt = Math.trunc(bossStatus.Healthmax * 0.02 + Harm(player.攻击 * 0.85, boss.防御) * 2);
    bossStatus.Health -= dealt;
    // 确保Boss血量不为负数
    if (bossStatus.Health < 0) {
      bossStatus.Health = 0;
    }
    void Send(Text(`${player.名号}被[${boss.名号}]击败了,只对[${boss.名号}]造成了${dealt}伤害`));
  }

  const random = Math.random();

  if (random < 0.05 && playerWin) {
    // 玩家胜利时，Boss使用古典秘籍回复血量
    void Send(Text(`这场战斗重创了[${boss.名号}]，${boss.名号}使用了古典秘籍,血量回复了10%`));
    bossStatus.Health += Math.trunc(bossStatus.Healthmax * 0.1);
    // 确保Boss血量不超过最大值
    if (bossStatus.Health > bossStatus.Healthmax) {
      bossStatus.Health = bossStatus.Healthmax;
    }
    // 调整玩家血量
    await addHP(userId, dataBattle.A_xue);
  } else if (random > 0.95 && bossWin) {
    // Boss胜利时，韩立助阵
    const extra = Math.trunc(bossStatus.Health * 0.15);

    dealt += extra;
    bossStatus.Health -= extra;
    // 确保Boss血量不为负数
    if (bossStatus.Health < 0) {
      bossStatus.Health = 0;
    }
    void Send(Text(`危及时刻,万先盟-韩立前来助阵,对[${boss.名号}]造成${extra}伤害,并治愈了你的伤势`));
    // 恢复玩家部分血量，而不是满血
    await addHP(userId, Math.trunc(player.血量上限 * 0.3));
  } else {
    // 正常情况下的血量调整
    await addHP(userId, dataBattle.A_xue);
  }

  // 只有在玩家对Boss造成伤害时才记录
  if (dealt > 0) {
    playerRecordJson.TotalDamage[userIdx] += dealt;
  }

  // 保存Boss当前状态（每次攻击后都要保存）
  await setDataJSONStringifyByKey(bossKeys[key].status, bossStatus);

  // 保存战斗记录
  if (playerRecordJson) {
    await setDataJSONStringifyByKey(bossKeys[key].record, playerRecordJson);
  }

  if (bossStatus.Health <= 0) {
    await addCoin(userId, endLingshi);

    const killMsg = `【全服公告】${player.名号}亲手结果了${boss.名号}的性命,为民除害,额外获得${endLingshi}灵石奖励！`;
    const auctionKeyManager = getAuctionKeyManager();
    const groupListKey = await auctionKeyManager.getAuctionGroupListKey();

    // 集合数据需要使用smembers方法获取成员
    const groups = await redis.smembers(groupListKey);

    if (Array.isArray(groups)) {
      for (const g of groups) {
        pushInfo(g, true, killMsg);
      }
    }

    bossStatus.KilledTime = Date.now();

    // 保存记录
    await setDataJSONStringifyByKey(bossKeys[key].status, bossStatus);

    const playerList = SortPlayer(playerRecordJson);

    const showMax = Math.min(playerList.length, 20);
    let topSum = 0;

    if (playerRecordJson) {
      for (let i = 0; i < showMax; i++) {
        topSum += playerRecordJson.TotalDamage[playerList[i]];
      }
    }

    // 如果总伤害为0，则平均分配奖励
    if (topSum <= 0) {
      topSum = 1; // 避免除零错误
    }

    const rewardMsg: string[] = [`****${boss.名号}贡献排行榜****`];

    if (playerRecordJson) {
      for (let i = 0; i < playerList.length; i++) {
        const idx = playerList[i];
        const qq = String(playerRecordJson.QQ[idx]);
        const cur = await getDataJSONParseByKey(keys.player(qq));

        if (!cur) {
          continue;
        }

        const playerData = cur as Player;

        const lingshi = averageLingshi;

        if (i < showMax) {
          // 计算奖励，避免除零错误
          let reward = 0;

          if (topSum > 0) {
            reward = Math.trunc((playerRecordJson.TotalDamage[idx] / topSum) * bossStatus.Reward);
          } else {
            // 如果总伤害为0，平均分配奖励
            reward = Math.trunc(bossStatus.Reward / showMax);
          }

          // 确保奖励不为负数或无效值
          if (!Number.isFinite(reward) || reward < lingshi) {
            reward = lingshi;
          }

          rewardMsg.push(`第${i + 1}名:\n名号:${playerData.名号}\n伤害:${playerRecordJson.TotalDamage[idx]}\n获得灵石奖励${reward}`);
          playerData.灵石 += reward;
          await setDataJSONStringifyByKey(keys.player(qq), playerData);
        } else {
          // 参与但未进入前20名的玩家获得基础奖励
          playerData.灵石 += lingshi;
          await setDataJSONStringifyByKey(keys.player(qq), playerData);

          if (i === playerList.length - 1) {
            rewardMsg.push(`其余参与的修仙者均获得${lingshi}灵石奖励！`);
          }
        }
      }
    }

    void Send(Text(rewardMsg.join('\n')));
  }
};
