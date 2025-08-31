import { readForum, writeForum } from '@src/model/trade';
import { addCoin } from '@src/model/economy';
import { keysLock } from '@src/model';
import { withLock } from '@src/model/locks';
import { ForumRecord } from '@src/types';

interface ProcessResult {
  success: boolean;
  processedCount: number;
  errorCount: number;
  message: string;
}

/**
 * 基础配置常量
 */
const BASE_CONFIG = {
  FORUM_EXPIRY_DAYS: 3,
  MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000
} as const;

/**
 * 计算记录的天数差
 * @param recordTime 记录时间
 * @param currentTime 当前时间
 * @returns 天数差
 */
const calculateDaysDifference = (recordTime: number, currentTime: number): number => {
  const timeDifference = currentTime - recordTime;

  return timeDifference / BASE_CONFIG.MILLISECONDS_PER_DAY;
};

/**
 * 处理单个论坛记录
 * @param record 论坛记录
 * @param currentTime 当前时间
 * @returns 是否处理成功
 */
const processForumRecord = async (record: ForumRecord, currentTime: number): Promise<boolean> => {
  try {
    const daysDifference = calculateDaysDifference(record.now_time, currentTime);

    // 如果未超过3天，跳过处理
    if (daysDifference < BASE_CONFIG.FORUM_EXPIRY_DAYS) {
      return false;
    }

    const userId = record.qq;
    const lingshi = record.whole;

    // 发放灵石奖励给用户
    await addCoin(userId, lingshi);

    return true;
  } catch (error) {
    logger.error(error);

    return false;
  }
};

/**
 * 处理论坛记录列表
 * @param records 论坛记录列表
 * @param currentTime 当前时间
 * @returns 处理结果
 */
const processForumRecords = async (records: ForumRecord[], currentTime: number): Promise<ProcessResult> => {
  let processedCount = 0;
  let errorCount = 0;
  const validRecords: ForumRecord[] = [];

  for (const record of records) {
    try {
      const success = await processForumRecord(record, currentTime);

      if (success) {
        processedCount++;
      } else {
        // 如果处理失败或未过期，保留记录
        validRecords.push(record);
      }
    } catch (error) {
      logger.error(error);
      errorCount++;
      // 处理出错时保留记录，避免数据丢失
      validRecords.push(record);
    }
  }

  return {
    success: processedCount > 0 || errorCount === 0,
    processedCount,
    errorCount,
    message: `处理了 ${processedCount} 条过期记录，${errorCount} 条记录处理失败`
  };
};

/**
 * 过滤有效记录
 * @param records 论坛记录列表
 * @param currentTime 当前时间
 * @returns 有效记录列表
 */
const filterValidRecords = (records: ForumRecord[], currentTime: number): ForumRecord[] => {
  return records.filter(record => {
    const daysDifference = calculateDaysDifference(record.now_time, currentTime);

    return daysDifference < BASE_CONFIG.FORUM_EXPIRY_DAYS;
  });
};

const startTask = async () => {
  try {
    // 读取论坛记录
    const forumRecords: ForumRecord[] = await readForum();

    const currentTime = Date.now();

    if (!forumRecords || forumRecords.length === 0) {
      return;
    }

    // 处理论坛记录
    await processForumRecords(forumRecords, currentTime);

    // 过滤出未过期的记录
    const validRecords = filterValidRecords(forumRecords, currentTime);

    // 写回更新后的记录
    await writeForum(validRecords);
  } catch (error) {
    logger.error(error);
  }
};

const executeBossBattleWithLock = () => {
  const lockKey = keysLock.task('ForumTask');

  return withLock(
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
};

/**
 * 论坛任务 - 处理论记录
 * 读取记录，检查过期记录。
 * 多个机器人使用一个数据，
 * 需要锁来保持数据一致性
 */
export const ForumTask = () => {
  // 随机 延迟 [60,180] 秒再执行。
  const delay = Math.floor(Math.random() * (180 - 60 + 1)) + 60;

  setTimeout(() => {
    void executeBossBattleWithLock();
  }, delay * 1000);
};
