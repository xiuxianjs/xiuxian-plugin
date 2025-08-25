// 货币管理相关类型声明

export interface CurrencyUser {
  id: string;
  currency: number;
  big_month_card_days: number;
  small_month_card_days: number;
  is_first_recharge: boolean;
  first_recharge_time: number;
  total_recharge_amount: number;
  total_recharge_count: number;
  last_recharge_time: number;
  created_at: number;
  updated_at: number;
}

export interface RechargeRecord {
  id: string;
  user_id: string;
  type: string;
  tier: string;
  currency_gained: number;
  month_card_days: number;
  month_card_type: string;
  payment_status: string;
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

export interface GlobalStats {
  total_amount: number;
  total_count: number;
  today_amount: number;
  today_count: number;
  month_amount: number;
  month_count: number;
  first_recharge_users: number;
  updated_at: number;
}

export interface RechargeFormValues {
  userId: string;
  type: string;
  tier?: string;
  remark?: string;
}

// 配置相关类型
export interface CurrencyConfig {
  RMB_TO_CURRENCY_RATE: number;
  FIRST_RECHARGE_BONUS_RATE: number;
  TRANSACTION_EXPIRE_TIME: number;
  DEFAULT_PAGE_LIMIT: number;
}

export interface RechargeTier {
  key: string;
  amount: number;
  name: string;
  currencyGained: number;
  firstRechargeBonus: number;
}

export interface MonthCardConfig {
  price: number;
  days: number;
  name: string;
  currencyGained: number;
  firstRechargeBonus: number;
}

export interface CurrencyConfigData {
  currencyConfig: CurrencyConfig;
  rechargeTiers: RechargeTier[];
  monthCardConfig: {
    SMALL: MonthCardConfig;
    BIG: MonthCardConfig;
  };
  rechargeTypes: Record<string, string>;
  paymentStatuses: Record<string, string>;
  utils: {
    getAmountByTier: (tier: string) => number | null;
    calculateCurrencyGained: (amount: number) => number;
    calculateFirstRechargeBonus: (amount: number) => number;
  };
}
