import { getIoRedis } from '@alemonjs/db'
import { keys } from './keys'

// 充值档位配置
export const RECHARGE_TIERS = {
  TIER_1: { amount: 6, name: '6元档' },
  TIER_2: { amount: 30, name: '30元档' },
  TIER_3: { amount: 98, name: '98元档' },
  TIER_4: { amount: 128, name: '128元档' },
  TIER_5: { amount: 328, name: '328元档' },
  TIER_6: { amount: 628, name: '628元档' }
} as const

// 月卡配置
export const MONTH_CARD_CONFIG = {
  SMALL: { price: 28, days: 30, name: '小月卡' },
  BIG: { price: 58, days: 30, name: '大月卡' }
} as const

// 充值类型枚举
export enum RechargeType {
  CURRENCY = 'currency', // 金币充值
  SMALL_MONTH_CARD = 'small_month_card', // 小月卡
  BIG_MONTH_CARD = 'big_month_card', // 大月卡
  COMBO = 'combo' // 组合充值
}

// 支付状态枚举
export enum PaymentStatus {
  PENDING = 'pending', // 待支付
  SUCCESS = 'success', // 支付成功
  FAILED = 'failed', // 支付失败
  REFUNDED = 'refunded' // 已退款
}

// 用户货币信息初始化
const initUserCurrencyData = {
  // 用户id
  id: '',
  // 金币余额
  currency: 0,
  // 大月卡剩余天数
  big_month_card_days: 0,
  // 小月卡剩余天数
  small_month_card_days: 0,
  // 是否首次充值
  is_first_recharge: true,
  // 首次充值时间
  first_recharge_time: 0,
  // 总充值金额
  total_recharge_amount: 0,
  // 总充值次数
  total_recharge_count: 0,
  // 最后充值时间
  last_recharge_time: 0,
  // 用户充值记录ID列表
  recharge_record_ids: [],
  // 创建时间
  created_at: 0,
  // 更新时间
  updated_at: 0
}

// 充值记录初始化
const initRechargeRecord = {
  // 记录ID
  id: '',
  // 用户ID
  user_id: '',
  // 充值类型
  type: RechargeType.CURRENCY,
  // 充值金额（元）
  amount: 0,
  // 充值档位
  tier: '',
  // 获得的金币数量
  currency_gained: 0,
  // 月卡天数（如果是月卡充值）
  month_card_days: 0,
  // 月卡类型
  month_card_type: '',
  // 支付状态
  payment_status: PaymentStatus.PENDING,
  // 支付方式
  payment_method: '',
  // 交易号
  transaction_id: '',
  // 充值时间
  created_at: 0,
  // 支付完成时间
  paid_at: 0,
  // 备注
  remark: '',
  // IP地址
  ip_address: '',
  // 设备信息
  device_info: '',
  // 是否首充
  is_first_recharge: false,
  // 首充奖励
  first_recharge_bonus: 0
}

// 全局充值统计
const initGlobalRechargeStats = {
  // 总充值金额
  total_amount: 0,
  // 总充值次数
  total_count: 0,
  // 今日充值金额
  today_amount: 0,
  // 今日充值次数
  today_count: 0,
  // 本月充值金额
  month_amount: 0,
  // 本月充值次数
  month_count: 0,
  // 首充用户数
  first_recharge_users: 0,
  // 最后更新时间
  updated_at: 0
}

/**
 * 获取下一个充值记录ID
 */
export const getNextRechargeRecordId = async (): Promise<string> => {
  try {
    const redis = getIoRedis()
    const currentId = await redis.get(keys.currencyIndex())
    const nextId = currentId ? parseInt(currentId) + 1 : 1
    await redis.set(keys.currencyIndex(), nextId.toString())
    return nextId.toString()
  } catch (error) {
    logger.warn('Error getting next recharge record ID:', error)
    return Date.now().toString()
  }
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
    const userInfo = data ? JSON.parse(data) : initUserCurrencyData

    return {
      ...initUserCurrencyData,
      ...userInfo,
      id: userId
    }
  } catch (error) {
    logger.warn('Error finding user recharge info:', error)
    return {
      ...initUserCurrencyData,
      id: userId
    }
  }
}

/**
 * 创建充值记录
 * @param userId 用户ID
 * @param rechargeData 充值数据
 * @returns 充值记录
 */
export const createRechargeRecord = async (
  userId: string,
  rechargeData: {
    type: RechargeType
    amount: number
    tier?: string
    currency_gained?: number
    month_card_days?: number
    month_card_type?: string
    payment_method?: string
    ip_address?: string
    device_info?: string
    remark?: string
  }
) => {
  try {
    const redis = getIoRedis()
    const recordId = await getNextRechargeRecordId()

    // 检查是否首充
    const userInfo = await findUserRechargeInfo(userId)
    const isFirstRecharge = userInfo.is_first_recharge

    const record = {
      ...initRechargeRecord,
      id: recordId,
      user_id: userId,
      type: rechargeData.type,
      amount: rechargeData.amount,
      tier: rechargeData.tier || '',
      currency_gained: rechargeData.currency_gained || 0,
      month_card_days: rechargeData.month_card_days || 0,
      month_card_type: rechargeData.month_card_type || '',
      payment_method: rechargeData.payment_method || '',
      ip_address: rechargeData.ip_address || '',
      device_info: rechargeData.device_info || '',
      remark: rechargeData.remark || '',
      is_first_recharge: isFirstRecharge,
      first_recharge_bonus: isFirstRecharge
        ? Math.floor(rechargeData.amount * 0.5)
        : 0,
      created_at: Date.now()
    }

    // 保存充值记录
    await redis.set(keys.currencyLog(recordId), JSON.stringify(record))

    // 更新用户充值记录ID列表
    userInfo.recharge_record_ids.push(recordId)
    await redis.set(keys.playerCurrency(userId), JSON.stringify(userInfo))

    return record
  } catch (error) {
    logger.warn('Error creating recharge record:', error)
    throw error
  }
}

/**
 * 完成充值支付
 * @param recordId 充值记录ID
 * @param transactionId 交易号
 * @param paymentMethod 支付方式
 * @returns 更新后的充值记录
 */
export const completeRechargePayment = async (
  recordId: string,
  transactionId: string,
  paymentMethod: string = 'unknown'
) => {
  try {
    const redis = getIoRedis()

    // 获取充值记录
    const recordData = await redis.get(keys.currencyLog(recordId))
    if (!recordData) {
      throw new Error('Recharge record not found')
    }

    const record = JSON.parse(recordData)
    const userId = record.user_id

    // 更新充值记录状态
    record.payment_status = PaymentStatus.SUCCESS
    record.transaction_id = transactionId
    record.payment_method = paymentMethod
    record.paid_at = Date.now()

    await redis.set(keys.currencyLog(recordId), JSON.stringify(record))

    // 更新用户信息
    const userInfo = await findUserRechargeInfo(userId)

    // 如果是首充，更新首充信息
    if (record.is_first_recharge) {
      userInfo.is_first_recharge = false
      userInfo.first_recharge_time = Date.now()
    }

    // 更新充值统计
    userInfo.total_recharge_amount += record.amount
    userInfo.total_recharge_count += 1
    userInfo.last_recharge_time = Date.now()
    userInfo.updated_at = Date.now()

    // 根据充值类型处理
    switch (record.type) {
      case RechargeType.CURRENCY:
        userInfo.currency += record.currency_gained
        if (record.is_first_recharge) {
          userInfo.currency += record.first_recharge_bonus
        }
        break

      case RechargeType.SMALL_MONTH_CARD:
        userInfo.small_month_card_days += record.month_card_days
        break

      case RechargeType.BIG_MONTH_CARD:
        userInfo.big_month_card_days += record.month_card_days
        break

      case RechargeType.COMBO:
        userInfo.currency += record.currency_gained
        if (record.month_card_type === 'small') {
          userInfo.small_month_card_days += record.month_card_days
        } else if (record.month_card_type === 'big') {
          userInfo.big_month_card_days += record.month_card_days
        }
        if (record.is_first_recharge) {
          userInfo.currency += record.first_recharge_bonus
        }
        break
    }

    await redis.set(keys.playerCurrency(userId), JSON.stringify(userInfo))

    // 更新全局统计
    await updateGlobalRechargeStats(record.amount, record.is_first_recharge)

    return record
  } catch (error) {
    logger.warn('Error completing recharge payment:', error)
    throw error
  }
}

/**
 * 充值用户金币
 * @param userId 用户ID
 * @param amount 充值金额（元）
 * @param tier 充值档位
 * @param paymentMethod 支付方式
 * @param ipAddress IP地址
 * @param deviceInfo 设备信息
 * @returns 充值记录
 */
export const rechargeUserCurrency = async (
  userId: string,
  amount: number,
  tier: string,
  paymentMethod: string = 'unknown',
  ipAddress: string = '',
  deviceInfo: string = ''
) => {
  try {
    // 计算获得的金币数量（这里可以根据实际比例调整）
    const currencyGained = Math.floor(amount * 10) // 1元 = 10金币

    // 创建充值记录
    const record = await createRechargeRecord(userId, {
      type: RechargeType.CURRENCY,
      amount,
      tier,
      currency_gained: currencyGained,
      payment_method: paymentMethod,
      ip_address: ipAddress,
      device_info: deviceInfo
    })

    return record
  } catch (error) {
    logger.warn('Error recharging user currency:', error)
    throw error
  }
}

/**
 * 充值小月卡
 * @param userId 用户ID
 * @param paymentMethod 支付方式
 * @param ipAddress IP地址
 * @param deviceInfo 设备信息
 * @returns 充值记录
 */
export const rechargeUserSmallMonthCard = async (
  userId: string,
  paymentMethod: string = 'unknown',
  ipAddress: string = '',
  deviceInfo: string = ''
) => {
  try {
    const { price, days, name } = MONTH_CARD_CONFIG.SMALL

    // 创建充值记录
    const record = await createRechargeRecord(userId, {
      type: RechargeType.SMALL_MONTH_CARD,
      amount: price,
      tier: name,
      month_card_days: days,
      month_card_type: 'small',
      payment_method: paymentMethod,
      ip_address: ipAddress,
      device_info: deviceInfo
    })

    return record
  } catch (error) {
    logger.warn('Error recharging user small month card:', error)
    throw error
  }
}

/**
 * 充值大月卡
 * @param userId 用户ID
 * @param paymentMethod 支付方式
 * @param ipAddress IP地址
 * @param deviceInfo 设备信息
 * @returns 充值记录
 */
export const rechargeUserBigMonthCard = async (
  userId: string,
  paymentMethod: string = 'unknown',
  ipAddress: string = '',
  deviceInfo: string = ''
) => {
  try {
    const { price, days, name } = MONTH_CARD_CONFIG.BIG

    // 创建充值记录
    const record = await createRechargeRecord(userId, {
      type: RechargeType.BIG_MONTH_CARD,
      amount: price,
      tier: name,
      month_card_days: days,
      month_card_type: 'big',
      payment_method: paymentMethod,
      ip_address: ipAddress,
      device_info: deviceInfo
    })

    return record
  } catch (error) {
    logger.warn('Error recharging user big month card:', error)
    throw error
  }
}

/**
 * 获取用户充值记录
 * @param userId 用户ID
 * @param limit 限制数量
 * @param offset 偏移量
 * @returns 充值记录列表
 */
export const getUserRechargeRecords = async (
  userId: string,
  limit: number = 20,
  offset: number = 0
) => {
  try {
    const redis = getIoRedis()
    const userInfo = await findUserRechargeInfo(userId)
    const recordIds = userInfo.recharge_record_ids.slice(offset, offset + limit)

    const records = []
    for (const recordId of recordIds) {
      const recordData = await redis.get(keys.currencyLog(recordId))
      if (recordData) {
        records.push(JSON.parse(recordData))
      }
    }

    return records.sort((a, b) => b.created_at - a.created_at)
  } catch (error) {
    logger.warn('Error getting user recharge records:', error)
    return []
  }
}

/**
 * 获取所有充值记录
 * @param limit 限制数量
 * @param offset 偏移量
 * @param status 支付状态过滤
 * @param type 充值类型过滤
 * @returns 充值记录列表
 */
export const getAllRechargeRecords = async (
  limit: number = 50,
  offset: number = 0,
  status?: PaymentStatus,
  type?: RechargeType
) => {
  try {
    const redis = getIoRedis()
    const pattern = keys.currencyLog('*')
    const keys_list = await redis.keys(pattern)

    const records = []
    for (const key of keys_list.slice(offset, offset + limit)) {
      const recordData = await redis.get(key)
      if (recordData) {
        const record = JSON.parse(recordData)
        if (
          (!status || record.payment_status === status) &&
          (!type || record.type === type)
        ) {
          records.push(record)
        }
      }
    }

    return records.sort((a, b) => b.created_at - a.created_at)
  } catch (error) {
    logger.warn('Error getting all recharge records:', error)
    return []
  }
}

/**
 * 获取充值记录详情
 * @param recordId 充值记录ID
 * @returns 充值记录详情
 */
export const getRechargeRecordDetail = async (recordId: string) => {
  try {
    const redis = getIoRedis()
    const recordData = await redis.get(keys.currencyLog(recordId))
    return recordData ? JSON.parse(recordData) : null
  } catch (error) {
    logger.warn('Error getting recharge record detail:', error)
    return null
  }
}

/**
 * 更新全局充值统计
 * @param amount 充值金额
 * @param isFirstRecharge 是否首充
 */
const updateGlobalRechargeStats = async (
  amount: number,
  isFirstRecharge: boolean
) => {
  try {
    const redis = getIoRedis()
    const statsKey = 'data:alemonjs-xiuxian:global_recharge_stats'

    let stats = initGlobalRechargeStats
    const statsData = await redis.get(statsKey)
    if (statsData) {
      stats = JSON.parse(statsData)
    }

    const now = Date.now()

    // 更新统计
    stats.total_amount += amount
    stats.total_count += 1
    stats.updated_at = now

    if (isFirstRecharge) {
      stats.first_recharge_users += 1
    }

    await redis.set(statsKey, JSON.stringify(stats))
  } catch (error) {
    logger.warn('Error updating global recharge stats:', error)
  }
}

/**
 * 获取全局充值统计
 * @returns 全局充值统计
 */
export const getGlobalRechargeStats = async () => {
  try {
    const redis = getIoRedis()
    const statsKey = 'data:alemonjs-xiuxian:global_recharge_stats'
    const statsData = await redis.get(statsKey)
    return statsData ? JSON.parse(statsData) : initGlobalRechargeStats
  } catch (error) {
    logger.warn('Error getting global recharge stats:', error)
    return initGlobalRechargeStats
  }
}

/**
 * 检查用户月卡状态
 * @param userId 用户ID
 * @returns 月卡状态信息
 */
export const checkUserMonthCardStatus = async (userId: string) => {
  try {
    const userInfo = await findUserRechargeInfo(userId)
    return {
      userId,
      small_month_card_days: userInfo.small_month_card_days,
      big_month_card_days: userInfo.big_month_card_days,
      has_small_month_card: userInfo.small_month_card_days > 0,
      has_big_month_card: userInfo.big_month_card_days > 0,
      is_first_recharge: userInfo.is_first_recharge,
      total_recharge_amount: userInfo.total_recharge_amount,
      total_recharge_count: userInfo.total_recharge_count
    }
  } catch (error) {
    logger.warn('Error checking user month card status:', error)
    return null
  }
}

/**
 * 消费月卡天数
 * @param userId 用户ID
 * @param cardType 月卡类型 ('small' | 'big')
 * @param days 消费天数
 * @returns 是否成功
 */
export const consumeMonthCardDays = async (
  userId: string,
  cardType: 'small' | 'big',
  days: number = 1
) => {
  try {
    const redis = getIoRedis()
    const userInfo = await findUserRechargeInfo(userId)

    if (cardType === 'small') {
      if (userInfo.small_month_card_days < days) {
        return false
      }
      userInfo.small_month_card_days -= days
    } else if (cardType === 'big') {
      if (userInfo.big_month_card_days < days) {
        return false
      }
      userInfo.big_month_card_days -= days
    }

    userInfo.updated_at = Date.now()
    await redis.set(keys.playerCurrency(userId), JSON.stringify(userInfo))
    return true
  } catch (error) {
    logger.warn('Error consuming month card days:', error)
    return false
  }
}

/**
 * 消费用户金币
 * @param userId 用户ID
 * @param amount 消费金额
 * @returns 是否成功
 */
export const consumeUserCurrency = async (userId: string, amount: number) => {
  try {
    const redis = getIoRedis()
    const userInfo = await findUserRechargeInfo(userId)

    if (userInfo.currency < amount) {
      return false
    }

    userInfo.currency -= amount
    userInfo.updated_at = Date.now()
    await redis.set(keys.playerCurrency(userId), JSON.stringify(userInfo))
    return true
  } catch (error) {
    logger.warn('Error consuming user currency:', error)
    return false
  }
}

/**
 * 获取所有用户的货币信息
 * @returns 用户货币信息列表
 */
export const getAllUsersCurrencyInfo = async () => {
  try {
    const redis = getIoRedis()
    // 获取所有玩家货币数据的key
    const keys = await redis.keys('data:alemonjs-xiuxian:player_currency:*')
    const users: any[] = []

    for (const key of keys) {
      const userId = key.replace('data:alemonjs-xiuxian:player_currency:', '')
      const userInfo = await findUserRechargeInfo(userId)

      // 只返回有充值记录的用户
      if (
        userInfo.total_recharge_count > 0 ||
        userInfo.currency > 0 ||
        userInfo.small_month_card_days > 0 ||
        userInfo.big_month_card_days > 0
      ) {
        users.push(userInfo)
      }
    }

    // 按最后充值时间排序
    users.sort((a, b) => b.last_recharge_time - a.last_recharge_time)

    return users
  } catch (error) {
    logger.warn('Error getting all users currency info:', error)
    return []
  }
}
