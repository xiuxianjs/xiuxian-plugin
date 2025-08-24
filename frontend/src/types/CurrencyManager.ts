// 货币管理相关类型声明

export interface CurrencyUser {
  id: string
  currency: number
  big_month_card_days: number
  small_month_card_days: number
  is_first_recharge: boolean
  first_recharge_time: number
  total_recharge_amount: number
  total_recharge_count: number
  last_recharge_time: number
  created_at: number
  updated_at: number
}

export interface RechargeRecord {
  id: string
  user_id: string
  type: string
  amount: number
  tier: string
  currency_gained: number
  month_card_days: number
  month_card_type: string
  payment_status: string
  payment_method: string
  transaction_id: string
  created_at: number
  paid_at: number
  remark: string
  ip_address: string
  device_info: string
  is_first_recharge: boolean
  first_recharge_bonus: number
}

export interface GlobalStats {
  total_amount: number
  total_count: number
  today_amount: number
  today_count: number
  month_amount: number
  month_count: number
  first_recharge_users: number
  updated_at: number
}

export interface RechargeFormValues {
  userId: string
  type: string
  tier?: string
  amount?: number
  remark?: string
}
