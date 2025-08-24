import { ApiResponse, LoginResponse } from '@/types/types'
import { authRequest } from '../base'

// 获取用户列表API
export const getUsersAPI = async (
  token: string
): Promise<{
  success: boolean
  users?: LoginResponse['user'][]
  message?: string
}> => {
  try {
    const result = (await authRequest({
      url: '/users',
      method: 'GET'
    })) as ApiResponse<LoginResponse['user'][]>

    if (result.code === 200) {
      return {
        success: true,
        users: result.data
      }
    } else {
      return {
        success: false,
        message: result.message
      }
    }
  } catch (error) {
    console.error('获取用户列表API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 获取游戏用户列表API（支持分页）
export const getGameUsersAPI = async (
  token: string,
  params: {
    page?: number
    pageSize?: number
    search?: string
  } = {}
): Promise<{
  success: boolean
  data?: {
    list: any[]
    corruptedList: any[]
    pagination: {
      current: number
      pageSize: number
      total: number
      totalPages: number
    }
    corruptedPagination: {
      current: number
      pageSize: number
      total: number
      totalPages: number
    }
  }
  message?: string
}> => {
  try {
    const result = (await authRequest({
      url: '/game-users',
      method: 'GET',
      params
    })) as ApiResponse<{
      list: any[]
      pagination: {
        current: number
        pageSize: number
        total: number
        totalPages: number
      }
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
    console.error('获取游戏用户列表API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 获取单个游戏用户数据API
export const getGameUserAPI = async (
  token: string,
  userId: string
): Promise<{
  success: boolean
  user?: any
  message?: string
}> => {
  try {
    const result = (await authRequest({
      url: '/game-users',
      method: 'POST',
      data: { userId }
    })) as ApiResponse<any>

    if (result.code === 200) {
      return {
        success: true,
        user: result.data
      }
    } else {
      return {
        success: false,
        message: result.message
      }
    }
  } catch (error) {
    console.error('获取游戏用户数据API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 更新游戏用户数据API
export const updateGameUserAPI = async (
  token: string,
  user: any
): Promise<{
  success: boolean
  data?: any
  message?: string
}> => {
  try {
    const result = (await authRequest({
      url: '/game-users-update',
      method: 'PUT',
      data: user
    })) as ApiResponse<any>

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
    console.error('更新游戏用户数据API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 获取游戏用户统计信息API
export const getGameUsersStatsAPI = async (
  token: string,
  params: {
    search?: string
  } = {}
): Promise<{
  success: boolean
  data?: {
    total: number
    highLevel: number
    mediumLevel: number
    lowLevel: number
    totalLingshi: number
    totalShenshi: number
    totalLunhui: number
  }
  message?: string
}> => {
  try {
    const result = (await authRequest({
      url: '/game-users',
      method: 'PUT',
      params
    })) as ApiResponse<{
      total: number
      highLevel: number
      mediumLevel: number
      lowLevel: number
      totalLingshi: number
      totalShenshi: number
      totalLunhui: number
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
    console.error('获取游戏用户统计信息API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}
