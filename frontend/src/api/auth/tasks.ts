import { ApiResponse } from '@/types/types';
import { authRequest } from '../base';

// 获取定时任务配置API
export const getTaskConfigAPI = async (
  token: string
): Promise<{
  success: boolean;
  data?: { [key: string]: string };
  message?: string;
}> => {
  try {
    const result = (await authRequest({
      url: '/task-config',
      method: 'GET'
    })) as ApiResponse<{ [key: string]: string }>;

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
    console.error('获取定时任务配置API错误:', error);
    return {
      success: false,
      message: '网络错误'
    };
  }
};

// 更新定时任务配置API
export const updateTaskConfigAPI = async (
  token: string,
  taskConfig: { [key: string]: string }
): Promise<{
  success: boolean;
  data?: {
    timestamp: string;
  };
  message?: string;
}> => {
  try {
    const result = (await authRequest({
      url: '/task-config',
      method: 'POST',
      data: { taskConfig }
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
    console.error('更新定时任务配置API错误:', error);
    return {
      success: false,
      message: '网络错误'
    };
  }
};

// 获取任务状态API
export const getTaskStatusAPI = async (
  token: string
): Promise<{
  success: boolean;
  data?: {
    [key: string]: {
      running: boolean;
      nextInvocation?: string;
    };
  };
  message?: string;
}> => {
  try {
    const result = (await authRequest({
      url: '/task-config',
      method: 'PATCH'
    })) as ApiResponse<{
      [key: string]: {
        running: boolean;
        nextInvocation?: string;
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
    console.error('获取任务状态API错误:', error);
    return {
      success: false,
      message: '网络错误'
    };
  }
};

// 任务控制API
export const taskControlAPI = async (
  token: string,
  action: 'start' | 'stop' | 'restart' | 'startAll' | 'stopAll' | 'restartAll',
  taskName?: string
): Promise<{
  success: boolean;
  data?: {
    timestamp: string;
    success: boolean;
    [key: string]: unknown;
  };
  message?: string;
}> => {
  try {
    const result = (await authRequest({
      url: '/task-config',
      method: 'PUT',
      data: { action, ...(taskName && { taskName }) }
    })) as ApiResponse<{
      timestamp: string;
      success: boolean;
      [key: string]: unknown;
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
    console.error('任务控制API错误:', error);
    return {
      success: false,
      message: '网络错误'
    };
  }
};

// 重启定时任务API (保持兼容性)
export const restartTasksAPI = async (
  token: string,
  taskName?: string
): Promise<{
  success: boolean;
  data?: {
    timestamp: string;
    taskName: string;
    success: boolean;
  };
  message?: string;
}> => {
  const result = await taskControlAPI(token, taskName ? 'restart' : 'restartAll', taskName);
  return {
    success: result.success,
    message: result.message,
    data: result.data
      ? {
          timestamp: result.data.timestamp,
          taskName: (result.data.taskName as string) || taskName || 'all',
          success: result.data.success
        }
      : undefined
  };
};
