import { ApiResponse } from '@/types/types';
import { authRequest } from '../base';

// 获取数据列表API（支持分页和搜索）
export const getDataListAPI = async (
  token: string,
  dataType: string,
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
      url: '/data-list',
      method: 'GET',
      params: {
        name: dataType,
        page: params.page?.toString(),
        pageSize: params.pageSize?.toString(),
        search: params.search
      }
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
        message: result.message || '获取数据失败'
      };
    }
  } catch (error) {
    console.error('获取数据列表API错误:', error);
    return {
      success: false,
      message: '获取数据失败'
    };
  }
};

// 更新数据列表API
export const updateDataListAPI = async (
  token: string,
  dataType: string,
  data: any[],
  batchMode = false
): Promise<{
  success: boolean;
  data?: {
    updatedCount: number;
    batchMode: boolean;
  };
  message?: string;
}> => {
  try {
    const result = (await authRequest({
      url: '/data-list',
      method: 'PUT',
      data: { name: dataType, data, batchMode }
    })) as ApiResponse<{
      updatedCount: number;
      batchMode: boolean;
    }>;

    if (result.code === 200) {
      return {
        success: true,
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || '更新数据失败'
      };
    }
  } catch (error) {
    console.error('更新数据列表API错误:', error);
    return {
      success: false,
      message: '更新数据失败'
    };
  }
};

// 批量更新数据API（支持分块处理）
export const batchUpdateDataAPI = async (
  token: string,
  dataType: string,
  updates: Array<{ index: number; data: any }>,
  chunkSize = 100
): Promise<{
  success: boolean;
  data?: {
    updatedCount: number;
    totalChunks: number;
    chunkSize: number;
  };
  message?: string;
}> => {
  try {
    const result = (await authRequest({
      url: '/data-list',
      method: 'PATCH',
      data: { name: dataType, updates, chunkSize }
    })) as ApiResponse<{
      updatedCount: number;
      totalChunks: number;
      chunkSize: number;
    }>;

    if (result.code === 200) {
      return {
        success: true,
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || '批量更新失败'
      };
    }
  } catch (error) {
    console.error('批量更新数据API错误:', error);
    return {
      success: false,
      message: '批量更新失败'
    };
  }
};
