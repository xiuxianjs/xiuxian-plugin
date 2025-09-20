import { authRequest } from '../base';
import { ApiResponse } from '@/types/types';
import type { AdminUser, UserFormData, UserRole, Permission } from '@/types/permissions';

// 获取用户列表
export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface GetUsersResponse {
  success: boolean;
  message: string;
  data?: {
    users: AdminUser[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export const getUsersAPI = async (params: GetUsersParams = {}): Promise<GetUsersResponse> => {
  try {
    const result = (await authRequest({
      url: '/admin/users',
      method: 'GET',
      params
    })) as ApiResponse<{
      users: AdminUser[];
      total: number;
      page: number;
      pageSize: number;
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
        message: result.message || '获取用户列表失败'
      };
    }
  } catch (error) {
    console.error('获取用户列表API错误:', error);

    return {
      success: false,
      message: '错误，请重试'
    };
  }
};

// 创建用户
export interface CreateUserResponse {
  success: boolean;
  message: string;
  data?: AdminUser;
}

export const createUserAPI = async (userData: UserFormData): Promise<CreateUserResponse> => {
  try {
    const result = (await authRequest({
      url: '/admin/users',
      method: 'POST',
      data: userData
    })) as ApiResponse<AdminUser>;

    if (result.code === 200) {
      return {
        success: true,
        message: result.message || '用户创建成功',
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || '用户创建失败'
      };
    }
  } catch (error) {
    console.error('创建用户API错误:', error);

    return {
      success: false,
      message: '错误，请重试'
    };
  }
};

// 更新用户
export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data?: AdminUser;
}

export const updateUserAPI = async (userId: string, userData: Partial<UserFormData>): Promise<UpdateUserResponse> => {
  try {
    const result = (await authRequest({
      url: `/admin/users/${userId}`,
      method: 'PUT',
      data: userData
    })) as ApiResponse<AdminUser>;

    if (result.code === 200) {
      return {
        success: true,
        message: result.message || '用户更新成功',
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || '用户更新失败'
      };
    }
  } catch (error) {
    console.error('更新用户API错误:', error);

    return {
      success: false,
      message: '错误，请重试'
    };
  }
};

// 删除用户
export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export const deleteUserAPI = async (userId: string): Promise<DeleteUserResponse> => {
  try {
    const result = (await authRequest({
      url: `/admin/users/${userId}`,
      method: 'DELETE'
    })) as ApiResponse;

    if (result.code === 200) {
      return {
        success: true,
        message: result.message || '用户删除成功'
      };
    } else {
      return {
        success: false,
        message: result.message || '用户删除失败'
      };
    }
  } catch (error) {
    console.error('删除用户API错误:', error);

    return {
      success: false,
      message: '错误，请重试'
    };
  }
};

// 获取用户详情
export interface GetUserResponse {
  success: boolean;
  message: string;
  data?: AdminUser;
}

export const getUserAPI = async (userId: string): Promise<GetUserResponse> => {
  try {
    const result = (await authRequest({
      url: `/admin/users/${userId}`,
      method: 'GET'
    })) as ApiResponse<AdminUser>;

    if (result.code === 200) {
      return {
        success: true,
        message: result.message || '获取用户成功',
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || '获取用户失败'
      };
    }
  } catch (error) {
    console.error('获取用户API错误:', error);

    return {
      success: false,
      message: '错误，请重试'
    };
  }
};

// 重置用户密码
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    newPassword: string;
  };
}

export const resetUserPasswordAPI = async (userId: string): Promise<ResetPasswordResponse> => {
  try {
    const result = (await authRequest({
      url: `/admin/users/${userId}/reset-password`,
      method: 'POST'
    })) as ApiResponse<{ newPassword: string }>;

    if (result.code === 200) {
      return {
        success: true,
        message: result.message || '密码重置成功',
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || '密码重置失败'
      };
    }
  } catch (error) {
    console.error('重置密码API错误:', error);

    return {
      success: false,
      message: '错误，请重试'
    };
  }
};

// 更新用户状态
export interface UpdateUserStatusResponse {
  success: boolean;
  message: string;
  data?: AdminUser;
}

export const updateUserStatusAPI = async (userId: string, status: 'active' | 'inactive' | 'suspended'): Promise<UpdateUserStatusResponse> => {
  try {
    const result = (await authRequest({
      url: `/admin/users/${userId}/status`,
      method: 'PATCH',
      data: { status }
    })) as ApiResponse<AdminUser>;

    if (result.code === 200) {
      return {
        success: true,
        message: result.message || '状态更新成功',
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || '状态更新失败'
      };
    }
  } catch (error) {
    console.error('更新用户状态API错误:', error);

    return {
      success: false,
      message: '错误，请重试'
    };
  }
};

// 获取用户权限
export interface GetUserPermissionsResponse {
  success: boolean;
  message: string;
  data?: {
    permissions: Permission[];
    role: UserRole;
  };
}

export const getUserPermissionsAPI = async (userId: string): Promise<GetUserPermissionsResponse> => {
  try {
    const result = (await authRequest({
      url: `/admin/users/${userId}/permissions`,
      method: 'GET'
    })) as ApiResponse<{ permissions: Permission[]; role: UserRole }>;

    if (result.code === 200) {
      return {
        success: true,
        message: result.message || '获取权限成功',
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || '获取权限失败'
      };
    }
  } catch (error) {
    console.error('获取用户权限API错误:', error);

    return {
      success: false,
      message: '错误，请重试'
    };
  }
};

// 更新用户权限
export interface UpdateUserPermissionsResponse {
  success: boolean;
  message: string;
  data?: {
    permissions: Permission[];
  };
}

export const updateUserPermissionsAPI = async (userId: string, permissions: Permission[]): Promise<UpdateUserPermissionsResponse> => {
  try {
    const result = (await authRequest({
      url: `/admin/users/${userId}/permissions`,
      method: 'PUT',
      data: { permissions }
    })) as ApiResponse<{ permissions: Permission[] }>;

    if (result.code === 200) {
      return {
        success: true,
        message: result.message || '权限更新成功',
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || '权限更新失败'
      };
    }
  } catch (error) {
    console.error('更新用户权限API错误:', error);

    return {
      success: false,
      message: '错误，请重试'
    };
  }
};

// 批量操作用户
export interface BatchUserOperation {
  userIds: string[];
  operation: 'activate' | 'deactivate' | 'suspend' | 'delete';
}

export interface BatchUserOperationResponse {
  success: boolean;
  message: string;
  data?: {
    successCount: number;
    failedCount: number;
    errors: Array<{
      userId: string;
      error: string;
    }>;
  };
}

export const batchUserOperationAPI = async (operation: BatchUserOperation): Promise<BatchUserOperationResponse> => {
  try {
    const result = (await authRequest({
      url: '/admin/users/batch',
      method: 'POST',
      data: operation
    })) as ApiResponse<{
      successCount: number;
      failedCount: number;
      errors: Array<{
        userId: string;
        error: string;
      }>;
    }>;

    if (result.code === 200) {
      return {
        success: true,
        message: result.message || '批量操作完成',
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || '批量操作失败'
      };
    }
  } catch (error) {
    console.error('批量操作API错误:', error);

    return {
      success: false,
      message: '错误，请重试'
    };
  }
};
