import { Text, useSend } from 'alemonjs';
import { existplayer } from '@src/model';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
import { getDataByKey } from '@src/model/DataControl';
import { keys, KEY_RECORD, KEY_WORLD_BOOS_STATUS, keysAction } from '@src/model/keys';
import { pushInfo } from '@src/model/api';
import { zdBattle, Harm } from '@src/model/battle';
import { sleep } from '@src/model/common';
import { addHP, addCoin } from '@src/model/economy';
import { BossIsAlive, InitWorldBoss, SetWorldBOSSBattleUnLockTimer, SortPlayer, WorldBossBattle, WorldBossBattleInfo } from '../../../../model/boss';
import { getAuctionKeyManager } from '@src/model/auction';
import mw from '@src/response/mw';
import * as _ from 'lodash-es';

const selects = onSelects(['message.create']);

export const regular = /^(#|＃|\/)?讨伐妖王$/;

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

function parseJson<T>(raw: any, fallback: T): T {
  if (typeof raw !== 'string' || raw === '') {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function toInt(v: any, d = 0): number {
  const n = Number(v);

  return Number.isFinite(n) ? Math.trunc(n) : d;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    void Send(Text('你还未开始修仙'));

    return false;
  }

  if (!(await BossIsAlive())) {
    void Send(Text('妖王未开启！'));

    return false;
  }

  const nowTime = Date.now();
  const cdMs = 5 * 60000;
  const lastTime = toInt(await getDataByKey(keysAction.bossCD(userId)));

  if (nowTime < lastTime + cdMs) {
    const remain = lastTime + cdMs - nowTime;
    const coupleM = Math.trunc(remain / 60000);
    const coupleS = Math.trunc((remain % 60000) / 1000);

    void Send(Text(`正在CD中，剩余cd:  ${coupleM}分 ${coupleS}秒`));

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

  const action = await getDataJSONParseByKey(keysAction.action(userId));

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
    const seconds = Math.trunc((300000 - (Date.now() - WorldBossBattleInfo.CD[userId])) / 1000);

    if (seconds <= 300 && seconds >= 0) {
      void Send(Text(`刚刚一战消耗了太多气力，还是先歇息一会儿吧~(剩余${seconds}秒)`));

      return false;
    }
  }

  const worldBossStatusStr = await getDataByKey(KEY_WORLD_BOOS_STATUS);
  const playerRecordStr = await getDataByKey(KEY_RECORD);
  const worldBossStatus = parseJson<WorldBossStatusInfo | null>(worldBossStatusStr, null);

  if (!worldBossStatus) {
    void Send(Text('状态数据缺失, 请联系管理员重新开启!'));

    return false;
  }

  if (Date.now() - worldBossStatus.KilledTime < 86400000) {
    void Send(Text('妖王正在刷新,21点开启'));

    return false;
  } else if (worldBossStatus.KilledTime !== -1) {
    if ((await InitWorldBoss()) === false) {
      await WorldBossBattle(e);
    }

    return false;
  }

  let playerRecordJson: PlayerRecordData;
  let userIdIndex = 0;

  if (!playerRecordStr || playerRecordStr === '0') {
    playerRecordJson = { QQ: [userId], TotalDamage: [0], Name: [player.名号] };
    userIdIndex = 0;
  } else {
    playerRecordJson = parseJson<PlayerRecordData>(playerRecordStr, {
      QQ: [],
      TotalDamage: [],
      Name: []
    });

    // 查找或追加
    userIdIndex = playerRecordJson.QQ.indexOf(userId);
    if (userIdIndex === -1) {
      playerRecordJson.QQ.push(userId);
      playerRecordJson.Name.push(player.名号);
      playerRecordJson.TotalDamage.push(0);
      userIdIndex = playerRecordJson.QQ.length - 1;
    }
  }

  // 构建 Boss 幻影
  const boss = {
    名号: '妖王幻影',
    攻击: Math.floor(player.攻击 * (0.8 + 0.6 * Math.random())),
    防御: Math.floor(player.防御 * (0.8 + 0.6 * Math.random())),
    当前血量: Math.floor(player.血量上限 * (0.8 + 0.6 * Math.random())),
    暴击率: player.暴击率,
    灵根: player.灵根,
    法球倍率: player.灵根?.法球倍率
  };

  player.法球倍率 = player.灵根?.法球倍率;

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

  const dataBattle = await zdBattle(player, boss);
  const msg = dataBattle.msg;
  const winA = `${player.名号}击败了${boss.名号}`;
  const winB = `${boss.名号}击败了${player.名号}`;

  if (msg.length <= 60) {
    void Send(Text(msg.join('\n')));
  } else {
    const msgg = _.cloneDeep(msg);

    msgg.length = 60;
    void Send(Text(msgg.join('\n')));
    void Send(Text('战斗过长，仅展示部分内容'));
  }

  await sleep(1000);

  if (!worldBossStatus.Healthmax) {
    void Send(Text('请联系管理员重新开启!'));
    WorldBossBattleInfo.setLock(0);

    return false;
  }

  let totalDamage = 0;
  const playerWin = msg.includes(winA);
  const bossWin = msg.includes(winB);

  if (playerWin) {
    totalDamage = Math.trunc(worldBossStatus.Healthmax * 0.05 + Harm(player.攻击 * 0.85, boss.防御) * 6);
    worldBossStatus.Health -= totalDamage;
    void Send(Text(`${player.名号}击败了[${boss.名号}],重创[妖王],造成伤害${totalDamage}`));
  } else if (bossWin) {
    totalDamage = Math.trunc(worldBossStatus.Healthmax * 0.03 + Harm(player.攻击 * 0.85, boss.防御) * 4);
    worldBossStatus.Health -= totalDamage;
    void Send(Text(`${player.名号}被[${boss.名号}]击败了,只对[妖王]造成了${totalDamage}伤害`));
  }

  await addHP(userId, dataBattle.A_xue);
  await sleep(1000);

  const random = Math.random();

  if (random < 0.05 && playerWin) {
    void Send(Text('这场战斗重创了[妖王]，妖王使用了古典秘籍,血量回复了20%'));
    worldBossStatus.Health += Math.trunc(worldBossStatus.Healthmax * 0.2);
  } else if (random > 0.95 && bossWin) {
    const extra = Math.trunc(worldBossStatus.Health * 0.15);

    totalDamage += extra;
    worldBossStatus.Health -= extra;
    void Send(Text(`危及时刻,万先盟-韩立前来助阵,对[妖王]造成${extra}伤害,并治愈了你的伤势`));
    await addHP(userId, player.血量上限);
  }

  await sleep(1000);

  playerRecordJson.TotalDamage[userIdIndex] += totalDamage;
  await setDataJSONStringifyByKey(KEY_RECORD, playerRecordJson);
  await setDataJSONStringifyByKey(KEY_WORLD_BOOS_STATUS, worldBossStatus);

  if (worldBossStatus.Health <= 0) {
    void Send(Text('妖王被击杀！玩家们可以根据贡献获得奖励！'));
    await sleep(1000);

    const msg2 = `【全服公告】${player.名号}亲手结果了妖王的性命,为民除害,额外获得1000000灵石奖励！`;
    const auctionKeyManager = getAuctionKeyManager();
    const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
    const groupList = await getDataByKey(groupListKey);

    if (Array.isArray(groupList)) {
      for (const group of groupList) {
        pushInfo(group, true, msg2);
      }
    }

    await addCoin(userId, 1000000);

    worldBossStatus.KilledTime = Date.now();
    await setDataJSONStringifyByKey(KEY_WORLD_BOOS_STATUS, worldBossStatus);

    const playerList = SortPlayer(playerRecordJson);

    void Send(Text('正在进行存档有效性检测，如果长时间没有回复请联系主人修复存档并手动按照贡献榜发放奖励'));

    const rewardMsg: string[] = ['****妖王周本贡献排行榜****'];
    const showMax = Math.min(playerList.length, 20);
    let topDamageSum = 0;

    for (let i = 0; i < showMax; i++) {
      topDamageSum += playerRecordJson.TotalDamage[playerList[i]];
    }

    if (topDamageSum <= 0) {
      topDamageSum = showMax; // 防止除零 -> 平分
    }

    for (let i = 0; i < playerList.length; i++) {
      const idx = playerList[i];
      const qq = playerRecordJson.QQ[idx];
      const currentPlayer = await getDataJSONParseByKey(keys.player(qq));

      if (!currentPlayer) {
        continue;
      }

      if (i < showMax) {
        let reward = Math.trunc((playerRecordJson.TotalDamage[idx] / topDamageSum) * worldBossStatus.Reward);

        if (!Number.isFinite(reward) || reward < 200000) {
          reward = 200000;
        }

        rewardMsg.push(`第${i + 1}名:\n名号:${currentPlayer.名号}\n伤害:${playerRecordJson.TotalDamage[idx]}\n获得灵石奖励${reward}`);
        currentPlayer.灵石 += reward;
        await setDataJSONStringifyByKey(keys.player(qq), currentPlayer);
      } else {
        currentPlayer.灵石 += 200000;
        await setDataJSONStringifyByKey(keys.player(qq), currentPlayer);

        if (i === playerList.length - 1) {
          rewardMsg.push('其余参与的修仙者均获得200000灵石奖励！');
        }
      }
    }

    void Send(Text(rewardMsg.join('\n')));
  }

  WorldBossBattleInfo.setCD(userId, Date.now());
  WorldBossBattleInfo.setLock(0);

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
