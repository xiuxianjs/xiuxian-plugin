import { request } from './index'

// API响应类型
interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  user?: {
    id: string
    username: string
    role: string
    createdAt: number
    lastLoginAt?: number
  }
  token?: string
}

// 登录API
export const loginAPI = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const result = (await request({
      url: '/auth',
      method: 'POST',
      data
    })) as unknown as ApiResponse<{
      user: LoginResponse['user']
      token: string
    }>

    if (result.code === 200) {
      return {
        success: true,
        message: result.message,
        user: result.data.user,
        token: result.data.token
      }
    } else {
      return {
        success: false,
        message: result.message || '登录失败'
      }
    }
  } catch (error) {
    console.error('登录API错误:', error)
    return {
      success: false,
      message: '错误，请重试'
    }
  }
}

// 登出API
export const logoutAPI = async (
  token: string
): Promise<{ success: boolean }> => {
  try {
    const result = (await request({
      url: '/logout',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })) as unknown as ApiResponse

    if (result.code === 200) {
      return { success: true }
    } else {
      return { success: false }
    }
  } catch (error) {
    console.error('登出API错误:', error)
    return { success: false }
  }
}

// 验证token API
export const verifyTokenAPI = async (
  token: string
): Promise<{ valid: boolean; user?: LoginResponse['user'] }> => {
  try {
    const result = (await request({
      url: '/auth',
      method: 'GET',
      params: { token },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })) as unknown as ApiResponse<{ user: LoginResponse['user'] }>

    if (result.code === 200) {
      return {
        valid: true,
        user: result.data.user
      }
    } else {
      return { valid: false }
    }
  } catch (error) {
    console.error('Token验证API错误:', error)
    return { valid: false }
  }
}

// 获取用户列表API
export const getUsersAPI = async (
  token: string
): Promise<{
  success: boolean
  users?: LoginResponse['user'][]
  message?: string
}> => {
  try {
    const result = (await request({
      url: '/users',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })) as unknown as ApiResponse<LoginResponse['user'][]>

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

// 修改密码API
export const changePasswordAPI = async (
  token: string,
  passwordData: {
    currentPassword: string
    newPassword: string
  }
): Promise<{ success: boolean; message: string }> => {
  try {
    const result = (await request({
      url: '/change-password',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: passwordData
    })) as unknown as ApiResponse

    if (result.code === 200) {
      return {
        success: true,
        message: result.message || '密码修改成功'
      }
    } else {
      return {
        success: false,
        message: result.message || '密码修改失败'
      }
    }
  } catch (error) {
    console.error('修改密码API错误:', error)
    return {
      success: false,
      message: '错误，请重试'
    }
  }
}
