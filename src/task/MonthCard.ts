import { redis } from '@src/model';

export const MonthCardTask = async (): Promise<void> => {
  try {
    const list = await redis.keys('xiuxian@1.3.0:month_card:weekly_gift:*');

    for (const key of list) {
      await redis.del(key);
    }
  } catch (error) {
    logger.error(error);
  }
};
