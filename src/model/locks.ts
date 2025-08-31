import { getIoRedis } from '@alemonjs/db';
import { randomUUID } from 'crypto';
import { baseKey } from './keys';

// 类型定义
export interface LockOptions {
  /** 锁超时时间（毫秒），默认30秒 */
  timeout?: number;
  /** 重试间隔（毫秒），默认100ms */
  retryDelay?: number;
  /** 最大重试次数，默认10次 */
  maxRetries?: number;
  /** 锁的值，用于标识锁的持有者 */
  value?: string;
  /** 进程ID，用于标识锁持有者 */
  processId?: string;
  /** 是否启用锁续期 */
  enableRenewal?: boolean;
  /** 锁续期间隔（毫秒），默认超时时间的1/3 */
  renewalInterval?: number;
}

export interface LockResult {
  /** 是否成功获取锁 */
  acquired: boolean;
  /** 锁的值 */
  value?: string;
  /** 错误信息 */
  error?: string;
  /** 锁的TTL */
  ttl?: number;
}

export interface LockState {
  /** 锁的键名 */
  key: string;
  /** 锁的值 */
  value: string;
  /** 锁的TTL */
  ttl: number;
  /** 续期定时器ID */
  renewalTimer?: NodeJS.Timeout;
}

export interface LockContext {
  redis: any;
  renewalTimers: Map<string, NodeJS.Timeout>;
}

// 默认配置
const DEFAULT_OPTIONS: Required<LockOptions> = {
  timeout: 30000,
  retryDelay: 100,
  maxRetries: 10,
  value: '',
  processId: process.pid.toString(),
  enableRenewal: false,
  renewalInterval: 10000
};

// 工具函数
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const generateLockValue = (): string => {
  const uuid = randomUUID();
  const timestamp = Date.now();
  const processId = process.pid;
  const random = Math.random().toString(36).substr(2, 9);

  return `${uuid}-${timestamp}-${processId}-${random}`;
};

const getLockKey = (key: string): string => `${baseKey}:locks:${key}`;

const mergeOptions = (options: LockOptions = {}): Required<LockOptions> => ({ ...DEFAULT_OPTIONS, ...options });

// 纯函数：创建锁上下文
const createLockContext = (): LockContext => ({
  redis: getIoRedis(),
  renewalTimers: new Map()
});

// 纯函数：生成锁值
const createLockValue = (options: LockOptions): string => options.value || generateLockValue();

// 纯函数：构建锁结果
const createLockResult = (acquired: boolean, value?: string, error?: string, ttl?: number): LockResult => ({
  acquired,
  value,
  error,
  ttl
});

// 纯函数：构建成功结果
const createSuccessResult = (value: string, ttl: number): LockResult => createLockResult(true, value, undefined, ttl);

// 纯函数：构建失败结果
const createErrorResult = (error: string): LockResult => createLockResult(false, undefined, error);

// 纯函数：构建超时结果
const createTimeoutResult = (): LockResult => createErrorResult('获取锁超时，已达到最大重试次数');

// 锁续期相关函数
const startRenewal = (context: LockContext, lockKey: string, lockValue: string, interval: number): LockContext => {
  // 停止之前的续期定时器
  const newContext = stopRenewal(context, lockKey);

  const timer = setInterval(() => {
    void (async () => {
      try {
        const script = `
          if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("expire", KEYS[1], ARGV[2])
          else
            return 0
          end
        `;

        const result = await newContext.redis.eval(script, 1, lockKey, lockValue, Math.floor(interval / 1000));

        if (result === 0) {
          stopRenewal(newContext, lockKey);
        }
      } catch (error) {
        logger.error('锁续期失败:', error);
        stopRenewal(newContext, lockKey);
      }
    })();
  }, interval);

  const newRenewalTimers = new Map(newContext.renewalTimers);

  newRenewalTimers.set(lockKey, timer);

  return {
    ...newContext,
    renewalTimers: newRenewalTimers
  };
};

const stopRenewal = (context: LockContext, lockKey: string): LockContext => {
  const timer = context.renewalTimers.get(lockKey);

  if (timer) {
    clearInterval(timer);
    const newRenewalTimers = new Map(context.renewalTimers);

    newRenewalTimers.delete(lockKey);

    return {
      ...context,
      renewalTimers: newRenewalTimers
    };
  }

  return context;
};

// 核心锁操作函数
const attemptAcquireLock = async (
  context: LockContext,
  lockKey: string,
  lockValue: string,
  timeout: number
): Promise<{ success: boolean; context: LockContext }> => {
  try {
    const result = await context.redis.set(lockKey, lockValue, 'EX', Math.floor(timeout / 1000), 'NX');

    return { success: result === 'OK', context };
  } catch (error) {
    logger.error(error);

    return { success: false, context };
  }
};

const retryAcquireLock = async (
  context: LockContext,
  lockKey: string,
  lockValue: string,
  options: Required<LockOptions>
): Promise<{ success: boolean; context: LockContext }> => {
  let currentContext = context;

  for (let retries = 0; retries <= options.maxRetries; retries++) {
    const { success, context: newContext } = await attemptAcquireLock(currentContext, lockKey, lockValue, options.timeout);

    if (success) {
      return { success: true, context: newContext };
    }

    if (retries < options.maxRetries) {
      await sleep(options.retryDelay);
    }

    currentContext = newContext;
  }

  return { success: false, context: currentContext };
};

// 主要锁操作函数
export const acquireLock = async (key: string, options: LockOptions = {}): Promise<LockResult> => {
  const opts = mergeOptions(options);
  const lockValue = createLockValue(opts);
  const lockKey = getLockKey(key);
  const context = createLockContext();

  try {
    const { success, context: newContext } = await retryAcquireLock(context, lockKey, lockValue, opts);

    if (success) {
      // 如果启用锁续期，启动续期定时器
      if (opts.enableRenewal) {
        startRenewal(newContext, lockKey, lockValue, opts.renewalInterval);
      }

      return createSuccessResult(lockValue, opts.timeout);
    }

    return createTimeoutResult();
  } catch (error) {
    return createErrorResult(`获取锁失败: ${error}`);
  }
};

export const releaseLock = async (key: string, value: string): Promise<boolean> => {
  const lockKey = getLockKey(key);
  const context = createLockContext();

  try {
    // 停止锁续期
    stopRenewal(context, lockKey);

    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    const result = await context.redis.eval(script, 1, lockKey, value);

    return result === 1;
  } catch (error) {
    logger.error('释放锁失败:', error);

    return false;
  }
};

export const isLocked = async (key: string): Promise<boolean> => {
  const lockKey = getLockKey(key);
  const context = createLockContext();

  try {
    const exists = await context.redis.exists(lockKey);

    return exists > 0;
  } catch (error) {
    logger.error('检查锁状态失败:', error);

    return false;
  }
};

export const getLockTTL = async (key: string): Promise<number> => {
  const lockKey = getLockKey(key);
  const context = createLockContext();

  try {
    const ttl = await context.redis.ttl(lockKey);

    return ttl > 0 ? ttl * 1000 : 0;
  } catch (error) {
    logger.error('获取锁TTL失败:', error);

    return 0;
  }
};

export const forceRelease = async (key: string): Promise<boolean> => {
  const lockKey = getLockKey(key);
  const context = createLockContext();

  try {
    stopRenewal(context, lockKey);
    const result = await context.redis.del(lockKey);

    return result > 0;
  } catch (error) {
    logger.error('强制释放锁失败:', error);

    return false;
  }
};

// 高阶函数：使用锁执行函数
export const withLock = async <T>(key: string, fn: () => Promise<T>, options: LockOptions = {}): Promise<{ success: boolean; data?: T; error?: string }> => {
  const lock = await acquireLock(key, options);

  if (!lock.acquired) {
    return { success: false, error: lock.error || '无法获取锁' };
  }

  try {
    const data = await fn();

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  } finally {
    if (lock.value) {
      await releaseLock(key, lock.value);
    }
  }
};

// 函数组合：检查是否可以获取数据
export const canGetData = async (key: string): Promise<boolean> => {
  return !(await isLocked(key));
};

// 锁管理器（函数式风格）
export const createLockManager = () => {
  const context = createLockContext();

  return {
    acquire: (key: string, options?: LockOptions) => acquireLock(key, options),
    release: (key: string, value: string) => releaseLock(key, value),
    isLocked: (key: string) => isLocked(key),
    getTTL: (key: string) => getLockTTL(key),
    forceRelease: (key: string) => forceRelease(key),
    withLock: <T>(key: string, fn: () => Promise<T>, options?: LockOptions) => withLock(key, fn, options),
    cleanup: () => {
      for (const [_lockKey, timer] of context.renewalTimers) {
        clearInterval(timer);
      }
      context.renewalTimers.clear();
    }
  };
};

// 创建默认锁管理器实例
export const lockManager = createLockManager();

// 进程退出时清理资源
const cleanup = () => lockManager.cleanup();

process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});
process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});
