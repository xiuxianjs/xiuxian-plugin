import { ApiResponse } from '@/types/types';
import { authRequest } from '../base';

// 获取配置
export const getConfig = async (app: string) => {
  try {
    const result = (await authRequest({
      url: '/config',
      params: { app }
    })) as ApiResponse;

    return result;
  } catch (error) {
    console.error('获取配置失败:', error);

    return null;
  }
};

// 保存配置
export const saveConfig = async (app: string, data: unknown) => {
  try {
    const result = (await authRequest({
      url: '/config',
      method: 'POST',
      data: {
        name: app,
        data
      }
    })) as ApiResponse;

    return result;
  } catch (error) {
    console.error('保存配置失败:', error);

    return null;
  }
};
