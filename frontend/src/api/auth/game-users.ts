import { authRequest } from '../base';
import { ApiResponse } from '@/types/types';
import type { GameUser } from '@/types/types';

// 获取游戏用户列表
export interface GetGameUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface GetGameUsersResponse {
  success: boolean;
  message: string;
  data?: {
    list: GameUser[];
    pagination: {
      current: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export const getGameUsersAPI = async (params: GetGameUsersParams = {}): Promise<GetGameUsersResponse> => {
  try {
    const result = (await authRequest({
      url: '/game-users',
      method: 'GET',
      params
    })) as ApiResponse<{
      list: GameUser[];
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
        message: result.message,
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || '获取游戏用户列表失败'
      };
    }
  } catch (error) {
    console.error('获取游戏用户列表API错误:', error);

    return {
      success: false,
      message: '错误，请重试'
    };
  }
};

// 获取游戏用户详情
export interface GetGameUserResponse {
  success: boolean;
  message: string;
  data?: GameUser;
}

export const getGameUserAPI = async (userId: string): Promise<GetGameUserResponse> => {
  try {
    const result = (await authRequest({
      url: '/game-users',
      method: 'POST',
      data: { userId }
    })) as ApiResponse<GameUser>;

    if (result.code === 200) {
      return {
        success: true,
        message: result.message,
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || '获取游戏用户详情失败'
      };
    }
  } catch (error) {
    console.error('获取游戏用户详情API错误:', error);

    return {
      success: false,
      message: '错误，请重试'
    };
  }
};

// 获取游戏用户统计信息
export interface GetGameUsersStatsResponse {
  success: boolean;
  message: string;
  data?: {
    total: number;
    highLevel: number;
    mediumLevel: number;
    lowLevel: number;
    totalLingshi: number;
    totalShenshi: number;
    totalLunhui: number;
  };
}

export const getGameUsersStatsAPI = async (search?: string): Promise<GetGameUsersStatsResponse> => {
  try {
    const result = (await authRequest({
      url: '/game-users',
      method: 'PUT',
      params: search ? { search } : {}
    })) as ApiResponse<{
      total: number;
      highLevel: number;
      mediumLevel: number;
      lowLevel: number;
      totalLingshi: number;
      totalShenshi: number;
      totalLunhui: number;
    }>;

    if (result.code === 200) {
      return {
        success: true,
        message: result.message,
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || '获取游戏用户统计失败'
      };
    }
  } catch (error) {
    console.error('获取游戏用户统计API错误:', error);

    return {
      success: false,
      message: '错误，请重试'
    };
  }
};

// 更新游戏用户数据
export interface UpdateGameUserResponse {
  success: boolean;
  message: string;
  data?: GameUser;
}

export const updateGameUserAPI = async (userId: string, userData: Partial<GameUser>): Promise<UpdateGameUserResponse> => {
  try {
    const result = (await authRequest({
      url: `/game-users/${userId}`,
      method: 'PUT',
      data: userData
    })) as ApiResponse<GameUser>;

    if (result.code === 200) {
      return {
        success: true,
        message: result.message || '游戏用户更新成功',
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || '游戏用户更新失败'
      };
    }
  } catch (error) {
    console.error('更新游戏用户API错误:', error);

    return {
      success: false,
      message: '错误，请重试'
    };
  }
};
