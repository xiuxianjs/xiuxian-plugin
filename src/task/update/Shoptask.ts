import { keysLock } from '@src/model';
import { getDataList } from '@src/model/DataList';
import { withLock } from '@src/model/locks';
import { readShop, writeShop } from '@src/model/shop';

const startTask = async () => {
  const shop = await readShop();
  const shopList = await getDataList('Shop');

  for (let i = 0; i < shop.length; i++) {
    shop[i].one = shopList[i].one;
    shop[i].price = shopList[i].price;
  }
  await writeShop(shop);
};

const executeBossBattleWithLock = async () => {
  const lockKey = keysLock.task('Shoptask');

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
    logger.warn('Shoptask lock failed:', result.error);
  }
};

/**
 * 【洗劫玩法】
 * 定时重置商店数据，
 * 多个机器人使用一个数据，
 * 需要锁来保持数据一致性
 */
export const Shoptask = () => {
  // 随机 延迟 [5,35] 秒再执行。
  const delay = Math.floor(Math.random() * (35 - 5 + 1)) + 5;

  setTimeout(() => {
    void executeBossBattleWithLock();
  }, delay * 1000);
};
