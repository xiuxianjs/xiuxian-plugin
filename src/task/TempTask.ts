import { getIoRedis } from '@alemonjs/db'
import { __PATH } from '@src/model/paths'

const redis = getIoRedis()

// 临时任务定时器
export const TempTask = async () => {
  try {
    console.log('开始执行临时任务...')

    // 获取所有临时任务
    const tempTaskKey = 'temp:tasks'
    const tempTasksData = await redis.get(tempTaskKey)

    if (tempTasksData) {
      const tempTasks = JSON.parse(tempTasksData)
      const now = Date.now()
      const completedTasks = []

      // 检查每个临时任务
      for (const task of tempTasks) {
        if (task.endTime && now >= task.endTime) {
          // 任务已完成，执行回调
          await executeTempTask(task)
          completedTasks.push(task.id)
        }
      }

      // 移除已完成的任务
      if (completedTasks.length > 0) {
        const remainingTasks = tempTasks.filter(
          (task: any) => !completedTasks.includes(task.id)
        )
        await redis.set(tempTaskKey, JSON.stringify(remainingTasks))
        console.log(`完成了 ${completedTasks.length} 个临时任务`)
      }
    }

    // 清理过期的临时数据
    await cleanupTempData()

    console.log('临时任务执行完成')
  } catch (error) {
    console.error('执行临时任务失败:', error)
  }
}

// 执行临时任务
async function executeTempTask(task: any) {
  try {
    console.log(`执行临时任务: ${task.type} - ${task.id}`)

    switch (task.type) {
      case 'player_action':
        await handlePlayerActionTask(task)
        break
      case 'association_event':
        await handleAssociationEventTask(task)
        break
      case 'system_maintenance':
        await handleSystemMaintenanceTask(task)
        break
      default:
        console.log(`未知的临时任务类型: ${task.type}`)
    }
  } catch (error) {
    console.error(`执行临时任务失败 ${task.id}:`, error)
  }
}

// 处理玩家动作任务
async function handlePlayerActionTask(task: any) {
  const { playerId, actionType, rewards } = task.data

  // 获取玩家数据
  const playerKey = `${__PATH.player_path}:${playerId}`
  const playerData = await redis.get(playerKey)

  if (playerData) {
    const player = JSON.parse(decodeURIComponent(playerData))

    // 发放奖励
    if (rewards) {
      if (rewards.灵石) {
        player.灵石 = (player.灵石 || 0) + rewards.灵石
      }
      if (rewards.经验) {
        player.经验 = (player.经验 || 0) + rewards.经验
      }
      // 可以添加更多奖励类型
    }

    // 清除动作状态
    if (player.action && player.action.id === task.id) {
      delete player.action
    }

    // 保存玩家数据
    await redis.set(playerKey, encodeURIComponent(JSON.stringify(player)))
    console.log(`玩家 ${playerId} 的动作任务完成`)
  }
}

// 处理宗门事件任务
async function handleAssociationEventTask(task: any) {
  const { associationName, eventType, effects } = task.data

  // 获取宗门数据
  const associationKey = `${__PATH.association}:${associationName}`
  const associationData = await redis.get(associationKey)

  if (associationData) {
    const association = JSON.parse(decodeURIComponent(associationData))

    // 应用事件效果
    if (effects) {
      if (effects.灵石池) {
        association.灵石池 = (association.灵石池 || 0) + effects.灵石池
      }
      if (effects.宗门等级) {
        association.宗门等级 = (association.宗门等级 || 1) + effects.宗门等级
      }
    }

    // 保存宗门数据
    await redis.set(
      associationKey,
      encodeURIComponent(JSON.stringify(association))
    )
    console.log(`宗门 ${associationName} 的事件任务完成`)
  }
}

// 处理系统维护任务
async function handleSystemMaintenanceTask(task: any) {
  const { maintenanceType, duration } = task.data

  // 设置系统维护状态
  const maintenanceKey = 'system:maintenance'
  const maintenanceData = {
    type: maintenanceType,
    startTime: Date.now(),
    duration: duration,
    status: 'completed'
  }

  await redis.set(maintenanceKey, JSON.stringify(maintenanceData))
  console.log(`系统维护任务完成: ${maintenanceType}`)
}

// 清理临时数据
async function cleanupTempData() {
  try {
    // 清理过期的临时缓存
    const tempCachePattern = 'temp:cache:*'
    const tempCacheKeys = await getAllKeys(tempCachePattern)

    const now = Date.now()
    let cleanedCount = 0

    for (const key of tempCacheKeys) {
      const cacheData = await redis.get(key)
      if (cacheData) {
        const cache = JSON.parse(cacheData)
        if (cache.expireTime && now >= cache.expireTime) {
          await redis.del(key)
          cleanedCount++
        }
      }
    }

    if (cleanedCount > 0) {
      console.log(`清理了 ${cleanedCount} 个过期临时缓存`)
    }
  } catch (error) {
    console.error('清理临时数据失败:', error)
  }
}

// 获取所有匹配的键
async function getAllKeys(pattern: string): Promise<string[]> {
  const allKeys = []
  let cursor = 0

  do {
    const result = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100)
    cursor = parseInt(result[0])
    allKeys.push(...result[1])
  } while (cursor !== 0)

  return allKeys
}
