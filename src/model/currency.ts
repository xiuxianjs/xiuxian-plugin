import { getIoRedis } from '@alemonjs/db';

// 货币转换配置
export const CURRENCY_CONFIG = {
  // 人民币转金币倍率
  RMB_TO_CURRENCY_RATE: 10,
  // 首充奖励倍率
  FIRST_RECHARGE_BONUS_RATE: 0.5,
  // 交易记录过期时间（秒）
  TRANSACTION_EXPIRE_TIME: 86400,
  // 分页默认限制
  DEFAULT_PAGE_LIMIT: 100
} as const;

// 充值档位配置
export const RECHARGE_TIERS = {
  TIER_1: { amount: 6, name: '6元档' },
  TIER_2: { amount: 30, name: '30元档' },
  TIER_3: { amount: 98, name: '98元档' },
  TIER_4: { amount: 128, name: '128元档' },
  TIER_5: { amount: 328, name: '328元档' },
  TIER_6: { amount: 628, name: '628元档' }
} as const;

// 月卡配置
export const MONTH_CARD_CONFIG = {
  SMALL: { price: 28, days: 30, name: '小月卡' },
  BIG: { price: 58, days: 30, name: '大月卡' }
} as const;

// Redis Key 管理
export const REDIS_KEYS = {
  // 用户货币数据
  PLAYER_CURRENCY: (userId: string) => `data:alemonjs-xiuxian:player_currency:${userId}`,
  // 充值记录
  CURRENCY_LOG: (recordId: string) => `data:alemonjs-xiuxian:currency_log:${recordId}`,
  // 充值记录索引
  CURRENCY_INDEX: () => 'data:alemonjs-xiuxian:currency_index',
  // 交易号记录
  TRANSACTION: (transactionId: string) => `data:alemonjs-xiuxian:transaction:${transactionId}`,
  // 全局充值统计
  GLOBAL_STATS: () => 'data:alemonjs-xiuxian:global_recharge_stats',
  // 用户货币数据模式匹配
  PLAYER_CURRENCY_PATTERN: () => 'data:alemonjs-xiuxian:player_currency:*'
} as const;

// ==================== 类型定义 ====================

// 用户货币信息类型定义
export interface UserCurrencyData {
  id: string;
  currency: number;
  big_month_card_days: number;
  small_month_card_days: number;
  is_first_recharge: boolean;
  first_recharge_time: number;
  total_recharge_amount: number;
  total_recharge_count: number;
  last_recharge_time: number;
  recharge_record_ids: string[];
  created_at: number;
  updated_at: number;
}

// 充值记录类型定义（移除重复的amount字段，使用tier来获取金额）
export interface RechargeRecord {
  id: string;
  user_id: string;
  type: RechargeType;
  tier: string; // 使用档位名称，通过配置获取金额
  currency_gained: number;
  month_card_days: number;
  month_card_type: string;
  payment_status: PaymentStatus;
  payment_method: string;
  transaction_id: string;
  created_at: number;
  paid_at: number;
  remark: string;
  ip_address: string;
  device_info: string;
  is_first_recharge: boolean;
  first_recharge_bonus: number;
}

// 全局充值统计类型定义
export interface GlobalRechargeStats {
  total_amount: number;
  total_count: number;
  today_amount: number;
  today_count: number;
  month_amount: number;
  month_count: number;
  first_recharge_users: number;
  updated_at: number;
}

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

// ==================== 工具函数 ====================

/**
 * 根据档位名称获取充值金额
 */
export const getAmountByTier = (tier: string): number => {
  // 检查是否是月卡
  if (tier === MONTH_CARD_CONFIG.SMALL.name) {
    return MONTH_CARD_CONFIG.SMALL.price;
  }
  if (tier === MONTH_CARD_CONFIG.BIG.name) {
    return MONTH_CARD_CONFIG.BIG.price;
  }

  // 检查充值档位
  for (const tierConfig of Object.values(RECHARGE_TIERS)) {
    if (tierConfig.name === tier) {
      return tierConfig.amount;
    }
  }

  throw new Error(`Unknown tier: ${tier}`);
};

/**
 * 根据金额计算获得的金币数量
 */
export const calculateCurrencyGained = (amount: number): number => {
  return Math.floor(amount * CURRENCY_CONFIG.RMB_TO_CURRENCY_RATE);
};

/**
 * 计算首充奖励
 */
export const calculateFirstRechargeBonus = (amount: number): number => {
  return Math.floor(amount * CURRENCY_CONFIG.FIRST_RECHARGE_BONUS_RATE);
};

// ==================== 初始化数据 ====================

// 用户货币信息初始化
const initUserCurrencyData: UserCurrencyData = {
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
};

// 充值记录初始化
const initRechargeRecord: RechargeRecord = {
  // 记录ID
  id: '',
  // 用户ID
  user_id: '',
  // 充值类型
  type: RechargeType.CURRENCY,
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
};

// 全局充值统计
const initGlobalRechargeStats: GlobalRechargeStats = {
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
};

/**
 * 获取下一个充值记录ID（使用原子操作避免并发问题）
 */
export const getNextRechargeRecordId = async(): Promise<string> => {
  try {
    const redis = getIoRedis();
    // 使用原子操作递增ID
    const nextId = await redis.incr(REDIS_KEYS.CURRENCY_INDEX());

    return nextId.toString();
  } catch (error) {
    logger.warn('Error getting next recharge record ID:', error);

    // 降级方案：使用时间戳+随机数
    return `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
};

/**
 * 查找用户充值信息
 * @param userId 用户ID
 * @returns 用户充值信息
 */
export const findUserRechargeInfo = async(userId: string): Promise<UserCurrencyData> => {
  // 输入验证
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID');
  }

  try {
    const redis = getIoRedis();
    const data = await redis.get(REDIS_KEYS.PLAYER_CURRENCY(userId));
    const userInfo = data ? JSON.parse(data) : initUserCurrencyData;

    return {
      ...initUserCurrencyData,
      ...userInfo,
      id: userId
    };
  } catch (error) {
    logger.warn('Error finding user recharge info:', error);

    return {
      ...initUserCurrencyData,
      id: userId
    };
  }
};

/**
 * 创建充值记录
 * @param userId 用户ID
 * @param rechargeData 充值数据
 * @returns 充值记录
 */
export const createRechargeRecord = async(
  userId: string,
  rechargeData: {
    type: RechargeType;
    tier: string;
    currency_gained?: number;
    month_card_days?: number;
    month_card_type?: string;
    payment_method?: string;
    ip_address?: string;
    device_info?: string;
    remark?: string;
  }
): Promise<RechargeRecord> => {
  // 输入验证
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID');
  }
  if (!rechargeData.tier || typeof rechargeData.tier !== 'string') {
    throw new Error('Invalid tier');
  }
  if (!Object.values(RechargeType).includes(rechargeData.type)) {
    throw new Error('Invalid recharge type');
  }

  try {
    const redis = getIoRedis();
    const recordId = await getNextRechargeRecordId();

    // 检查是否首充
    const userInfo = await findUserRechargeInfo(userId);
    const isFirstRecharge = userInfo.is_first_recharge;

    // 根据档位获取金额
    const amount = getAmountByTier(rechargeData.tier);

    const record: RechargeRecord = {
      ...initRechargeRecord,
      id: recordId,
      user_id: userId,
      type: rechargeData.type,
      tier: rechargeData.tier,
      currency_gained: rechargeData.currency_gained || 0,
      month_card_days: rechargeData.month_card_days || 0,
      month_card_type: rechargeData.month_card_type || '',
      payment_method: rechargeData.payment_method || '',
      ip_address: rechargeData.ip_address || '',
      device_info: rechargeData.device_info || '',
      remark: rechargeData.remark || '',
      is_first_recharge: isFirstRecharge,
      first_recharge_bonus: isFirstRecharge ? calculateFirstRechargeBonus(amount) : 0,
      created_at: Date.now()
    };

    // 保存充值记录
    await redis.set(REDIS_KEYS.CURRENCY_LOG(recordId), JSON.stringify(record));

    // 更新用户充值记录ID列表
    userInfo.recharge_record_ids.push(recordId);
    await redis.set(REDIS_KEYS.PLAYER_CURRENCY(userId), JSON.stringify(userInfo));

    return record;
  } catch (error) {
    logger.warn('Error creating recharge record:', error);
    throw error;
  }
};

/**
 * 完成充值支付
 * @param recordId 充值记录ID
 * @param transactionId 交易号
 * @param paymentMethod 支付方式
 * @returns 更新后的充值记录
 */
export const completeRechargePayment = async(
  recordId: string,
  transactionId: string,
  paymentMethod = 'unknown'
): Promise<RechargeRecord> => {
  // 输入验证
  if (!recordId || typeof recordId !== 'string') {
    throw new Error('Invalid record ID');
  }
  if (!transactionId || typeof transactionId !== 'string') {
    throw new Error('Invalid transaction ID');
  }

  try {
    const redis = getIoRedis();

    // 获取充值记录
    const recordData = await redis.get(REDIS_KEYS.CURRENCY_LOG(recordId));

    if (!recordData) {
      throw new Error('Recharge record not found');
    }

    const record: RechargeRecord = JSON.parse(recordData);
    const userId = record.user_id;

    // 检查是否已经支付成功
    if (record.payment_status === PaymentStatus.SUCCESS) {
      logger.warn('Recharge record already completed:', recordId);

      return record;
    }

    // 更新充值记录状态
    record.payment_status = PaymentStatus.SUCCESS;
    record.transaction_id = transactionId;
    record.payment_method = paymentMethod;
    record.paid_at = Date.now();

    await redis.set(REDIS_KEYS.CURRENCY_LOG(recordId), JSON.stringify(record));

    // 更新用户信息
    const userInfo = await findUserRechargeInfo(userId);

    // 如果是首充，更新首充信息
    if (record.is_first_recharge) {
      userInfo.is_first_recharge = false;
      userInfo.first_recharge_time = Date.now();
    }

    // 根据档位获取金额
    const amount = getAmountByTier(record.tier);

    // 更新充值统计
    userInfo.total_recharge_amount += amount;
    userInfo.total_recharge_count += 1;
    userInfo.last_recharge_time = Date.now();
    userInfo.updated_at = Date.now();

    // 根据充值类型处理
    switch (record.type) {
    case RechargeType.CURRENCY:
      userInfo.currency += record.currency_gained;
      if (record.is_first_recharge) {
        userInfo.currency += record.first_recharge_bonus;
      }
      break;

    case RechargeType.SMALL_MONTH_CARD:
      userInfo.small_month_card_days += record.month_card_days;
      break;

    case RechargeType.BIG_MONTH_CARD:
      userInfo.big_month_card_days += record.month_card_days;
      break;

    case RechargeType.COMBO:
      userInfo.currency += record.currency_gained;
      if (record.month_card_type === 'small') {
        userInfo.small_month_card_days += record.month_card_days;
      } else if (record.month_card_type === 'big') {
        userInfo.big_month_card_days += record.month_card_days;
      }
      if (record.is_first_recharge) {
        userInfo.currency += record.first_recharge_bonus;
      }
      break;
    }

    await redis.set(REDIS_KEYS.PLAYER_CURRENCY(userId), JSON.stringify(userInfo));

    // 更新全局统计
    await updateGlobalRechargeStats(amount, record.is_first_recharge);

    return record;
  } catch (error) {
    logger.warn('Error completing recharge payment:', error);
    throw error;
  }
};

/**
 * 充值用户金币
 * @param userId 用户ID
 * @param tier 充值档位
 * @param paymentMethod 支付方式
 * @param ipAddress IP地址
 * @param deviceInfo 设备信息
 * @returns 充值记录
 */
export const rechargeUserCurrency = async(
  userId: string,
  tier: string,
  paymentMethod = 'unknown',
  ipAddress = '',
  deviceInfo = ''
) => {
  try {
    // 根据档位获取金额
    const amount = getAmountByTier(tier);
    // 计算获得的金币数量
    const currencyGained = calculateCurrencyGained(amount);

    // 创建充值记录
    const record = await createRechargeRecord(userId, {
      type: RechargeType.CURRENCY,
      tier,
      currency_gained: currencyGained,
      payment_method: paymentMethod,
      ip_address: ipAddress,
      device_info: deviceInfo
    });

    return record;
  } catch (error) {
    logger.warn('Error recharging user currency:', error);
    throw error;
  }
};

/**
 * 充值小月卡
 * @param userId 用户ID
 * @param paymentMethod 支付方式
 * @param ipAddress IP地址
 * @param deviceInfo 设备信息
 * @returns 充值记录
 */
export const rechargeUserSmallMonthCard = async(
  userId: string,
  paymentMethod = 'unknown',
  ipAddress = '',
  deviceInfo = ''
) => {
  try {
    const { days, name } = MONTH_CARD_CONFIG.SMALL;

    // 创建充值记录
    const record = await createRechargeRecord(userId, {
      type: RechargeType.SMALL_MONTH_CARD,
      tier: name,
      month_card_days: days,
      month_card_type: 'small',
      payment_method: paymentMethod,
      ip_address: ipAddress,
      device_info: deviceInfo
    });

    return record;
  } catch (error) {
    logger.warn('Error recharging user small month card:', error);
    throw error;
  }
};

/**
 * 充值大月卡
 * @param userId 用户ID
 * @param paymentMethod 支付方式
 * @param ipAddress IP地址
 * @param deviceInfo 设备信息
 * @returns 充值记录
 */
export const rechargeUserBigMonthCard = async(
  userId: string,
  paymentMethod = 'unknown',
  ipAddress = '',
  deviceInfo = ''
) => {
  try {
    const { days, name } = MONTH_CARD_CONFIG.BIG;

    // 创建充值记录
    const record = await createRechargeRecord(userId, {
      type: RechargeType.BIG_MONTH_CARD,
      tier: name,
      month_card_days: days,
      month_card_type: 'big',
      payment_method: paymentMethod,
      ip_address: ipAddress,
      device_info: deviceInfo
    });

    return record;
  } catch (error) {
    logger.warn('Error recharging user big month card:', error);
    throw error;
  }
};

/**
 * 获取用户充值记录
 * @param userId 用户ID
 * @param limit 限制数量
 * @param offset 偏移量
 * @returns 充值记录列表
 */
export const getUserRechargeRecords = async(
  userId: string,
  limit = 20,
  offset = 0
) => {
  try {
    const redis = getIoRedis();
    const userInfo = await findUserRechargeInfo(userId);
    const recordIds = userInfo.recharge_record_ids.slice(offset, offset + limit);

    const records = [];

    for (const recordId of recordIds) {
      const recordData = await redis.get(REDIS_KEYS.CURRENCY_LOG(recordId));

      if (recordData) {
        records.push(JSON.parse(recordData));
      }
    }

    return records.sort((a, b) => b.created_at - a.created_at);
  } catch (error) {
    logger.warn('Error getting user recharge records:', error);

    return [];
  }
};

/**
 * 获取所有充值记录
 * @param limit 限制数量
 * @param offset 偏移量
 * @param status 支付状态过滤
 * @param type 充值类型过滤
 * @returns 充值记录列表
 */
export const getAllRechargeRecords = async(
  limit = 50,
  offset = 0,
  status?: PaymentStatus,
  type?: RechargeType
) => {
  try {
    const redis = getIoRedis();
    const pattern = REDIS_KEYS.CURRENCY_LOG('*');
    const keys_list = await redis.keys(pattern);

    const records = [];

    for (const key of keys_list.slice(offset, offset + limit)) {
      const recordData = await redis.get(key);

      if (recordData) {
        const record = JSON.parse(recordData);

        if ((!status || record.payment_status === status) && (!type || record.type === type)) {
          records.push(record);
        }
      }
    }

    return records.sort((a, b) => b.created_at - a.created_at);
  } catch (error) {
    logger.warn('Error getting all recharge records:', error);

    return [];
  }
};

/**
 * 获取充值记录详情
 * @param recordId 充值记录ID
 * @returns 充值记录详情
 */
export const getRechargeRecordDetail = async(recordId: string) => {
  try {
    const redis = getIoRedis();
    const recordData = await redis.get(REDIS_KEYS.CURRENCY_LOG(recordId));

    return recordData ? JSON.parse(recordData) : null;
  } catch (error) {
    logger.warn('Error getting recharge record detail:', error);

    return null;
  }
};

/**
 * 更新全局充值统计
 * @param amount 充值金额
 * @param isFirstRecharge 是否首充
 */
const updateGlobalRechargeStats = async(amount: number, isFirstRecharge: boolean) => {
  try {
    const redis = getIoRedis();
    const statsKey = REDIS_KEYS.GLOBAL_STATS();

    let stats = initGlobalRechargeStats;
    const statsData = await redis.get(statsKey);

    if (statsData) {
      stats = JSON.parse(statsData);
    }

    const now = Date.now();

    // 更新统计
    stats.total_amount += amount;
    stats.total_count += 1;
    stats.updated_at = now;

    if (isFirstRecharge) {
      stats.first_recharge_users += 1;
    }

    await redis.set(statsKey, JSON.stringify(stats));
  } catch (error) {
    logger.warn('Error updating global recharge stats:', error);
  }
};

/**
 * 检查交易号是否已存在（防止重复支付）
 * @param transactionId 交易号
 * @returns 是否已存在
 */
export const isTransactionIdExists = async(transactionId: string): Promise<boolean> => {
  try {
    const redis = getIoRedis();
    const transactionKey = REDIS_KEYS.TRANSACTION(transactionId);
    const exists = await redis.exists(transactionKey);

    if (exists === 0) {
      // 设置交易号记录，过期时间24小时
      await redis.setex(transactionKey, CURRENCY_CONFIG.TRANSACTION_EXPIRE_TIME, '1');
    }

    return exists === 1;
  } catch (error) {
    logger.warn('Error checking transaction ID:', error);

    return false;
  }
};

/**
 * 获取全局充值统计
 * @returns 全局充值统计
 */
export const getGlobalRechargeStats = async() => {
  try {
    const redis = getIoRedis();
    const statsKey = REDIS_KEYS.GLOBAL_STATS();
    const statsData = await redis.get(statsKey);

    return statsData ? JSON.parse(statsData) : initGlobalRechargeStats;
  } catch (error) {
    logger.warn('Error getting global recharge stats:', error);

    return initGlobalRechargeStats;
  }
};

/**
 * 检查用户月卡状态
 * @param userId 用户ID
 * @returns 月卡状态信息
 */
export const checkUserMonthCardStatus = async(userId: string) => {
  try {
    const userInfo = await findUserRechargeInfo(userId);

    return {
      userId,
      small_month_card_days: userInfo.small_month_card_days,
      big_month_card_days: userInfo.big_month_card_days,
      has_small_month_card: userInfo.small_month_card_days > 0,
      has_big_month_card: userInfo.big_month_card_days > 0,
      is_first_recharge: userInfo.is_first_recharge,
      total_recharge_amount: userInfo.total_recharge_amount,
      total_recharge_count: userInfo.total_recharge_count
    };
  } catch (error) {
    logger.warn('Error checking user month card status:', error);

    return null;
  }
};

/**
 * 消费月卡天数
 * @param userId 用户ID
 * @param cardType 月卡类型 ('small' | 'big')
 * @param days 消费天数
 * @returns 是否成功
 */
export const consumeMonthCardDays = async(
  userId: string,
  cardType: 'small' | 'big',
  days = 1
): Promise<boolean> => {
  // 输入验证
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID');
  }
  if (!['small', 'big'].includes(cardType)) {
    throw new Error('Invalid card type');
  }
  if (!days || days <= 0) {
    throw new Error('Invalid days amount');
  }

  try {
    const redis = getIoRedis();
    const userInfo = await findUserRechargeInfo(userId);

    if (cardType === 'small') {
      if (userInfo.small_month_card_days < days) {
        return false;
      }
      userInfo.small_month_card_days -= days;
    } else if (cardType === 'big') {
      if (userInfo.big_month_card_days < days) {
        return false;
      }
      userInfo.big_month_card_days -= days;
    }

    userInfo.updated_at = Date.now();
    await redis.set(REDIS_KEYS.PLAYER_CURRENCY(userId), JSON.stringify(userInfo));

    return true;
  } catch (error) {
    logger.warn('Error consuming month card days:', error);

    return false;
  }
};

/**
 * 消费用户金币
 * @param userId 用户ID
 * @param amount 消费金额
 * @returns 是否成功
 */
export const consumeUserCurrency = async(userId: string, amount: number): Promise<boolean> => {
  // 输入验证
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID');
  }
  if (!amount || amount <= 0) {
    throw new Error('Invalid consumption amount');
  }

  try {
    const redis = getIoRedis();
    const userInfo = await findUserRechargeInfo(userId);

    if (userInfo.currency < amount) {
      return false;
    }

    userInfo.currency -= amount;
    userInfo.updated_at = Date.now();
    await redis.set(REDIS_KEYS.PLAYER_CURRENCY(userId), JSON.stringify(userInfo));

    return true;
  } catch (error) {
    logger.warn('Error consuming user currency:', error);

    return false;
  }
};

/**
 * 获取所有用户的货币信息
 * @param limit 限制数量，默认100
 * @param offset 偏移量，默认0
 * @returns 用户货币信息列表
 */
export const getAllUsersCurrencyInfo = async(
  limit = 100,
  offset = 0
): Promise<UserCurrencyData[]> => {
  try {
    const redis = getIoRedis();
    // 获取所有玩家货币数据的key（限制数量避免性能问题）
    const allKeys = await redis.keys(REDIS_KEYS.PLAYER_CURRENCY_PATTERN());
    const userKeys = allKeys.slice(offset, offset + limit);

    const users: UserCurrencyData[] = [];

    for (const key of userKeys) {
      const userId = key.replace('data:alemonjs-xiuxian:player_currency:', '');
      const userInfo = await findUserRechargeInfo(userId);

      // 只返回有充值记录的用户
      if (
        userInfo.total_recharge_count > 0
        || userInfo.currency > 0
        || userInfo.small_month_card_days > 0
        || userInfo.big_month_card_days > 0
      ) {
        users.push(userInfo);
      }
    }

    // 按最后充值时间排序
    users.sort((a, b) => b.last_recharge_time - a.last_recharge_time);

    return users;
  } catch (error) {
    logger.warn('Error getting all users currency info:', error);

    return [];
  }
};
