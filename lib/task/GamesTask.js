import { getIoRedis } from '@alemonjs/db';

const redis = getIoRedis();
const GamesTask = async () => {
    try {
        console.log('开始检查游戏锁定状态...');
        const gameLockKey = 'game:lock:status';
        const lockStatus = await redis.get(gameLockKey);
        if (lockStatus) {
            const lockData = JSON.parse(lockStatus);
            const now = Date.now();
            if (lockData.endTime && now >= lockData.endTime) {
                await redis.del(gameLockKey);
                console.log('游戏锁定已解除');
            }
            else {
                console.log('游戏仍处于锁定状态');
            }
        }
        const tempLockKey = 'game:temp:lock';
        const tempLockStatus = await redis.get(tempLockKey);
        if (tempLockStatus) {
            const tempLockData = JSON.parse(tempLockStatus);
            const now = Date.now();
            if (tempLockData.endTime && now >= tempLockData.endTime) {
                await redis.del(tempLockKey);
                console.log('临时游戏锁定已解除');
            }
        }
        console.log('游戏锁定状态检查完成');
    }
    catch (error) {
        console.error('检查游戏锁定状态失败:', error);
    }
};

export { GamesTask };
