import { EventsMessageCreateEnum, useSend, Text } from 'alemonjs';
import * as _ from 'lodash-es';
import { pushInfo, redis } from '@src/model/api';
import { readPlayer, existplayer as existPlayer, existplayer, writePlayer } from '@src/model/xiuxiandata';
import { zdBattle, Harm } from '@src/model/battle';
import { sleep } from '@src/model/common';
import { addHP, addCoin } from '@src/model/economy';
import { __PATH, keysByPath, getRedisKey } from '@src/model/keys';
import { readAction, isActionRunning, remainingMs, formatRemaining } from '@src/model/actionHelper';
import { KEY_RECORD, KEY_RECORD_TWO, KEY_WORLD_BOOS_STATUS, KEY_WORLD_BOOS_STATUS_TWO } from '@src/model/settions';
import { getAuctionKeyManager } from './auction';

export const WorldBossBattleInfo = {
  CD: {},
  Lock: 0,
  UnLockTimer: null as NodeJS.Timeout | null,
  setCD(userId: string, time: number) {
    this.CD[userId] = time;
  },
  setLock(lock: 0 | 1) {
    this.Lock = lock;
  },
  setUnLockTimer(timer: NodeJS.Timeout | null) {
    this.UnLockTimer = timer;
  }
};
// 初始化妖王
export async function InitWorldBoss() {
  const averageDamageStruct = await GetAverageDamage();
  const playerQuantity = Math.floor(averageDamageStruct.player_quantity);
  const averageDamage = Math.floor(averageDamageStruct.AverageDamage);
  let reward = 12000000;

  WorldBossBattleInfo.setLock(0);
  if (playerQuantity === 0) {
    return -1;
  }
  if (playerQuantity < 5) {
    reward = 6000000;
  }
  const x = averageDamage * 0.01;

  const health = Math.trunc(x * 150 * playerQuantity * 2); // 血量要根据人数来
  const worldBossStatus = {
    Health: health,
    Healthmax: health,
    KilledTime: -1,
    Reward: reward
  };
  const playerRecord = 0;

  await redis.set(KEY_WORLD_BOOS_STATUS, JSON.stringify(worldBossStatus));
  await redis.set(KEY_RECORD, JSON.stringify(playerRecord));
  const msg = '【全服公告】妖王已经苏醒,击杀者额外获得100w灵石';
  const auctionKeyManager = getAuctionKeyManager();
  const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
  const groupList = await redis.smembers(groupListKey);

  for (const group of groupList) {
    pushInfo(group, true, msg);
  }

  return false;
}

export async function InitWorldBoss2() {
  const averageDamageStruct = await GetAverageDamage();
  const playerQuantity = Math.floor(averageDamageStruct.player_quantity);
  const averageDamage = Math.floor(averageDamageStruct.AverageDamage);
  let reward = 6000000;

  WorldBossBattleInfo.setLock(0);
  if (playerQuantity === 0) {
    return -1;
  }
  if (playerQuantity < 5) {
    reward = 3000000;
  }
  const x = averageDamage * 0.01;

  const health = Math.trunc(x * 150 * playerQuantity * 2); // 血量要根据人数来
  const worldBossStatus = {
    Health: health,
    Healthmax: health,
    KilledTime: -1,
    Reward: reward
  };
  const playerRecord = 0;

  await redis.set(KEY_WORLD_BOOS_STATUS_TWO, JSON.stringify(worldBossStatus));
  await redis.set(KEY_RECORD_TWO, JSON.stringify(playerRecord));
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
  const temp = [];
  let totalPlayer = 0;

  await Promise.all(
    playerList.map(async p => {
      const player = await readPlayer(p);

      if (!player) {
        return;
      }
      if (player.level_id > 21 && player.level_id < 42 && player.lunhui === 0) {
        temp[totalPlayer] = parseInt(player.攻击);
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
export async function Boss2IsAlive() {
  return (await redis.get(KEY_WORLD_BOOS_STATUS_TWO)) && (await redis.get(KEY_RECORD_TWO));
}
// 兼容旧引用：BossIsAlive 指向新版 Boss2IsAlive（妖王）
export const BossIsAlive = Boss2IsAlive;
export async function LookUpWorldBossStatus(e: EventsMessageCreateEnum) {
  const send = useSend(e);

  const userId = e.UserId; // 用户qq

  // 有无存档
  if (!(await existplayer(userId))) {
    return false;
  }

  if (await Boss2IsAlive()) {
    const statusStr = await redis.get(KEY_WORLD_BOOS_STATUS_TWO);

    if (statusStr) {
      const status = JSON.parse(statusStr) as {
        KilledTime: number;
        Health: number;
        Reward: number;
      };

      if (Date.now() - status.KilledTime < 86400000) {
        void send(Text('金角大王正在刷新,20点开启'));

        return false;
      } else if (status.KilledTime !== -1) {
        return false;
      }
      const replyMsg = [`----金角大王状态----\n攻击:????????????\n防御:????????????\n血量:${status.Health}\n奖励:${status.Reward}`];

      void send(Text(replyMsg.join('\n')));
    }
  } else {
    void send(Text('金角大王未开启！'));
  }

  return false;
}
// 排序
export function SortPlayer(playerRecordJSON) {
  if (playerRecordJSON) {
    // let Temp0 = JSON.parse(JSON.stringify(PlayerRecordJSON))
    const temp0 = _.cloneDeep(playerRecordJSON);
    const temp = temp0.TotalDamage;
    const sortResult = [];

    temp.sort(function (a, b) {
      return b - a;
    });
    for (let i = 0; i < playerRecordJSON.TotalDamage.length; i++) {
      for (let s = 0; s < playerRecordJSON.TotalDamage.length; s++) {
        if (temp[i] === playerRecordJSON.TotalDamage[s]) {
          sortResult[i] = s;
          break;
        }
      }
    }

    return sortResult;
  }
}
export async function WorldBossBattle(e) {
  const send = useSend(e);

  const userId = e.UserId; // 用户qq

  // 有无存档
  if (!(await existplayer(userId))) {
    return false;
  }

  const worldBossBattleCD = WorldBossBattleInfo.CD;

  if (!(await Boss2IsAlive())) {
    void send(Text('妖王未开启！'));

    return false;
  }
  let time = 5;
  const nowTime = Date.now(); // 获取当前时间戳

  time = Math.floor(60000 * time);
  const lastTimeRaw = await redis.get(getRedisKey(userId, 'BOSSCD'));
  const lastTime = parseInt(lastTimeRaw ?? '0', 10);

  if (nowTime < lastTime + time) {
    const coupleM = Math.trunc((lastTime + time - nowTime) / 60 / 1000);
    const coupleS = Math.trunc(((lastTime + time - nowTime) % 60000) / 1000);

    void send(Text(`刚刚一战消耗了太多气力，还是先歇息一会儿吧~(剩余${coupleM}分${coupleS}秒)`));

    return false;
  }
  if (await existPlayer(userId)) {
    const player = await readPlayer(userId);

    if (!player) {
      void send(Text('玩家数据不存在'));

      return false;
    }
    if (player.level_id < 42 && player.lunhui === 0) {
      void send(Text('你在仙界吗'));

      return false;
    }
    const action = await readAction(userId);

    if (isActionRunning(action)) {
      const left = formatRemaining(remainingMs(action));

      void send(Text(`正在${action.action}中,剩余时间:${left}`));

      return false;
    }
    if (player.当前血量 <= player.血量上限 * 0.1) {
      void send(Text('还是先疗伤吧，别急着参战了'));

      return false;
    }
    if (worldBossBattleCD[userId]) {
      const seconds = Math.trunc((300000 - (Date.now() - worldBossBattleCD[userId])) / 1000);

      if (seconds <= 300 && seconds >= 0) {
        void send(Text(`刚刚一战消耗了太多气力，还是先歇息一会儿吧~(剩余${seconds}秒)`));

        return false;
      }
    }
    const worldBossStatusStr = await redis.get(KEY_WORLD_BOOS_STATUS);
    const playerRecord = await redis.get(KEY_RECORD);
    const worldBossStatus = JSON.parse(worldBossStatusStr ?? '{}');

    if (Date.now() - worldBossStatus.KilledTime < 86400000) {
      void send(Text('妖王正在刷新,21点开启'));

      return false;
    } else if (worldBossStatus.KilledTime !== -1) {
      if ((await InitWorldBoss()) === false) {
        await WorldBossBattle(e);
      }

      return false;
    }
    let playerRecordJSON, userIndex;

    if (+playerRecord === 0) {
      const qqGroup = [],
        damageGroup = [],
        name = [];

      qqGroup[0] = userId;
      damageGroup[0] = 0;
      name[0] = player.名号;
      playerRecordJSON = {
        QQ: qqGroup,
        TotalDamage: damageGroup,
        Name: name
      };
      userIndex = 0;
    } else {
      playerRecordJSON = JSON.parse(playerRecord);
      let i;

      for (i = 0; i < playerRecordJSON.QQ.length; i++) {
        if (playerRecordJSON.QQ[i] === userId) {
          userIndex = i;
          break;
        }
      }
      if (!userIndex && userIndex !== 0) {
        playerRecordJSON.QQ[i] = userId;
        playerRecordJSON.Name[i] = player.名号;
        playerRecordJSON.TotalDamage[i] = 0;
        userIndex = i;
      }
    }
    let totalDamage = 0;
    const boss = {
      名号: '妖王幻影',
      攻击: Math.floor(player.攻击 * (0.8 + 0.6 * Math.random())),
      防御: Math.floor(player.防御 * (0.8 + 0.6 * Math.random())),
      当前血量: Math.floor(player.血量上限 * (0.8 + 0.6 * Math.random())),
      暴击率: player.暴击率,
      灵根: player.灵根,
      法球倍率: player.灵根.法球倍率
    };

    player.法球倍率 = player.灵根.法球倍率;
    if (WorldBossBattleInfo.UnLockTimer) {
      clearTimeout(WorldBossBattleInfo.UnLockTimer);
      WorldBossBattleInfo.setUnLockTimer(null);
    }
    void SetWorldBOSSBattleUnLockTimer(e);
    if (WorldBossBattleInfo.Lock !== 0) {
      void send(Text('好像有人正在和妖王激战，现在去怕是有未知的凶险，还是等等吧！'));

      return false;
    }
    WorldBossBattleInfo.Lock = 1;
    const dataBattle = await zdBattle(player, boss);
    const msg = dataBattle.msg;
    const winA = `${player.名号}击败了${boss.名号}`;
    const winB = `${boss.名号}击败了${player.名号}`;

    if (msg.length <= 60) {
      void send(Text(msg.join('\n')));
    } else {
      // let msgg = JSON.parse(JSON.stringify(msg))
      const msgg = _.cloneDeep(msg);

      msgg.length = 60;
      void send(Text(msgg.join('\n')));
      void send(Text('战斗过长，仅展示部分内容'));
    }
    await sleep(1000);
    if (!worldBossStatus.Healthmax) {
      void send(Text('请联系管理员重新开启!'));

      return false;
    }
    if (msg.find(item => item === winA)) {
      totalDamage = Math.trunc(worldBossStatus.Healthmax * 0.05 + Harm(player.攻击 * 0.85, boss.防御) * 6);
      worldBossStatus.Health -= totalDamage;
      void send(Text(`${player.名号}击败了[${boss.名号}],重创[妖王],造成伤害${totalDamage}`));
    } else if (msg.find(item => item === winB)) {
      totalDamage = Math.trunc(worldBossStatus.Healthmax * 0.03 + Harm(player.攻击 * 0.85, boss.防御) * 4);
      worldBossStatus.Health -= totalDamage;
      void send(Text(`${player.名号}被[${boss.名号}]击败了,只对[妖王]造成了${totalDamage}伤害`));
    }
    await addHP(userId, dataBattle.A_xue);
    await sleep(1000);
    const random = Math.random();

    if (random < 0.05 && msg.find(item => item === winA)) {
      void send(Text('这场战斗重创了[妖王]，妖王使用了古典秘籍,血量回复了20%'));
      worldBossStatus.Health += Math.trunc(worldBossStatus.Healthmax * 0.2);
    } else if (random > 0.95 && msg.find(item => item === winB)) {
      totalDamage += Math.trunc(worldBossStatus.Health * 0.15);
      worldBossStatus.Health -= Math.trunc(worldBossStatus.Health * 0.15);
      void send(Text(`危及时刻,万先盟-韩立前来助阵,对[妖王]造成${Math.trunc(worldBossStatus.Health * 0.15)}伤害,并治愈了你的伤势`));
      await addHP(userId, player.血量上限);
    }
    await sleep(1000);
    playerRecordJSON.TotalDamage[userIndex] += totalDamage;
    void redis.set(KEY_RECORD, JSON.stringify(playerRecordJSON));
    void redis.set(KEY_WORLD_BOOS_STATUS, JSON.stringify(worldBossStatus));
    if (worldBossStatus.Health <= 0) {
      void send(Text('妖王被击杀！玩家们可以根据贡献获得奖励！'));
      await sleep(1000);
      const msg2 = '【全服公告】' + player.名号 + '亲手结果了妖王的性命,为民除害,额外获得1000000灵石奖励！';
      const auctionKeyManager = getAuctionKeyManager();
      const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
      const groupList = await redis.smembers(groupListKey);

      for (const group of groupList) {
        pushInfo(group, true, msg2);
      }
      await addCoin(userId, 1000000);

      worldBossStatus.KilledTime = Date.now();
      void redis.set(KEY_WORLD_BOOS_STATUS, JSON.stringify(worldBossStatus));
      const playerList = SortPlayer(playerRecordJSON);

      void send(Text('正在进行存档有效性检测，如果长时间没有回复请联系主人修复存档并手动按照贡献榜发放奖励'));
      for (let i = 0; i < playerList.length; i++) {
        await readPlayer(playerRecordJSON.QQ[playerList[i]]);
      }
      let showMax;
      const rewardMsg = ['****妖王周本贡献排行榜****'];

      if (playerList.length > 20) {
        showMax = 20;
      } else {
        showMax = playerList.length;
      }
      let totalDamage = 0;

      for (let i = 0; i < (playerList.length <= 20 ? playerList.length : 20); i++) {
        totalDamage += playerRecordJSON.TotalDamage[playerList[i]];
      }
      for (let i = 0; i < playerList.length; i++) {
        const currentPlayer = await readPlayer(playerRecordJSON.QQ[playerList[i]]);

        if (i < showMax) {
          let reward = Math.trunc((playerRecordJSON.TotalDamage[playerList[i]] / totalDamage) * worldBossStatus.Reward);

          reward = reward < 200000 ? 200000 : reward;
          rewardMsg.push(
            '第' +
              `${i + 1}` +
              '名:\n' +
              `名号:${currentPlayer.名号}` +
              '\n' +
              `伤害:${playerRecordJSON.TotalDamage[playerList[i]]}` +
              '\n' +
              `获得灵石奖励${reward}`
          );
          currentPlayer.灵石 += reward;
          void writePlayer(playerRecordJSON.QQ[playerList[i]], currentPlayer);
          continue;
        } else {
          currentPlayer.灵石 += 200000;
          void writePlayer(playerRecordJSON.QQ[playerList[i]], currentPlayer);
        }
        if (i === playerList.length - 1) {
          rewardMsg.push('其余参与的修仙者均获得200000灵石奖励！');
        }
      }
      // await ForwardMsg(e, Rewardmsg)
      void send(Text(rewardMsg.join('\n')));
    }
    worldBossBattleCD[userId] = Date.now();
    WorldBossBattleInfo.setLock(0);

    return false;
  } else {
    void send(Text('区区凡人，也想参与此等战斗中吗？'));

    return false;
  }
}
// 设置防止锁卡死的计时器
export function SetWorldBOSSBattleUnLockTimer(e) {
  const send = useSend(e);
  const timeout = setTimeout(() => {
    if (WorldBossBattleInfo.Lock === 1) {
      WorldBossBattleInfo.setLock(0);
      void send(Text('检测到战斗锁卡死，已自动修复'));

      return false;
    }
  }, 30000);

  WorldBossBattleInfo.setUnLockTimer(timeout);
}
