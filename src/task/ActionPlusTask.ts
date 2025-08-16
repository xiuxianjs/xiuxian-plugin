import { getIoRedis } from '@alemonjs/db'
import { __PATH } from '@src/model/paths'

const redis = getIoRedis()

// 检测沉迷是否结束定时任务
export const ActionPlusTask = async () => {
  try {
    console.log('开始检测沉迷状态...')

    // 获取所有玩家数据
    const scanPattern = `${__PATH.player_path}:*`
    let cursor = 0
    const allKeys = []

    do {
      const result = await redis.scan(
        cursor,
        'MATCH',
        scanPattern,
        'COUNT',
        100
      )
      cursor = parseInt(result[0])
      allKeys.push(...result[1])
    } while (cursor !== 0)

    let processedCount = 0
    let releasedCount = 0

    // 处理每个玩家数据
    for (const key of allKeys) {
      const userId = key.replace(`${__PATH.player_path}:`, '')
      const playerData = await redis.get(key)

      if (playerData) {
        try {
          const player = JSON.parse(decodeURIComponent(playerData))

          // 检查是否有沉迷状态
          if (player.沉迷 && player.沉迷.endTime) {
            const now = Date.now()
            const endTime = parseInt(player.沉迷.endTime)

            // 如果沉迷已结束
            if (now >= endTime) {
              // 清除沉迷状态
              delete player.沉迷

              // 保存更新后的玩家数据
              await redis.set(key, encodeURIComponent(JSON.stringify(player)))
              releasedCount++

              console.log(`玩家 ${userId} 的沉迷状态已解除`)
            }
          }

          processedCount++
        } catch (error) {
          console.error(`处理玩家沉迷状态失败 ${userId}:`, error)
        }
      }
    }

    console.log(
      `沉迷检测完成，处理了 ${processedCount} 个玩家，解除了 ${releasedCount} 个沉迷状态`
    )
  } catch (error) {
    console.error('检测沉迷状态失败:', error)
  }
}
