/**
 * 货币相关内容，
 * 包括首充、金币、大小月卡,
 */
import { getIoRedis } from '@alemonjs/db'
import { keys } from './keys'

// 查看个人充值信息
const initData = {
  // 用户id
  id: '',
  // 货币值
  currency: 0,
  // 大月卡天数
  big_month_card_days: 0,
  // 小月卡天数
  small_month_card_days: 0,
  // 用户充值记录索引。对应充值记录的索引。
  // 查index长度可知是否是首充。如果首充可重制，需新增字段
  currency_index: []
}

// 充值记录初始化
const initRechargeRecord = {
  // 用户id
  id: '',
  user_id: '',
  // 充值类型
  type: '',
  // 充值金额 / 天数
  value: 0,
  // 充值时间
  created_at: 0
}

// 得到当前充值记录的索引
export const getCurrentRechargeRecordIndex = async (): Promise<number> => {
  try {
    const redis = getIoRedis()
    const data = await redis.get(keys.currencyIndex())
    return data ? JSON.parse(data).length : 1
  } catch (error) {
    logger.warn('Error getting current recharge record index:', error)
    return -1
  }
}

// 索引 + 1，并返回+1后的索引
const getNextRechargeRecordIndex = async (): Promise<number> => {
  const redis = getIoRedis()
  const currentIndex = await getCurrentRechargeRecordIndex()
  await redis.set(keys.currencyIndex(), currentIndex + 1)
  return currentIndex + 1
}

/**
 * 查找用户充值信息
 * @param userId 用户ID
 * @returns 用户充值信息
 */
export const findUserRechargeInfo = async (userId: string) => {
  try {
    const redis = getIoRedis()
    const data = await redis.get(keys.playerCurrency(userId))
    const rechargeInfo = data ? JSON.parse(data) : initData
    return {
      ...initData,
      ...rechargeInfo,
      id: userId
    }
  } catch (error) {
    logger.warn('Error finding user recharge info:', error)
    return {
      ...initData,
      id: userId
    }
  }
}

/**
 * 充值用户金币
 * @param userId 用户ID
 * @param amount 充值金额
 * @returns 充值后的用户信息
 */
export const rechargeUserCurrency = async (userId: string, amount: number) => {
  try {
    const redis = getIoRedis()
    const data = await redis.get(keys.playerCurrency(userId))
    const userInfo = data ? JSON.parse(data) : initData
    userInfo.currency += amount
    await redis.set(keys.playerCurrency(userId), JSON.stringify(userInfo))
    return {
      ...initData,
      ...userInfo,
      id: userId
    }
  } catch (error) {
    logger.warn('Error recharging user currency:', error)
    return {
      ...initData,
      id: userId
    }
  }
}

// 充值小月卡
export const rechargeUserSmallMonthCard = async (
  userId: string,
  // 默认30天
  days: number = 30
) => {
  try {
    const redis = getIoRedis()
    const data = await redis.get(keys.playerCurrency(userId))
    const userInfo = data ? JSON.parse(data) : initData
    userInfo.small_month_card_days += days
    const index = await getNextRechargeRecordIndex()
    if (index < 1) {
      // 索引获取失败
      return
    }
    // 新增充值记录
    await redis.set(
      keys.currencyLog(String(index)),
      JSON.stringify({
        ...initRechargeRecord,
        id: String(index),
        user_id: userId,
        type: 'small_month_card',
        value: days,
        created_at: Date.now()
      })
    )
    const cur = {
      ...initData,
      ...userInfo,
      id: userId
    }
    // 更新用户信息
    await redis.set(keys.playerCurrency(userId), JSON.stringify(userInfo))
    return cur
  } catch (error) {
    logger.warn('Error recharging user small month card:', error)
    return {
      ...initData,
      id: userId
    }
  }
}

/**
 * 充值大月卡
 * @param userId 用户ID
 * @param days 大月卡天数
 * @returns 充值后的用户信息
 */
export const rechargeUserBigMonthCard = async (
  userId: string,
  days: number = 30
) => {
  try {
    const redis = getIoRedis()
    const data = await redis.get(keys.playerCurrency(userId))
    const userInfo = data ? JSON.parse(data) : initData
    userInfo.big_month_card_days += days

    // 新增充值记录

    await redis.set(keys.playerCurrency(userId), JSON.stringify(userInfo))
    return {
      ...initData,
      ...userInfo,
      id: userId
    }
  } catch (error) {
    logger.warn('Error recharging user big month card:', error)
    return {
      ...initData,
      id: userId
    }
  }
}
