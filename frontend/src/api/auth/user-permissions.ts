import { authRequest } from '../base';
import { ApiResponse } from '@/types/types';

// 用户权限信息接口
export interface UserPermissionsResponse {
  userId: string;
  username: string;
  role: string;
  permissions: string[];
  roleInfo: {
    role: string;
    name: string;
    description: string;
    color: string;
    icon: string;
  };
}

// 获取当前用户权限
export const getCurrentUserPermissions = async (): Promise<UserPermissionsResponse> => {
  try {
    const result = (await authRequest({
      url: '/user-permissions',
      method: 'GET'
    })) as ApiResponse<UserPermissionsResponse>;

    if (result.code === 200) {
      return result.data;
    } else {
      throw new Error(result.message || '获取用户权限失败');
    }
  } catch (error) {
    console.error('获取当前用户权限失败:', error);
    throw error;
  }
};

// 获取指定用户权限
export const getUserPermissions = async (userId: string): Promise<UserPermissionsResponse> => {
  try {
    const result = (await authRequest({
      url: `/admin/users/${userId}/permissions`,
      method: 'GET'
    })) as ApiResponse<UserPermissionsResponse>;

    if (result.code === 200) {
      return result.data;
    } else {
      throw new Error(result.message || '获取用户权限失败');
    }
  } catch (error) {
    console.error('获取指定用户权限失败:', error);
    throw error;
  }
};
