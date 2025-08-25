import { ApiResponse } from '@/types/types';
import { authRequest } from '../base';

// 获取排名数据API
export const getRankingsAPI = async (
  token: string,
  params: {
    type: string;
    limit?: number;
  }
): Promise<{
  success: boolean;
  data?: any[];
  message?: string;
}> => {
  try {
    const result = (await authRequest({
      url: '/rankings',
      method: 'GET',
      params
    })) as ApiResponse<any[]>;

    if (result.code === 200) {
      return {
        success: true,
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message
      };
    }
  } catch (error) {
    console.error('获取排名数据API错误:', error);
    return {
      success: false,
      message: '网络错误'
    };
  }
};

// 获取排名统计信息API
export const getRankingsStatsAPI = async (
  token: string
): Promise<{
  success: boolean;
  data?: {
    lastUpdate: string;
    associationCount: number;
    playerCount: number;
    topAssociations: any[];
    topPlayers: any[];
  };
  message?: string;
}> => {
  try {
    const result = (await authRequest({
      url: '/rankings',
      method: 'POST'
    })) as ApiResponse<{
      lastUpdate: string;
      associationCount: number;
      playerCount: number;
      topAssociations: any[];
      topPlayers: any[];
    }>;

    if (result.code === 200) {
      return {
        success: true,
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message
      };
    }
  } catch (error) {
    console.error('获取排名统计信息API错误:', error);
    return {
      success: false,
      message: '网络错误'
    };
  }
};

// 触发排名计算API
export const triggerRankingCalculationAPI = async (
  token: string
): Promise<{
  success: boolean;
  data?: {
    timestamp: string;
  };
  message?: string;
}> => {
  try {
    const result = (await authRequest({
      url: '/rankings',
      method: 'PUT'
    })) as ApiResponse<{
      timestamp: string;
    }>;

    if (result.code === 200) {
      return {
        success: true,
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message
      };
    }
  } catch (error) {
    console.error('触发排名计算API错误:', error);
    return {
      success: false,
      message: '网络错误'
    };
  }
};
