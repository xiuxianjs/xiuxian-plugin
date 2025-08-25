import type { CurrencyUser, RechargeRecord, GlobalStats } from '@/types/CurrencyManager';
import { authRequest } from '../base';

// 获取配置信息
export const fetchConfigAPI = async (): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const result = await authRequest({
      url: '/currency/config',
      method: 'GET'
    });
    if (result.code === 200) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || '获取配置信息失败' };
  } catch (_e) {
    return { success: false, message: '获取配置信息失败' };
  }
};

// 获取用户货币信息
export const fetchUsersAPI = async (): Promise<{
  success: boolean;
  data?: CurrencyUser[];
  message?: string;
}> => {
  try {
    const result = await authRequest({
      url: '/currency/users',
      method: 'GET'
    });
    if (result.code === 200) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || '获取用户数据失败' };
  } catch (_e) {
    return { success: false, message: '获取用户数据失败' };
  }
};

// 获取充值记录
export const fetchRecordsAPI = async (): Promise<{
  success: boolean;
  data?: RechargeRecord[];
  message?: string;
}> => {
  try {
    const result = await authRequest({
      url: '/currency/records',
      method: 'GET'
    });
    if (result.code === 200) {
      return { success: true, data: result.data.records };
    }
    return { success: false, message: result.message || '获取充值记录失败' };
  } catch (_e) {
    return { success: false, message: '获取充值记录失败' };
  }
};

// 获取全局统计
export const fetchStatsAPI = async (): Promise<{
  success: boolean;
  data?: GlobalStats;
  message?: string;
}> => {
  try {
    const result = await authRequest({
      url: '/currency/stats',
      method: 'GET'
    });
    if (result.code === 200) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || '获取统计数据失败' };
  } catch (_e) {
    return { success: false, message: '获取统计数据失败' };
  }
};

// 创建充值记录
export const createRechargeRecordAPI = async (params: {
  action: string;
  userId: string;
  tier?: string;
  paymentMethod?: string;
  remark?: string;
}): Promise<{ success: boolean; data?: { id: string }; message?: string }> => {
  try {
    const result = await authRequest({
      url: '/currency/recharge',
      method: 'POST',
      data: params
    });
    if (result.code === 201) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || '创建充值记录失败' };
  } catch (_e) {
    return { success: false, message: '创建充值记录失败' };
  }
};

// 完成支付
export const completePaymentAPI = async (params: {
  recordId: string;
  transactionId: string;
  paymentMethod?: string;
}): Promise<{ success: boolean; message?: string }> => {
  try {
    const result = await authRequest({
      url: '/currency/recharge',
      method: 'POST',
      data: {
        action: 'complete-payment',
        ...params
      }
    });
    if (result.code === 200) {
      return { success: true };
    }
    return { success: false, message: result.message || '支付完成失败' };
  } catch (_e) {
    return { success: false, message: '支付完成失败' };
  }
};
