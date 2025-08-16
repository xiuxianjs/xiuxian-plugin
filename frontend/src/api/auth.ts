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
    const result = (await request({
      url: '/game-users',
      method: 'GET',
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })) as unknown as ApiResponse<{
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
    const result = (await request({
      url: '/game-users',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { userId }
    })) as unknown as ApiResponse<any>

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
    const result = (await request({
      url: '/game-users',
      method: 'PUT',
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })) as unknown as ApiResponse<{
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

// 获取宗门列表API（支持分页）
export const getAssociationsAPI = async (
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
    pagination: {
      current: number
      pageSize: number
      total: number
      totalPages: number
    }
  }
  message?: string
}> => {
  try {
    const result = (await request({
      url: '/associations',
      method: 'GET',
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })) as unknown as ApiResponse<{
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
    console.error('获取宗门列表API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 获取单个宗门详情API
export const getAssociationAPI = async (
  token: string,
  associationName: string
): Promise<{
  success: boolean
  data?: any
  message?: string
}> => {
  try {
    const result = (await request({
      url: '/associations',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { associationName }
    })) as unknown as ApiResponse<any>

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
    console.error('获取宗门详情API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 获取背包列表API（支持分页）
export const getNajieAPI = async (
  token: string,
  params: {
    page?: number
    pageSize?: number
    search?: string
    category?: string
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
    const result = (await request({
      url: '/najie',
      method: 'GET',
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })) as unknown as ApiResponse<{
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
    console.error('获取背包列表API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 获取单个背包详情API
export const getNajieDetailAPI = async (
  token: string,
  userId: string
): Promise<{
  success: boolean
  data?: any
  message?: string
}> => {
  try {
    const result = (await request({
      url: '/najie',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { userId }
    })) as unknown as ApiResponse<any>

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
    console.error('获取背包详情API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 获取排名数据API
export const getRankingsAPI = async (
  token: string,
  params: {
    type: string
    limit?: number
  }
): Promise<{
  success: boolean
  data?: any[]
  message?: string
}> => {
  try {
    const result = (await request({
      url: '/rankings',
      method: 'GET',
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })) as unknown as ApiResponse<any[]>

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
    console.error('获取排名数据API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 获取排名统计信息API
export const getRankingsStatsAPI = async (
  token: string
): Promise<{
  success: boolean
  data?: {
    lastUpdate: string
    associationCount: number
    playerCount: number
    topAssociations: any[]
    topPlayers: any[]
  }
  message?: string
}> => {
  try {
    const result = (await request({
      url: '/rankings',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })) as unknown as ApiResponse<{
      lastUpdate: string
      associationCount: number
      playerCount: number
      topAssociations: any[]
      topPlayers: any[]
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
    console.error('获取排名统计信息API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 获取定时任务配置API
export const getTaskConfigAPI = async (
  token: string
): Promise<{
  success: boolean
  data?: { [key: string]: string }
  message?: string
}> => {
  try {
    const result = (await request({
      url: '/task-config',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })) as unknown as ApiResponse<{ [key: string]: string }>

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
    console.error('获取定时任务配置API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 更新定时任务配置API
export const updateTaskConfigAPI = async (
  token: string,
  taskConfig: { [key: string]: string }
): Promise<{
  success: boolean
  data?: {
    timestamp: string
  }
  message?: string
}> => {
  try {
    const result = (await request({
      url: '/task-config',
      method: 'POST',
      data: { taskConfig },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })) as unknown as ApiResponse<{
      timestamp: string
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
    console.error('更新定时任务配置API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 获取任务状态API
export const getTaskStatusAPI = async (
  token: string
): Promise<{
  success: boolean
  data?: {
    [key: string]: {
      running: boolean
      nextInvocation?: string
    }
  }
  message?: string
}> => {
  try {
    const result = (await request({
      url: '/task-config',
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })) as unknown as ApiResponse<{
      [key: string]: {
        running: boolean
        nextInvocation?: string
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
    console.error('获取任务状态API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 任务控制API
export const taskControlAPI = async (
  token: string,
  action: 'start' | 'stop' | 'restart' | 'startAll' | 'stopAll' | 'restartAll',
  taskName?: string
): Promise<{
  success: boolean
  data?: {
    timestamp: string
    success: boolean
    [key: string]: unknown
  }
  message?: string
}> => {
  try {
    const result = (await request({
      url: '/task-config',
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { action, ...(taskName && { taskName }) }
    })) as unknown as ApiResponse<{
      timestamp: string
      success: boolean
      [key: string]: unknown
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
    console.error('任务控制API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 重启定时任务API (保持兼容性)
export const restartTasksAPI = async (
  token: string,
  taskName?: string
): Promise<{
  success: boolean
  data?: {
    timestamp: string
    taskName: string
    success: boolean
  }
  message?: string
}> => {
  const result = await taskControlAPI(
    token,
    taskName ? 'restart' : 'restartAll',
    taskName
  )
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
  }
}

// 触发排名计算API
export const triggerRankingCalculationAPI = async (
  token: string
): Promise<{
  success: boolean
  data?: {
    timestamp: string
  }
  message?: string
}> => {
  try {
    const result = (await request({
      url: '/rankings',
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })) as unknown as ApiResponse<{
      timestamp: string
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
    console.error('触发排名计算API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 获取背包统计信息API
export const getNajieStatsAPI = async (
  token: string,
  params: {
    search?: string
  } = {}
): Promise<{
  success: boolean
  data?: {
    total: number
    corruptedTotal: number
    totalLingshi: number
    totalItems: number
    categoryStats: {
      装备: number
      丹药: number
      道具: number
      功法: number
      草药: number
      材料: number
      仙宠: number
      仙宠口粮: number
    }
  }
  message?: string
}> => {
  try {
    const result = (await request({
      url: '/najie',
      method: 'PUT',
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })) as unknown as ApiResponse<{
      total: number
      totalLingshi: number
      totalItems: number
      categoryStats: {
        装备: number
        丹药: number
        道具: number
        功法: number
        草药: number
        材料: number
        仙宠: number
        仙宠口粮: number
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
    console.error('获取背包统计信息API错误:', error)
    return {
      success: false,
      message: '网络错误'
    }
  }
}

// 获取宗门统计信息API
export const getAssociationsStatsAPI = async (
  token: string,
  params: {
    search?: string
  } = {}
): Promise<{
  success: boolean
  data?: {
    total: number
    totalMembers: number
    totalPower: number
    totalLingshi: number
    xianjieCount: number
    fanjieCount: number
  }
  message?: string
}> => {
  try {
    const result = (await request({
      url: '/associations',
      method: 'PUT',
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })) as unknown as ApiResponse<{
      total: number
      totalMembers: number
      totalPower: number
      totalLingshi: number
      xianjieCount: number
      fanjieCount: number
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
    console.error('获取宗门统计信息API错误:', error)
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
