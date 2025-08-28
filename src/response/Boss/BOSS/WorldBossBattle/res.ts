import { Text, useSend } from 'alemonjs';
import * as _ from 'lodash-es';

import { redis, pushInfo } from '@src/model/api';
import { zdBattle, Harm } from '@src/model/battle';
import { sleep } from '@src/model/common';
import { addHP, addCoin } from '@src/model/economy';
import {
  BossIsAlive,
  InitWorldBoss,
  SetWorldBOSSBattleUnLockTimer,
  SortPlayer,
  WorldBossBattle,
  WorldBossBattleInfo
} from '../../../../model/boss';
import { existplayer } from '@src/model';
import { getRedisKey, keys } from '@src/model/keys';
import mw from '@src/response/mw';
import { KEY_AUCTION_GROUP_LIST, KEY_RECORD, KEY_WORLD_BOOS_STATUS } from '@src/model/constants';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';

export const selects = onSelects(['message.create']);
export const regular = /^(#|＃|\/)?讨伐妖王$/;

// 新增类型与工具
interface PlayerRecordData {
  QQ: string[];
  TotalDamage: number[];
  Name: string[];
}
interface WorldBossStatusInfo {
  Health: number;
  Healthmax: number;
  Reward: number;
  KilledTime: number;
}
interface ActionState {
  end_time?: number;
  action?: string;
}

function parseJson<T>(raw, fallback: T): T {
  if (typeof raw !== 'string' || raw === '') {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function toInt(v, d = 0) {
  const n = Number(v);

  return Number.isFinite(n) ? Math.trunc(n) : d;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  const userId = e.UserId; // 用户qq

  // 有无存档
  if (!(await existplayer(userId))) {
    return false;
  }

  if (!(await BossIsAlive())) {
    void Send(Text('妖王未开启！'));

    return false;
  }

  const userId = e.UserId;
  const now_Time = Date.now();
  const cdMs = 5 * 60000;
  const last_time_raw = await redis.get(getRedisKey(userId, 'BOSSCD'));
  const last_time = toInt(last_time_raw);

  if (now_Time < last_time + cdMs) {
    const remain = last_time + cdMs - now_Time;
    const Couple_m = Math.trunc(remain / 60000);
    const Couple_s = Math.trunc((remain % 60000) / 1000);

    void Send(Text(`正在CD中，剩余cd:  ${Couple_m}分 ${Couple_s}秒`));

    return false;
  }
  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    void Send(Text('区区凡人，也想参与此等战斗中吗？'));

    return false;
  }
  if (player.level_id < 42 && player.lunhui === 0) {
    void Send(Text('你在仙界吗'));

    return false;
  }
  const actionRaw = await redis.get(getRedisKey(userId, 'action'));
  const action = parseJson<ActionState | null>(actionRaw, null);

  if (action?.end_time && Date.now() <= action.end_time) {
    const remain = action.end_time - Date.now();
    const m = Math.floor(remain / 60000);
    const s = Math.floor((remain % 60000) / 1000);

    void Send(Text(`正在${action.action}中,剩余时间:${m}分${s}秒`));

    return false;
  }
  if (player.当前血量 <= player.血量上限 * 0.1) {
    void Send(Text('还是先疗伤吧，别急着参战了'));

    return false;
  }
  if (WorldBossBattleInfo.CD[userId]) {
    const Seconds = Math.trunc((300000 - (Date.now() - WorldBossBattleInfo.CD[userId])) / 1000);

    if (Seconds <= 300 && Seconds >= 0) {
      void Send(Text(`刚刚一战消耗了太多气力，还是先歇息一会儿吧~(剩余${Seconds}秒)`));

      return false;
    }
  }

  const WorldBossStatusStr = await redis.get(KEY_WORLD_BOOS_STATUS);
  const PlayerRecordStr = await redis.get(KEY_RECORD);
  const WorldBossStatus = parseJson<WorldBossStatusInfo | null>(WorldBossStatusStr, null);

  if (!WorldBossStatus) {
    void Send(Text('状态数据缺失, 请联系管理员重新开启!'));

    return false;
  }
  if (Date.now() - WorldBossStatus.KilledTime < 86400000) {
    void Send(Text('妖王正在刷新,21点开启'));

    return false;
  } else if (WorldBossStatus.KilledTime !== -1) {
    if ((await InitWorldBoss()) === false) {
      await WorldBossBattle(e);
    }

    return false;
  }

  let PlayerRecordJSON: PlayerRecordData;
  let Userid = 0;

  if (!PlayerRecordStr || PlayerRecordStr === '0') {
    PlayerRecordJSON = { QQ: [userId], TotalDamage: [0], Name: [player.名号] };
    Userid = 0;
  } else {
    PlayerRecordJSON = parseJson<PlayerRecordData>(PlayerRecordStr, {
      QQ: [],
      TotalDamage: [],
      Name: []
    });
    // 查找或追加
    Userid = PlayerRecordJSON.QQ.indexOf(userId);
    if (Userid === -1) {
      PlayerRecordJSON.QQ.push(userId);
      PlayerRecordJSON.Name.push(player.名号);
      PlayerRecordJSON.TotalDamage.push(0);
      Userid = PlayerRecordJSON.QQ.length - 1;
    }
  }

  // 构建 Boss 幻影
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
  SetWorldBOSSBattleUnLockTimer(e);
  if (WorldBossBattleInfo.Lock !== 0) {
    void Send(Text('好像有人正在和妖王激战，现在去怕是有未知的凶险，还是等等吧！'));

    return false;
  }
  WorldBossBattleInfo.setLock(1);
  const dataBattle = await zdBattle(player, Boss);
  const msg = dataBattle.msg;
  const winA = `${player.名号}击败了${Boss.名号}`;
  const winB = `${Boss.名号}击败了${player.名号}`;

  if (msg.length <= 60) {
    void Send(Text(msg.join('\n')));
  } else {
    const msgg = _.cloneDeep(msg);

    msgg.length = 60;
    void Send(Text(msgg.join('\n')));
    void Send(Text('战斗过长，仅展示部分内容'));
  }
  await sleep(1000);
  if (!WorldBossStatus.Healthmax) {
    void Send(Text('请联系管理员重新开启!'));
    WorldBossBattleInfo.setLock(0);

    return false;
  }
  let TotalDamage = 0;
  const playerWin = msg.includes(winA);
  const bossWin = msg.includes(winB);

  if (playerWin) {
    TotalDamage = Math.trunc(
      WorldBossStatus.Healthmax * 0.05 + Harm(player.攻击 * 0.85, Boss.防御) * 6
    );
    WorldBossStatus.Health -= TotalDamage;
    void Send(Text(`${player.名号}击败了[${Boss.名号}],重创[妖王],造成伤害${TotalDamage}`));
  } else if (bossWin) {
    TotalDamage = Math.trunc(
      WorldBossStatus.Healthmax * 0.03 + Harm(player.攻击 * 0.85, Boss.防御) * 4
    );
    WorldBossStatus.Health -= TotalDamage;
    void Send(Text(`${player.名号}被[${Boss.名号}]击败了,只对[妖王]造成了${TotalDamage}伤害`));
  }
  await addHP(userId, dataBattle.A_xue);
  await sleep(1000);
  const random = Math.random();

  if (random < 0.05 && playerWin) {
    void Send(Text('这场战斗重创了[妖王]，妖王使用了古典秘籍,血量回复了20%'));
    WorldBossStatus.Health += Math.trunc(WorldBossStatus.Healthmax * 0.2);
  } else if (random > 0.95 && bossWin) {
    const extra = Math.trunc(WorldBossStatus.Health * 0.15);

    TotalDamage += extra;
    WorldBossStatus.Health -= extra;
    void Send(Text(`危及时刻,万先盟-韩立前来助阵,对[妖王]造成${extra}伤害,并治愈了你的伤势`));
    await addHP(userId, player.血量上限);
  }
  await sleep(1000);
  PlayerRecordJSON.TotalDamage[Userid] += TotalDamage;
  await redis.set(KEY_RECORD, JSON.stringify(PlayerRecordJSON));
  await redis.set(KEY_WORLD_BOOS_STATUS, JSON.stringify(WorldBossStatus));

  if (WorldBossStatus.Health <= 0) {
    void Send(Text('妖王被击杀！玩家们可以根据贡献获得奖励！'));
    await sleep(1000);
    const msg2 = `【全服公告】${player.名号}亲手结果了妖王的性命,为民除害,额外获得1000000灵石奖励！`;
    const redisGlKey = KEY_AUCTION_GROUP_LIST;
    const groupList = await redis.smembers(redisGlKey);

    for (const group of groupList) {
      pushInfo(group, true, msg2);
    }
    await addCoin(userId, 1000000);
    logger.info(`[妖王] 结算:${userId}增加奖励1000000`);

    WorldBossStatus.KilledTime = Date.now();
    await redis.set(KEY_WORLD_BOOS_STATUS, JSON.stringify(WorldBossStatus));

    const PlayerList = await SortPlayer(PlayerRecordJSON);

    void Send(
      Text('正在进行存档有效性检测，如果长时间没有回复请联系主人修复存档并手动按照贡献榜发放奖励')
    );

    const Rewardmsg: string[] = ['****妖王周本贡献排行榜****'];
    const showMax = Math.min(PlayerList.length, 20);
    let topDamageSum = 0;

    for (let i = 0; i < showMax; i++) {
      topDamageSum += PlayerRecordJSON.TotalDamage[PlayerList[i]];
    }
    if (topDamageSum <= 0) {
      topDamageSum = showMax;
    } // 防止除零 -> 平分

    for (let i = 0; i < PlayerList.length; i++) {
      const idx = PlayerList[i];
      const qq = PlayerRecordJSON.QQ[idx];
      const CurrentPlayer = await getDataJSONParseByKey(keys.player(qq));

      if (!CurrentPlayer) {
        continue;
      }
      if (i < showMax) {
        let reward = Math.trunc(
          (PlayerRecordJSON.TotalDamage[idx] / topDamageSum) * WorldBossStatus.Reward
        );

        if (!Number.isFinite(reward) || reward < 200000) {
          reward = 200000;
        }
        Rewardmsg.push(
          `第${i + 1}名:\n名号:${CurrentPlayer.名号}\n伤害:${PlayerRecordJSON.TotalDamage[idx]}\n获得灵石奖励${reward}`
        );
        CurrentPlayer.灵石 += reward;
        await setDataJSONStringifyByKey(keys.player(qq), CurrentPlayer);
        logger.info(`[妖王周本] 结算:${qq}增加奖励${reward}`);
      } else {
        CurrentPlayer.灵石 += 200000;
        await setDataJSONStringifyByKey(keys.player(qq), CurrentPlayer);
        logger.info(`[妖王周本] 结算:${qq}增加奖励200000`);
        if (i === PlayerList.length - 1) {
          Rewardmsg.push('其余参与的修仙者均获得200000灵石奖励！');
        }
      }
    }
    void Send(Text(Rewardmsg.join('\n')));
  }
  WorldBossBattleInfo.setCD(userId, Date.now());
  WorldBossBattleInfo.setLock(0);

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
