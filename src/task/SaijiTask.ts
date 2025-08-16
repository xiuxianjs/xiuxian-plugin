import { getIoRedis } from '@alemonjs/db'
import { __PATH } from '@src/model/paths'

const redis = getIoRedis()

// 赛季结算定时任务
export const SaijiTask = async () => {
  try {
    console.log('开始赛季结算...')

    // 获取当前赛季信息
    const seasonKey = 'game:season:current'
    const seasonData = await redis.get(seasonKey)

    if (seasonData) {
      const season = JSON.parse(seasonData)
      const now = new Date()

      // 检查是否需要进行赛季结算
      if (season.endTime && now >= new Date(season.endTime)) {
        console.log(`开始结算第 ${season.seasonNumber} 赛季`)

        // 执行赛季结算逻辑
        await performSeasonSettlement(season)

        // 创建新赛季
        const newSeason = {
          seasonNumber: season.seasonNumber + 1,
          startTime: now.toISOString(),
          endTime: new Date(
            now.getTime() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 7天后
          status: 'active'
        }

        // 保存新赛季信息
        await redis.set(seasonKey, JSON.stringify(newSeason))

        // 保存历史赛季数据
        const historyKey = `game:season:history:${season.seasonNumber}`
        await redis.set(historyKey, JSON.stringify(season))

        console.log(
          `第 ${season.seasonNumber} 赛季结算完成，新赛季 ${newSeason.seasonNumber} 已开始`
        )
      } else {
        console.log('当前赛季尚未结束，无需结算')
      }
    } else {
      // 如果没有赛季信息，创建初始赛季
      const initialSeason = {
        seasonNumber: 1,
        startTime: now.toISOString(),
        endTime: new Date(
          now.getTime() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: 'active'
      }
      await redis.set(seasonKey, JSON.stringify(initialSeason))
      console.log('创建初始赛季')
    }

    console.log('赛季结算检查完成')
  } catch (error) {
    console.error('赛季结算失败:', error)
  }
}

// 执行赛季结算
async function performSeasonSettlement(season: any) {
  try {
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
    let rewardedCount = 0

    // 处理每个玩家数据
    for (const key of allKeys) {
      const userId = key.replace(`${__PATH.player_path}:`, '')
      const playerData = await redis.get(key)

      if (playerData) {
        try {
          const player = JSON.parse(decodeURIComponent(playerData))

          // 计算赛季奖励
          const seasonReward = calculateSeasonReward(player, season)

          if (seasonReward > 0) {
            // 发放赛季奖励
            player.灵石 = (player.灵石 || 0) + seasonReward

            // 记录赛季奖励历史
            if (!player.赛季奖励) {
              player.赛季奖励 = []
            }
            player.赛季奖励.push({
              赛季: season.seasonNumber,
              奖励: seasonReward,
              时间: new Date().toISOString()
            })

            // 保存更新后的玩家数据
            await redis.set(key, encodeURIComponent(JSON.stringify(player)))
            rewardedCount++
          }

          processedCount++
        } catch (error) {
          console.error(`处理玩家赛季结算失败 ${userId}:`, error)
        }
      }
    }

    console.log(
      `赛季结算完成，处理了 ${processedCount} 个玩家，发放了 ${rewardedCount} 个奖励`
    )
  } catch (error) {
    console.error('执行赛季结算失败:', error)
  }
}

// 计算赛季奖励
function calculateSeasonReward(player: any, season: any): number {
  // 根据玩家等级、活跃度等计算奖励
  const level = player.level_id || 1
  const baseReward = level * 1000 // 基础奖励

  // 可以根据更多因素调整奖励
  return baseReward
}
