import { request } from './index'

// API响应类型
interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// 获取配置
export const getConfig = async (app: string) => {
  try {
    const result = (await request({
      url: '/config',
      params: { app }
    })) as unknown as ApiResponse

    return result
  } catch (error) {
    console.error('获取配置失败:', error)
    return null
  }
}

// 保存配置
export const saveConfig = async (app: string, data: unknown) => {
  try {
    const result = (await request({
      url: '/config',
      method: 'POST',
      data: {
        app,
        data
      }
    })) as unknown as ApiResponse

    return result
  } catch (error) {
    console.error('保存配置失败:', error)
    return null
  }
}
