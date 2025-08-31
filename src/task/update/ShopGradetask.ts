import { keysLock } from '@src/model';
import { withLock } from '@src/model/locks';
import { readShop, writeShop } from '@src/model/shop';
import type { ShopSlot } from '@src/types';

const startTask = async () => {
  const shop = await readShop();

  for (const slot of shop as Array<ShopSlot & { Grade?: number }>) {
    const current = Number(slot.Grade ?? 1);

    slot.Grade = current - 1;
    if (slot.Grade < 1) {
      slot.Grade = 1;
    }
  }
  await writeShop(shop);
};

const executeBossBattleWithLock = async () => {
  const lockKey = keysLock.task('ShopGradetask');

  const result = await withLock(
    lockKey,
    async () => {
      await startTask();
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
    logger.warn('ShopGradetask lock failed:', result.error);
  }
};

/**
 * 【洗劫玩法】
 * 定时把商店的等级-1。最低不低于1。
 * 多个机器人使用一个数据，
 * 需要锁来保持数据一致性
 */
export const ShopGradetask = () => {
  // 随机 延迟 [5,35] 秒再执行。
  const delay = Math.floor(Math.random() * (35 - 5 + 1)) + 5;

  setTimeout(() => {
    void executeBossBattleWithLock();
  }, delay * 1000);
};
