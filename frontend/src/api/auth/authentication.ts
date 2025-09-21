import { ApiResponse, LoginRequest, LoginResponse } from '@/types/types';
import { authRequest, request } from '../base';

// 登录API
export const loginAPI = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const result = (await request({
      url: '/auth',
      method: 'POST',
      data
    })) as ApiResponse<{
      user: LoginResponse['user'];
      token: string;
    }>;

    if (result.code === 200) {
      return {
        success: true,
        message: result.message,
        user: result.data.user,
        token: result.data.token
      };
    } else {
      return {
        success: false,
        message: result.message || '登录失败'
      };
    }
  } catch (error) {
    console.error('登录API错误:', error);

    return {
      success: false,
      message: '错误，请重试'
    };
  }
};

// 登出API
export const logoutAPI = async (): Promise<{ success: boolean }> => {
  try {
    const result = (await authRequest({
      url: '/logout',
      method: 'POST'
    })) as ApiResponse;

    if (result.code === 200) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error('登出API错误:', error);

    return { success: false };
  }
};

// 验证token API
export const verifyTokenAPI = async (token: string): Promise<{ valid: boolean; user?: LoginResponse['user'] }> => {
  try {
    const result = (await authRequest({
      url: '/auth',
      method: 'GET',
      params: { token }
    })) as ApiResponse<{ user: LoginResponse['user'] }>;

    if (result.code === 200) {
      return {
        valid: true,
        user: result.data.user
      };
    } else {
      return { valid: false };
    }
  } catch (error) {
    console.error('Token验证API错误:', error);

    return { valid: false };
  }
};

// 修改密码API
export const changePasswordAPI = async (passwordData: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> => {
  try {
    const result = (await authRequest({
      url: '/change-password',
      method: 'POST',
      data: passwordData
    })) as ApiResponse;

    if (result.code === 200) {
      return {
        success: true,
        message: result.message || '密码修改成功'
      };
    } else {
      return {
        success: false,
        message: result.message || '密码修改失败'
      };
    }
  } catch (error) {
    console.error('修改密码API错误:', error);

    return {
      success: false,
      message: '错误，请重试'
    };
  }
};
