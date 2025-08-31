import { getIoRedis } from '@alemonjs/db';
import { randomUUID } from 'crypto';
import { baseKey } from './keys.js';

const DEFAULT_OPTIONS = {
    timeout: 30000,
    retryDelay: 100,
    maxRetries: 10,
    value: '',
    processId: process.pid.toString(),
    enableRenewal: false,
    renewalInterval: 10000
};
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const generateLockValue = () => {
    const uuid = randomUUID();
    const timestamp = Date.now();
    const processId = process.pid;
    const random = Math.random().toString(36).substr(2, 9);
    return `${uuid}-${timestamp}-${processId}-${random}`;
};
const getLockKey = (key) => `${baseKey}:locks:${key}`;
const mergeOptions = (options = {}) => ({ ...DEFAULT_OPTIONS, ...options });
const createLockContext = () => ({
    redis: getIoRedis(),
    renewalTimers: new Map()
});
const createLockValue = (options) => options.value || generateLockValue();
const createLockResult = (acquired, value, error, ttl) => ({
    acquired,
    value,
    error,
    ttl
});
const createSuccessResult = (value, ttl) => createLockResult(true, value, undefined, ttl);
const createErrorResult = (error) => createLockResult(false, undefined, error);
const createTimeoutResult = () => createErrorResult('获取锁超时，已达到最大重试次数');
const startRenewal = (context, lockKey, lockValue, interval) => {
    const newContext = stopRenewal(context, lockKey);
    const timer = setInterval(() => {
        (async () => {
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
            }
            catch (error) {
                console.error('锁续期失败:', error);
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
const stopRenewal = (context, lockKey) => {
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
const attemptAcquireLock = async (context, lockKey, lockValue, timeout) => {
    try {
        const result = await context.redis.set(lockKey, lockValue, 'EX', Math.floor(timeout / 1000), 'NX');
        return { success: result === 'OK', context };
    }
    catch (error) {
        logger.error(error);
        return { success: false, context };
    }
};
const retryAcquireLock = async (context, lockKey, lockValue, options) => {
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
const acquireLock = async (key, options = {}) => {
    const opts = mergeOptions(options);
    const lockValue = createLockValue(opts);
    const lockKey = getLockKey(key);
    const context = createLockContext();
    try {
        const { success, context: newContext } = await retryAcquireLock(context, lockKey, lockValue, opts);
        if (success) {
            if (opts.enableRenewal) {
                startRenewal(newContext, lockKey, lockValue, opts.renewalInterval);
            }
            return createSuccessResult(lockValue, opts.timeout);
        }
        return createTimeoutResult();
    }
    catch (error) {
        return createErrorResult(`获取锁失败: ${error}`);
    }
};
const releaseLock = async (key, value) => {
    const lockKey = getLockKey(key);
    const context = createLockContext();
    try {
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
    }
    catch (error) {
        console.error('释放锁失败:', error);
        return false;
    }
};
const isLocked = async (key) => {
    const lockKey = getLockKey(key);
    const context = createLockContext();
    try {
        const exists = await context.redis.exists(lockKey);
        return exists > 0;
    }
    catch (error) {
        console.error('检查锁状态失败:', error);
        return false;
    }
};
const getLockTTL = async (key) => {
    const lockKey = getLockKey(key);
    const context = createLockContext();
    try {
        const ttl = await context.redis.ttl(lockKey);
        return ttl > 0 ? ttl * 1000 : 0;
    }
    catch (error) {
        console.error('获取锁TTL失败:', error);
        return 0;
    }
};
const forceRelease = async (key) => {
    const lockKey = getLockKey(key);
    const context = createLockContext();
    try {
        stopRenewal(context, lockKey);
        const result = await context.redis.del(lockKey);
        return result > 0;
    }
    catch (error) {
        console.error('强制释放锁失败:', error);
        return false;
    }
};
const withLock = (key, fn, options = {}) => {
    return acquireLock(key, options).then(async (lock) => {
        if (!lock.acquired) {
            throw new Error(lock.error || '无法获取锁');
        }
        try {
            return await fn();
        }
        finally {
            if (lock.value) {
                await releaseLock(key, lock.value);
            }
        }
    });
};
const canGetData = async (key) => {
    return !(await isLocked(key));
};
const createLockManager = () => {
    const context = createLockContext();
    return {
        acquire: (key, options) => acquireLock(key, options),
        release: (key, value) => releaseLock(key, value),
        isLocked: (key) => isLocked(key),
        getTTL: (key) => getLockTTL(key),
        forceRelease: (key) => forceRelease(key),
        withLock: (key, fn, options) => withLock(key, fn, options),
        cleanup: () => {
            for (const [_lockKey, timer] of context.renewalTimers) {
                clearInterval(timer);
            }
            context.renewalTimers.clear();
        }
    };
};
const lockManager = createLockManager();
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

export { acquireLock, canGetData, createLockManager, forceRelease, getLockTTL, isLocked, lockManager, releaseLock, withLock };
