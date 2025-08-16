import { getIoRedis } from '@alemonjs/db'
import { __PATH } from '@src/model/paths'

const redis = getIoRedis()

// 游戏锁定定时任务
export const GamesTask = async () => {
  try {
    console.log('开始检查游戏锁定状态...')

    // 获取游戏锁定配置
    const gameLockKey = 'game:lock:status'
    const lockStatus = await redis.get(gameLockKey)

    if (lockStatus) {
      const lockData = JSON.parse(lockStatus)
      const now = Date.now()

      // 检查锁定是否已过期
      if (lockData.endTime && now >= lockData.endTime) {
        // 清除锁定状态
        await redis.del(gameLockKey)
        console.log('游戏锁定已解除')
      } else {
        console.log('游戏仍处于锁定状态')
      }
    }

    // 检查临时锁定
    const tempLockKey = 'game:temp:lock'
    const tempLockStatus = await redis.get(tempLockKey)

    if (tempLockStatus) {
      const tempLockData = JSON.parse(tempLockStatus)
      const now = Date.now()

      // 检查临时锁定是否已过期
      if (tempLockData.endTime && now >= tempLockData.endTime) {
        // 清除临时锁定状态
        await redis.del(tempLockKey)
        console.log('临时游戏锁定已解除')
      }
    }

    console.log('游戏锁定状态检查完成')
  } catch (error) {
    console.error('检查游戏锁定状态失败:', error)
  }
}
