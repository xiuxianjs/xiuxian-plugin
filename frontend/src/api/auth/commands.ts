import { ApiResponse } from '@/types/types';
import { authRequest } from '../base';

// 获取指令列表API
export const getCommandsAPI = async (
  token: string,
  menus: string[]
): Promise<{
  success: boolean;
  data?: Array<{
    isDir: boolean;
    isFile: boolean;
    name: string;
    status?: boolean;
  }>;
  message?: string;
}> => {
  try {
    const result = (await authRequest({
      url: '/commands',
      method: 'POST',
      data: { menus }
    })) as ApiResponse<
      Array<{
        isDir: boolean;
        isFile: boolean;
        name: string;
        status?: boolean;
      }>
    >;

    if (result.code === 200) {
      return {
        success: true,
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || '获取指令列表失败'
      };
    }
  } catch (error) {
    console.error('获取指令列表API错误:', error);
    return {
      success: false,
      message: '获取指令列表失败'
    };
  }
};

// 更新指令状态API
export const updateCommandStatusAPI = async (
  token: string,
  menus: string[],
  switchStatus: boolean
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const result = (await authRequest({
      url: '/commands',
      method: 'PUT',
      data: { menus, switch: switchStatus }
    })) as ApiResponse<null>;

    if (result.code === 200) {
      return {
        success: true
      };
    } else {
      return {
        success: false,
        message: result.message || '更新指令状态失败'
      };
    }
  } catch (error) {
    console.error('更新指令状态API错误:', error);
    return {
      success: false,
      message: '更新指令状态失败'
    };
  }
};
