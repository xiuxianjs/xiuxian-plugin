import { keysLock } from '@src/model/keys';
import { withLock } from '@src/model/locks';
import { reSetTiandibang } from '@src/model/Tiandibang';

const executeBossBattleWithLock = async () => {
  const lockKey = keysLock.task('Tiandibang');

  const result = await withLock(
    lockKey,
    async () => {
      await reSetTiandibang();
    },
    {
      timeout: 1000 * 25, // 25秒超时
      retryDelay: 100, // 100ms重试间隔
      maxRetries: 0, // 不重试
      enableRenewal: true, // 启用锁续期
      renewalInterval: 1000 * 10 // 10秒续期间隔
    }
  );

  if (!result.success) {
    logger.warn('Tiandibang lock failed:', result.error);
  }
};

/**
 * 天地榜重置任务
 * 定时重置所有玩家积分为0，次数为3次
 */
export const TiandibangTask = () => {
  // 随机延迟 [60,180] 秒再执行
  const delay = Math.floor(Math.random() * (180 - 60 + 1)) + 60;

  setTimeout(() => {
    void executeBossBattleWithLock();
  }, delay * 1000);
};
