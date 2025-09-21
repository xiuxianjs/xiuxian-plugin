import { ApiResponse } from '@/types/types';
import { authRequest } from '../base';

// 获取宗门列表API（支持分页）
export const getAssociationsAPI = async (
  params: {
    page?: number;
    pageSize?: number;
    search?: string;
  } = {}
): Promise<{
  success: boolean;
  data?: {
    list: any[];
    pagination: {
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
      url: '/associations',
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
    console.error('获取宗门列表API错误:', error);

    return {
      success: false,
      message: '网络错误'
    };
  }
};

// 获取单个宗门详情API
export const getAssociationAPI = async (
  token: string,
  associationName: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const result = (await authRequest({
      url: '/associations',
      method: 'POST',
      data: { associationName }
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
    console.error('获取宗门详情API错误:', error);

    return {
      success: false,
      message: '网络错误'
    };
  }
};

// 获取宗门统计信息API
export const getAssociationsStatsAPI = async (
  params: {
    search?: string;
  } = {}
): Promise<{
  success: boolean;
  data?: {
    total: number;
    totalMembers: number;
    totalPower: number;
    totalLingshi: number;
    xianjieCount: number;
    fanjieCount: number;
  };
  message?: string;
}> => {
  try {
    const result = (await authRequest({
      url: '/associations',
      method: 'PUT',
      params
    })) as ApiResponse<{
      total: number;
      totalMembers: number;
      totalPower: number;
      totalLingshi: number;
      xianjieCount: number;
      fanjieCount: number;
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
    console.error('获取宗门统计信息API错误:', error);

    return {
      success: false,
      message: '网络错误'
    };
  }
};
