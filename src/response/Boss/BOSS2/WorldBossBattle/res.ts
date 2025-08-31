import { Text, useSend } from 'alemonjs';
import { readPlayer } from '@src/model';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { getDataByKey } from '@src/model/DataControl';
import { keysAction, keysLock } from '@src/model/keys';
import { WorldBossBattle, WorldBossBattleInfo, bossStatus, isBossWord2 } from '../../../../model/boss';

import mw from '@src/response/mw';
import { acquireLock, releaseLock, withLock } from '@src/model/locks';
import * as _ from 'lodash-es';

const selects = onSelects(['message.create']);

export const regular = /^(#|＃|\/)?讨伐金角大王$/;

function toInt(v: any, d = 0): number {
  const n = Number(v);

  return Number.isFinite(n) ? Math.trunc(n) : d;
}

// 境界限制
const isLevelMaxLimit = (levelId: number, lunhui: number) => {
  return levelId > 41 || lunhui > 0;
};

// Boss战斗锁配置
const BOSS_LOCK_CONFIG = {
  timeout: 30000, // 30秒超时
  retryDelay: 100, // 100ms重试间隔
  maxRetries: 5, // 最大重试5次
  enableRenewal: true, // 启用锁续期
  renewalInterval: 10000 // 10秒续期间隔
};

// 使用锁执行Boss战斗
const executeBossBattleWithLock = (e: any, userId: string, player: any, boss: any) => {
  const lockKey = keysLock.boss('boss2');

  return withLock(
    lockKey,
    async () => {
      // 在锁保护下执行Boss战斗逻辑
      await WorldBossBattle(e, { userId, player, boss, key: '2', endLingshi: 500000, averageLingshi: 100000 });
    },
    BOSS_LOCK_CONFIG
  );
};

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  // 获取用户锁，防止同一用户重复操作
  const userLockKey = `user_boss_battle:${userId}`;
  const userLockResult = await acquireLock(userLockKey, {
    timeout: 10000, // 10秒超时
    retryDelay: 50, // 50ms重试间隔
    maxRetries: 3, // 最大重试3次
    enableRenewal: false // 用户锁不需要续期
  });

  if (!userLockResult.acquired) {
    void Send(Text('操作过于频繁，请稍后再试'));

    return false;
  }

  try {
    const player = await readPlayer(userId);

    if (!player) {
      void Send(Text('区区凡人，也想参与此等战斗中吗？'));

      return false;
    }

    if (!(await isBossWord2())) {
      void Send(Text('金角大王未刷新'));

      return;
    }

    if (isLevelMaxLimit(player.level_id, player.lunhui)) {
      void Send(Text('仙人不得下凡'));

      return false;
    }

    if (player.level_id < 22) {
      void Send(Text('修为至少达到化神初期才能参与挑战'));

      return false;
    }

    // 修复类型错误：明确指定ActionState类型
    const action = await getDataJSONParseByKey(keysAction.action(userId));

    if (action?.end_time && Date.now() <= action.end_time) {
      const remain = action.end_time - Date.now();
      const m = Math.floor(remain / 60000);
      const s = Math.floor((remain % 60000) / 1000);

      void Send(Text(`正在${action.action || '行动'}中,剩余时间:${m}分${s}秒`));

      return false;
    }

    if (player.当前血量 <= player.血量上限 * 0.1) {
      void Send(Text('还是先疗伤吧，别急着参战了'));

      return false;
    }

    // 检查内存CD
    if (WorldBossBattleInfo.CD[userId]) {
      const seconds = Math.trunc((300000 - (Date.now() - WorldBossBattleInfo.CD[userId])) / 1000);

      if (seconds <= 300 && seconds >= 0) {
        void Send(Text(`刚刚一战消耗了太多气力，还是先歇息一会儿吧~(剩余${seconds}秒)`));

        return false;
      }
    }

    // 检查Boss状态
    const bossStatusResult = await bossStatus('2');

    if (bossStatusResult === 'dead') {
      void Send(Text('金角大王已经被击败了，请等待下次刷新'));

      return;
    } else if (bossStatusResult === 'initializing') {
      void Send(Text('金角大王正在初始化，请稍后'));

      return;
    }

    const now = Date.now();
    const fightCdMs = 5 * 60000;
    const lastTime = toInt(await getDataByKey(keysAction.bossCD(userId)));

    if (now < lastTime + fightCdMs) {
      const remain = lastTime + fightCdMs - now;
      const m = Math.trunc(remain / 60000);
      const s = Math.trunc((remain % 60000) / 1000);

      void Send(Text(`正在CD中，剩余cd:  ${m}分 ${s}秒`));

      return false;
    }

    // 使用分布式锁执行Boss战斗
    try {
      await executeBossBattleWithLock(e, userId, player, {
        名号: '金角大王幻影',
        攻击: Math.floor(player.攻击 * (0.8 + 0.4 * Math.random())),
        防御: Math.floor(player.防御 * (0.8 + 0.4 * Math.random())),
        当前血量: Math.floor(player.血量上限 * (0.8 + 0.4 * Math.random())),
        暴击率: player.暴击率,
        灵根: player.灵根,
        法球倍率: player.灵根?.法球倍率
      });
    } catch (error) {
      logger.error('Boss战斗执行失败:', error);
      void Send(Text('战斗过程中出现异常，请稍后重试'));

      return false;
    }

    return false;
  } finally {
    // 确保释放用户锁
    if (userLockResult.value) {
      await releaseLock(userLockKey, userLockResult.value);
    }
  }
});

export default onResponse(selects, [mw.current, res.current]);
