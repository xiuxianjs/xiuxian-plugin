import { ApiResponse } from '@/types/types';
import { authRequest } from '../base';

// 获取背包列表API（支持分页）
export const getNajieAPI = async (
  token: string,
  params: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
  } = {}
): Promise<{
  success: boolean;
  data?: {
    list: any[];
    corruptedList: any[];
    pagination: {
      current: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
    corruptedPagination: {
      current: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
  message?: string;
}> => {
  try {
    const result = (await authRequest({
      url: '/najie',
      method: 'GET',
      params
    })) as ApiResponse<{
      list: any[];
      pagination: {
        current: number;
        pageSize: number;
        total: number;
        totalPages: number;
      };
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
    console.error('获取背包列表API错误:', error);
    return {
      success: false,
      message: '网络错误'
    };
  }
};

// 获取单个背包详情API
export const getNajieDetailAPI = async (
  token: string,
  userId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const result = (await authRequest({
      url: '/najie',
      method: 'POST',
      data: { userId }
    })) as ApiResponse<any>;

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
    console.error('获取背包详情API错误:', error);
    return {
      success: false,
      message: '网络错误'
    };
  }
};

// 更新背包信息API
export const updateNajieAPI = async (
  token: string,
  najieData: {
    id: string;
    name: string;
    description: string;
  }
): Promise<{ success: boolean; message: string }> => {
  try {
    const result = (await authRequest({
      url: '/najie',
      method: 'PUT',
      data: najieData
    })) as ApiResponse;

    if (result.code === 200) {
      return {
        success: true,
        message: result.message || '纳戒信息更新成功'
      };
    } else {
      return {
        success: false,
        message: result.message || '纳戒信息更新失败'
      };
    }
  } catch (error) {
    console.error('更新纳戒信息API错误:', error);
    return {
      success: false,
      message: '更新纳戒信息失败'
    };
  }
};
