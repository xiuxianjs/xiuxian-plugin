import { getIoRedis } from '@alemonjs/db'
import { __PATH } from '@src/model/paths'

const redis = getIoRedis()

// 检测人物动作是否结束定时任务
export const ActionTask = async () => {
  try {
    console.log('开始检测人物动作状态...')

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
    let completedActions = 0

    // 处理每个玩家数据
    for (const key of allKeys) {
      const userId = key.replace(`${__PATH.player_path}:`, '')
      const playerData = await redis.get(key)

      if (playerData) {
        try {
          const player = JSON.parse(decodeURIComponent(playerData))

          // 检查是否有进行中的动作
          if (player.action && player.action.endTime) {
            const now = Date.now()
            const endTime = parseInt(player.action.endTime)

            // 如果动作已结束
            if (now >= endTime) {
              // 清除动作状态
              delete player.action

              // 保存更新后的玩家数据
              await redis.set(key, encodeURIComponent(JSON.stringify(player)))
              completedActions++

              console.log(`玩家 ${userId} 的动作已完成`)
            }
          }

          processedCount++
        } catch (error) {
          console.error(`处理玩家动作状态失败 ${userId}:`, error)
        }
      }
    }

    console.log(
      `动作检测完成，处理了 ${processedCount} 个玩家，完成了 ${completedActions} 个动作`
    )
  } catch (error) {
    console.error('检测人物动作状态失败:', error)
  }
}
