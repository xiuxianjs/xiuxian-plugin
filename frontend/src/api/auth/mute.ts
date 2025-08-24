import { ApiResponse } from '@/types/types'
import { authRequest } from '../base'

// 禁言记录接口
export interface MuteRecord {
  userId: string
  ttl: number
  unlockTime: string
  remainingTime: string
}

// 禁言表单接口
export interface MuteFormValues {
  userId: string
  duration: string
  reason?: string
}

// 禁言日志接口
export interface MuteLog {
  userId: string
  duration?: number
  reason?: string
  adminId?: string
  timestamp: string
}

// 获取禁言列表API
export const getMuteListAPI = async (): Promise<{
  success: boolean
  data?: {
    list: MuteRecord[]
    total: number
  }
  message?: string
}> => {
  try {
    const result = (await authRequest({
      url: '/mute-list',
      method: 'GET'
    })) as ApiResponse<{
      list: MuteRecord[]
      total: number
    }>

    if (result.code === 200) {
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: result.message
      }
    }
  } catch (error) {
    console.error('获取禁言列表API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 添加禁言API
export const addMuteAPI = async (
  values: MuteFormValues
): Promise<{
  success: boolean
  data?: {
    userId: string
    duration: number
    unlockTime: string
  }
  message?: string
}> => {
  try {
    const result = (await authRequest({
      url: '/mute-list',
      method: 'POST',
      data: values
    })) as ApiResponse<{
      userId: string
      duration: number
      unlockTime: string
    }>

    if (result.code === 200) {
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: result.message
      }
    }
  } catch (error) {
    console.error('添加禁言API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 解除禁言API
export const unmuteAPI = async (
  userId: string
): Promise<{
  success: boolean
  data?: {
    userId: string
  }
  message?: string
}> => {
  try {
    const result = (await authRequest({
      url: `/mute-list?userId=${userId}`,
      method: 'DELETE'
    })) as ApiResponse<{
      userId: string
    }>

    if (result.code === 200) {
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: result.message
      }
    }
  } catch (error) {
    console.error('解除禁言API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 批量解除禁言API
export const batchUnmuteAPI = async (
  userIds: string[]
): Promise<{
  success: boolean
  data?: {
    results: Array<{
      userId: string
      success: boolean
      message?: string
    }>
    total: number
    successCount: number
  }
  message?: string
}> => {
  try {
    const result = (await authRequest({
      url: '/mute-list',
      method: 'PUT',
      data: { userIds }
    })) as ApiResponse<{
      results: Array<{
        userId: string
        success: boolean
        message?: string
      }>
      total: number
      successCount: number
    }>

    if (result.code === 200) {
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: result.message
      }
    }
  } catch (error) {
    console.error('批量解除禁言API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 获取禁言日志API
export const getMuteLogsAPI = async (
  type: 'mute' | 'unmute' = 'mute',
  limit: number = 100
): Promise<{
  success: boolean
  data?: {
    list: MuteLog[]
    total: number
    type: string
  }
  message?: string
}> => {
  try {
    const result = (await authRequest({
      url: `/mute-logs?type=${type}&limit=${limit}`,
      method: 'GET'
    })) as ApiResponse<{
      list: MuteLog[]
      total: number
      type: string
    }>

    if (result.code === 200) {
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: result.message
      }
    }
  } catch (error) {
    console.error('获取禁言日志API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 清理禁言日志API
export const clearMuteLogsAPI = async (
  type: 'all' | 'mute' | 'unmute' = 'all'
): Promise<{
  success: boolean
  data?: {
    deletedCount: number
  }
  message?: string
}> => {
  try {
    const result = (await authRequest({
      url: `/mute-logs?type=${type}`,
      method: 'DELETE'
    })) as ApiResponse<{
      deletedCount: number
    }>

    if (result.code === 200) {
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: result.message
      }
    }
  } catch (error) {
    console.error('清理禁言日志API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}
