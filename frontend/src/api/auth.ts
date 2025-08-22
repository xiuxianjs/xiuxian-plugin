import { ApiResponse, LoginRequest, LoginResponse } from '@/types'
import { authRequest, request } from './index'

// 登录API
export const loginAPI = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const result = (await request({
      url: '/auth',
      method: 'POST',
      data
    })) as ApiResponse<{
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
    const result = (await authRequest({
      url: '/logout',
      method: 'POST'
    })) as ApiResponse

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
    const result = (await authRequest({
      url: '/auth',
      method: 'GET',
      params: { token }
    })) as ApiResponse<{ user: LoginResponse['user'] }>

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

// 获取数据列表API（支持分页和搜索）
export const getDataListAPI = async (
  token: string,
  dataType: string,
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
    const result = (await authRequest({
      url: '/data-list',
      method: 'GET',
      params: {
        name: dataType,
        page: params.page?.toString(),
        pageSize: params.pageSize?.toString(),
        search: params.search
      }
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
        message: result.message || '获取数据失败'
      }
    }
  } catch (error) {
    console.error('获取数据列表API错误:', error)
    return {
      success: false,
      message: '获取数据失败'
    }
  }
}

// 更新数据列表API
export const updateDataListAPI = async (
  token: string,
  dataType: string,
  data: any[],
  batchMode = false
): Promise<{
  success: boolean
  data?: {
    updatedCount: number
    batchMode: boolean
  }
  message?: string
}> => {
  try {
    const result = (await authRequest({
      url: '/data-list',
      method: 'PUT',
      data: { name: dataType, data, batchMode }
    })) as ApiResponse<{
      updatedCount: number
      batchMode: boolean
    }>

    if (result.code === 200) {
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: result.message || '更新数据失败'
      }
    }
  } catch (error) {
    console.error('更新数据列表API错误:', error)
    return {
      success: false,
      message: '更新数据失败'
    }
  }
}

// 批量更新数据API（支持分块处理）
export const batchUpdateDataAPI = async (
  token: string,
  dataType: string,
  updates: Array<{ index: number; data: any }>,
  chunkSize = 100
): Promise<{
  success: boolean
  data?: {
    updatedCount: number
    totalChunks: number
    chunkSize: number
  }
  message?: string
}> => {
  try {
    const result = (await authRequest({
      url: '/data-list',
      method: 'PATCH',
      data: { name: dataType, updates, chunkSize }
    })) as ApiResponse<{
      updatedCount: number
      totalChunks: number
      chunkSize: number
    }>

    if (result.code === 200) {
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: result.message || '批量更新失败'
      }
    }
  } catch (error) {
    console.error('批量更新数据API错误:', error)
    return {
      success: false,
      message: '批量更新失败'
    }
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
    const result = (await authRequest({
      url: '/associations',
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
    const result = (await authRequest({
      url: '/associations',
      method: 'POST',
      data: { associationName }
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
    const result = (await authRequest({
      url: '/najie',
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
    const result = (await authRequest({
      url: '/najie',
      method: 'POST',
      data: { userId }
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
    const result = (await authRequest({
      url: '/rankings',
      method: 'GET',
      params
    })) as ApiResponse<any[]>

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
    const result = (await authRequest({
      url: '/rankings',
      method: 'POST'
    })) as ApiResponse<{
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
    const result = (await authRequest({
      url: '/task-config',
      method: 'GET'
    })) as ApiResponse<{ [key: string]: string }>

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
    const result = (await authRequest({
      url: '/task-config',
      method: 'POST',
      data: { taskConfig }
    })) as ApiResponse<{
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
    const result = (await authRequest({
      url: '/task-config',
      method: 'PATCH'
    })) as ApiResponse<{
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
    const result = (await authRequest({
      url: '/task-config',
      method: 'PUT',
      data: { action, ...(taskName && { taskName }) }
    })) as ApiResponse<{
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
    const result = (await authRequest({
      url: '/rankings',
      method: 'PUT'
    })) as ApiResponse<{
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
    const result = (await authRequest({
      url: '/associations',
      method: 'PUT',
      params
    })) as ApiResponse<{
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
    const result = (await authRequest({
      url: '/change-password',
      method: 'POST',
      data: passwordData
    })) as ApiResponse

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

// 获取指令列表API
export const getCommandsAPI = async (
  token: string,
  menus: string[]
): Promise<{
  success: boolean
  data?: Array<{
    isDir: boolean
    isFile: boolean
    name: string
    status?: boolean
  }>
  message?: string
}> => {
  try {
    const result = (await authRequest({
      url: '/commands',
      method: 'POST',
      data: { menus }
    })) as ApiResponse<
      Array<{
        isDir: boolean
        isFile: boolean
        name: string
        status?: boolean
      }>
    >

    if (result.code === 200) {
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: result.message || '获取指令列表失败'
      }
    }
  } catch (error) {
    console.error('获取指令列表API错误:', error)
    return {
      success: false,
      message: '获取指令列表失败'
    }
  }
}

// 更新指令状态API
export const updateCommandStatusAPI = async (
  token: string,
  menus: string[],
  switchStatus: boolean
): Promise<{
  success: boolean
  message?: string
}> => {
  try {
    const result = (await authRequest({
      url: '/commands',
      method: 'PUT',
      data: { menus, switch: switchStatus }
    })) as ApiResponse<null>

    if (result.code === 200) {
      return {
        success: true
      }
    } else {
      return {
        success: false,
        message: result.message || '更新指令状态失败'
      }
    }
  } catch (error) {
    console.error('更新指令状态API错误:', error)
    return {
      success: false,
      message: '更新指令状态失败'
    }
  }
}

export const updateNajieAPI = async (
  token: string,
  najieData: {
    id: string
    name: string
    description: string
  }
): Promise<{ success: boolean; message: string }> => {
  try {
    const result = (await authRequest({
      url: '/najie',
      method: 'PUT',
      data: najieData
    })) as ApiResponse

    if (result.code === 200) {
      return {
        success: true,
        message: result.message || '纳戒信息更新成功'
      }
    } else {
      return {
        success: false,
        message: result.message || '纳戒信息更新失败'
      }
    }
  } catch (error) {
    console.error('更新纳戒信息API错误:', error)
    return {
      success: false,
      message: '更新纳戒信息失败'
    }
  }
}
