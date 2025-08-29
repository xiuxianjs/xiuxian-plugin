import { EventsMessageCreateEnum, useSend, Text } from 'alemonjs';
import * as _ from 'lodash-es';
import { pushInfo, redis } from '@src/model/api';
import {
  readPlayer,
  existplayer as existPlayer,
  existplayer,
  writePlayer
} from '@src/model/xiuxiandata';
import { zdBattle, Harm } from '@src/model/battle';
import { sleep } from '@src/model/common';
import { addHP, addCoin } from '@src/model/economy';
import { __PATH, keysByPath, getRedisKey } from '@src/model/keys';
import { readAction, isActionRunning, remainingMs, formatRemaining } from '@src/model/actionHelper';
import {
  KEY_RECORD,
  KEY_RECORD_TWO,
  KEY_WORLD_BOOS_STATUS,
  KEY_WORLD_BOOS_STATUS_TWO
} from '@src/model/settions';
import { getAuctionKeyManager } from './auction';

export const WorldBossBattleInfo = {
  CD: {},
  Lock: 0,
  UnLockTimer: 0,
  setCD(userId: string, time: number) {
    this.CD[userId] = time;
  },
  setLock(lock: 0 | 1) {
    this.Lock = lock;
  },
  setUnLockTimer(timer: NodeJS.Timeout) {
    this.UnLockTimer = timer;
  }
};
// 初始化妖王
export async function InitWorldBoss() {
  const AverageDamageStruct = await GetAverageDamage();
  const player_quantity = Math.floor(AverageDamageStruct.player_quantity);
  const AverageDamage = Math.floor(AverageDamageStruct.AverageDamage);
  let Reward = 12000000;

  WorldBossBattleInfo.setLock(0);
  if (player_quantity === 0) {
    return -1;
  }
  if (player_quantity < 5) {
    Reward = 6000000;
  }
  const X = AverageDamage * 0.01;

  logger.info(`[妖王] 化神玩家总数：${player_quantity}`);
  logger.info(`[妖王] 生成基数:${X}`);
  const Health = Math.trunc(X * 150 * player_quantity * 2); // 血量要根据人数来
  const WorldBossStatus = {
    Health: Health,
    Healthmax: Health,
    KilledTime: -1,
    Reward: Reward
  };
  const PlayerRecord = 0;

  await redis.set(KEY_WORLD_BOOS_STATUS, JSON.stringify(WorldBossStatus));
  await redis.set(KEY_RECORD, JSON.stringify(PlayerRecord));
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
  const AverageDamageStruct = await GetAverageDamage();
  const player_quantity = Math.floor(AverageDamageStruct.player_quantity);
  const AverageDamage = Math.floor(AverageDamageStruct.AverageDamage);
  let Reward = 6000000;

  WorldBossBattleInfo.setLock(0);
  if (player_quantity === 0) {
    return -1;
  }
  if (player_quantity < 5) {
    Reward = 3000000;
  }
  const X = AverageDamage * 0.01;

  logger.mark(`[金角大王] 化神玩家总数：${player_quantity}`);
  logger.mark(`[金角大王] 生成基数:${X}`);
  const Health = Math.trunc(X * 150 * player_quantity * 2); // 血量要根据人数来
  const WorldBossStatus = {
    Health: Health,
    Healthmax: Health,
    KilledTime: -1,
    Reward: Reward
  };
  const PlayerRecord = 0;

  await redis.set(KEY_WORLD_BOOS_STATUS_TWO, JSON.stringify(WorldBossStatus));
  await redis.set(KEY_RECORD_TWO, JSON.stringify(PlayerRecord));
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
  let TotalPlayer = 0;

  await Promise.all(
    playerList.map(async p => {
      const player = await readPlayer(p);

      if (!player) {
        return;
      }
      if (player.level_id > 21 && player.level_id < 42 && player.lunhui === 0) {
        temp[TotalPlayer] = parseInt(player.攻击);
        logger.debug(`[金角大王] ${p}玩家攻击:${temp[TotalPlayer]}`);
        TotalPlayer++;
      }
    })
  );

  // 排序
  temp.sort(function (a, b) {
    return b - a;
  });
  let AverageDamage = 0;

  if (TotalPlayer > 15) {
    for (let i = 2; i < temp.length - 4; i++) {
      AverageDamage += temp[i];
    }
  } else {
    for (let i = 0; i < temp.length; i++) {
      AverageDamage += temp[i];
    }
  }
  AverageDamage =
    TotalPlayer > 15
      ? AverageDamage / (temp.length - 6)
      : temp.length === 0
        ? 0
        : AverageDamage / temp.length;

  return { player_quantity: TotalPlayer, AverageDamage };
}
export async function Boss2IsAlive() {
  return (await redis.get(KEY_WORLD_BOOS_STATUS_TWO)) && (await redis.get(KEY_RECORD_TWO));
}
// 兼容旧引用：BossIsAlive 指向新版 Boss2IsAlive（妖王）
export const BossIsAlive = Boss2IsAlive;
export async function LookUpWorldBossStatus(e: EventsMessageCreateEnum) {
  const Send = useSend(e);

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
        void Send(Text('金角大王正在刷新,20点开启'));

        return false;
      } else if (status.KilledTime !== -1) {
        return false;
      }
      const ReplyMsg = [
        `----金角大王状态----\n攻击:????????????\n防御:????????????\n血量:${status.Health}\n奖励:${status.Reward}`
      ];

      void Send(Text(ReplyMsg.join('\n')));
    }
  } else {
    void Send(Text('金角大王未开启！'));
  }

  return false;
}
// 排序
export function SortPlayer(PlayerRecordJSON) {
  if (PlayerRecordJSON) {
    // let Temp0 = JSON.parse(JSON.stringify(PlayerRecordJSON))
    const Temp0 = _.cloneDeep(PlayerRecordJSON);
    const Temp = Temp0.TotalDamage;
    const SortResult = [];

    Temp.sort(function (a, b) {
      return b - a;
    });
    for (let i = 0; i < PlayerRecordJSON.TotalDamage.length; i++) {
      for (let s = 0; s < PlayerRecordJSON.TotalDamage.length; s++) {
        if (Temp[i] === PlayerRecordJSON.TotalDamage[s]) {
          SortResult[i] = s;
          break;
        }
      }
    }

    return SortResult;
  }
}
export async function WorldBossBattle(e) {
  const Send = useSend(e);

  const userId = e.UserId; // 用户qq

  // 有无存档
  if (!(await existplayer(userId))) {
    return false;
  }

  const WorldBOSSBattleCD = WorldBossBattleInfo.CD;

  if (!(await Boss2IsAlive())) {
    void Send(Text('妖王未开启！'));

    return false;
  }
  let Time = 5;
  const now_Time = Date.now(); // 获取当前时间戳

  Time = Math.floor(60000 * Time);
  const last_time_raw = await redis.get(getRedisKey(userId, 'BOSSCD'));
  const last_time = parseInt(last_time_raw ?? '0', 10);

  if (now_Time < last_time + Time) {
    const Couple_m = Math.trunc((last_time + Time - now_Time) / 60 / 1000);
    const Couple_s = Math.trunc(((last_time + Time - now_Time) % 60000) / 1000);

    void Send(Text(`刚刚一战消耗了太多气力，还是先歇息一会儿吧~(剩余${Couple_m}分${Couple_s}秒)`));

    return false;
  }
  if (await existPlayer(userId)) {
    const player = await readPlayer(userId);

    if (!player) {
      void Send(Text('玩家数据不存在'));

      return false;
    }
    if (player.level_id < 42 && player.lunhui === 0) {
      void Send(Text('你在仙界吗'));

      return false;
    }
    const action = await readAction(userId);

    if (isActionRunning(action)) {
      const left = formatRemaining(remainingMs(action));

      void Send(Text(`正在${action.action}中,剩余时间:${left}`));

      return false;
    }
    if (player.当前血量 <= player.血量上限 * 0.1) {
      void Send(Text('还是先疗伤吧，别急着参战了'));

      return false;
    }
    if (WorldBOSSBattleCD[userId]) {
      const Seconds = Math.trunc((300000 - (Date.now() - WorldBOSSBattleCD[userId])) / 1000);

      if (Seconds <= 300 && Seconds >= 0) {
        void Send(Text(`刚刚一战消耗了太多气力，还是先歇息一会儿吧~(剩余${Seconds}秒)`));

        return false;
      }
    }
    const WorldBossStatusStr = await redis.get(KEY_WORLD_BOOS_STATUS);
    const PlayerRecord = await redis.get(KEY_RECORD);
    const WorldBossStatus = JSON.parse(WorldBossStatusStr);

    if (Date.now() - WorldBossStatus.KilledTime < 86400000) {
      void Send(Text('妖王正在刷新,21点开启'));

      return false;
    } else if (WorldBossStatus.KilledTime !== -1) {
      if ((await InitWorldBoss()) === false) {
        await WorldBossBattle(e);
      }

      return false;
    }
    let PlayerRecordJSON, Userid;

    if (+PlayerRecord === 0) {
      const QQGroup = [],
        DamageGroup = [],
        Name = [];

      QQGroup[0] = userId;
      DamageGroup[0] = 0;
      Name[0] = player.名号;
      PlayerRecordJSON = {
        QQ: QQGroup,
        TotalDamage: DamageGroup,
        Name: Name
      };
      Userid = 0;
    } else {
      PlayerRecordJSON = JSON.parse(PlayerRecord);
      let i;

      for (i = 0; i < PlayerRecordJSON.QQ.length; i++) {
        if (PlayerRecordJSON.QQ[i] === userId) {
          Userid = i;
          break;
        }
      }
      if (!Userid && Userid !== 0) {
        PlayerRecordJSON.QQ[i] = userId;
        PlayerRecordJSON.Name[i] = player.名号;
        PlayerRecordJSON.TotalDamage[i] = 0;
        Userid = i;
      }
    }
    let TotalDamage = 0;
    const Boss = {
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
      void Send(Text('好像有人正在和妖王激战，现在去怕是有未知的凶险，还是等等吧！'));

      return false;
    }
    WorldBossBattleInfo.Lock = 1;
    const dataBattle = await zdBattle(player, Boss);
    const msg = dataBattle.msg;
    const winA = `${player.名号}击败了${Boss.名号}`;
    const winB = `${Boss.名号}击败了${player.名号}`;

    if (msg.length <= 60) {
      void Send(Text(msg.join('\n')));
    } else {
      // let msgg = JSON.parse(JSON.stringify(msg))
      const msgg = _.cloneDeep(msg);

      msgg.length = 60;
      void Send(Text(msgg.join('\n')));
      void Send(Text('战斗过长，仅展示部分内容'));
    }
    await sleep(1000);
    if (!WorldBossStatus.Healthmax) {
      void Send(Text('请联系管理员重新开启!'));

      return false;
    }
    if (msg.find(item => item === winA)) {
      TotalDamage = Math.trunc(
        WorldBossStatus.Healthmax * 0.05 + Harm(player.攻击 * 0.85, Boss.防御) * 6
      );
      WorldBossStatus.Health -= TotalDamage;
      void Send(Text(`${player.名号}击败了[${Boss.名号}],重创[妖王],造成伤害${TotalDamage}`));
    } else if (msg.find(item => item === winB)) {
      TotalDamage = Math.trunc(
        WorldBossStatus.Healthmax * 0.03 + Harm(player.攻击 * 0.85, Boss.防御) * 4
      );
      WorldBossStatus.Health -= TotalDamage;
      void Send(Text(`${player.名号}被[${Boss.名号}]击败了,只对[妖王]造成了${TotalDamage}伤害`));
    }
    await addHP(userId, dataBattle.A_xue);
    await sleep(1000);
    const random = Math.random();

    if (random < 0.05 && msg.find(item => item === winA)) {
      void Send(Text('这场战斗重创了[妖王]，妖王使用了古典秘籍,血量回复了20%'));
      WorldBossStatus.Health += Math.trunc(WorldBossStatus.Healthmax * 0.2);
    } else if (random > 0.95 && msg.find(item => item === winB)) {
      TotalDamage += Math.trunc(WorldBossStatus.Health * 0.15);
      WorldBossStatus.Health -= Math.trunc(WorldBossStatus.Health * 0.15);
      void Send(
        Text(
          `危及时刻,万先盟-韩立前来助阵,对[妖王]造成${Math.trunc(WorldBossStatus.Health * 0.15)}伤害,并治愈了你的伤势`
        )
      );
      await addHP(userId, player.血量上限);
    }
    await sleep(1000);
    PlayerRecordJSON.TotalDamage[Userid] += TotalDamage;
    void redis.set(KEY_RECORD, JSON.stringify(PlayerRecordJSON));
    void redis.set(KEY_WORLD_BOOS_STATUS, JSON.stringify(WorldBossStatus));
    if (WorldBossStatus.Health <= 0) {
      void Send(Text('妖王被击杀！玩家们可以根据贡献获得奖励！'));
      await sleep(1000);
      const msg2 =
        '【全服公告】' + player.名号 + '亲手结果了妖王的性命,为民除害,额外获得1000000灵石奖励！';
      const auctionKeyManager = getAuctionKeyManager();
      const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
      const groupList = await redis.smembers(groupListKey);

      for (const group of groupList) {
        pushInfo(group, true, msg2);
      }
      await addCoin(userId, 1000000);
      logger.info(`[妖王] 结算:${userId}增加奖励1000000`);

      WorldBossStatus.KilledTime = Date.now();
      void redis.set(KEY_WORLD_BOOS_STATUS, JSON.stringify(WorldBossStatus));
      const PlayerList = SortPlayer(PlayerRecordJSON);

      void Send(
        Text('正在进行存档有效性检测，如果长时间没有回复请联系主人修复存档并手动按照贡献榜发放奖励')
      );
      for (let i = 0; i < PlayerList.length; i++) {
        await readPlayer(PlayerRecordJSON.QQ[PlayerList[i]]);
      }
      let Show_MAX;
      const Rewardmsg = ['****妖王周本贡献排行榜****'];

      if (PlayerList.length > 20) {
        Show_MAX = 20;
      } else {
        Show_MAX = PlayerList.length;
      }
      let TotalDamage = 0;

      for (let i = 0; i < (PlayerList.length <= 20 ? PlayerList.length : 20); i++) {
        TotalDamage += PlayerRecordJSON.TotalDamage[PlayerList[i]];
      }
      for (let i = 0; i < PlayerList.length; i++) {
        const CurrentPlayer = await readPlayer(PlayerRecordJSON.QQ[PlayerList[i]]);

        if (i < Show_MAX) {
          let Reward = Math.trunc(
            (PlayerRecordJSON.TotalDamage[PlayerList[i]] / TotalDamage) * WorldBossStatus.Reward
          );

          Reward = Reward < 200000 ? 200000 : Reward;
          Rewardmsg.push(
            '第' +
              `${i + 1}` +
              '名:\n' +
              `名号:${CurrentPlayer.名号}` +
              '\n' +
              `伤害:${PlayerRecordJSON.TotalDamage[PlayerList[i]]}` +
              '\n' +
              `获得灵石奖励${Reward}`
          );
          CurrentPlayer.灵石 += Reward;
          void writePlayer(PlayerRecordJSON.QQ[PlayerList[i]], CurrentPlayer);
          logger.info(`[妖王周本] 结算:${PlayerRecordJSON.QQ[PlayerList[i]]}增加奖励${Reward}`);
          continue;
        } else {
          CurrentPlayer.灵石 += 200000;
          logger.info(`[妖王周本] 结算:${PlayerRecordJSON.QQ[PlayerList[i]]}增加奖励200000`);
          void writePlayer(PlayerRecordJSON.QQ[PlayerList[i]], CurrentPlayer);
        }
        if (i === PlayerList.length - 1) {
          Rewardmsg.push('其余参与的修仙者均获得200000灵石奖励！');
        }
      }
      // await ForwardMsg(e, Rewardmsg)
      void Send(Text(Rewardmsg.join('\n')));
    }
    WorldBOSSBattleCD[userId] = Date.now();
    WorldBossBattleInfo.setLock(0);

    return false;
  } else {
    void Send(Text('区区凡人，也想参与此等战斗中吗？'));

    return false;
  }
}
// 设置防止锁卡死的计时器
export function SetWorldBOSSBattleUnLockTimer(e) {
  const Send = useSend(e);
  const timeout = setTimeout(() => {
    if (WorldBossBattleInfo.Lock === 1) {
      WorldBossBattleInfo.setLock(0);
      void Send(Text('检测到战斗锁卡死，已自动修复'));

      return false;
    }
  }, 30000);

  WorldBossBattleInfo.setUnLockTimer(timeout);
}
