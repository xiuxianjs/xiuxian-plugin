import { getIoRedis } from '@alemonjs/db';
import { keys } from '@src/model';
import { Context } from 'koa';

const redis = getIoRedis();

export interface User {
  id: string;
  username: string;
  password: string;
  role: string;
  status?: 'active' | 'inactive' | 'suspended';
  createdAt: number;
  lastLoginAt?: number;
}

// 权限枚举
export enum Permission {
  // 用户管理权限
  USER_VIEW = 'user:view', // 查看用户列表
  USER_CREATE = 'user:create', // 创建用户
  USER_UPDATE = 'user:update', // 更新用户
  USER_DELETE = 'user:delete', // 删除用户
  USER_ROLE_MANAGE = 'user:role_manage', // 管理用户角色

  // 系统管理权限
  SYSTEM_CONFIG = 'system:config', // 系统配置
  SYSTEM_TASKS = 'system:tasks', // 任务管理

  // 游戏数据权限
  GAME_USERS = 'game:users', // 游戏用户管理
  GAME_ASSOCIATIONS = 'game:associations', // 宗门管理
  GAME_NAJIE = 'game:najie', // 背包管理
  GAME_RANKINGS = 'game:rankings', // 排行榜管理
  GAME_CURRENCY = 'game:currency', // 货币管理
  GAME_DATA_QUERY = 'game:data_query', // 数据查询

  // 消息管理权限
  MESSAGE_MANAGE = 'message:manage', // 消息管理
  MUTE_MANAGE = 'mute:manage', // 禁言管理

  // 个人权限
  PROFILE_VIEW = 'profile:view', // 查看个人资料
  PROFILE_UPDATE = 'profile:update' // 更新个人资料
}

// 角色权限映射
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  super_admin: [
    // 超级管理员拥有所有权限
    Permission.USER_VIEW,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_ROLE_MANAGE,
    Permission.SYSTEM_CONFIG,
    Permission.SYSTEM_TASKS,
    Permission.GAME_USERS,
    Permission.GAME_ASSOCIATIONS,
    Permission.GAME_NAJIE,
    Permission.GAME_RANKINGS,
    Permission.GAME_CURRENCY,
    Permission.GAME_DATA_QUERY,
    Permission.MESSAGE_MANAGE,
    Permission.MUTE_MANAGE,
    Permission.PROFILE_VIEW,
    Permission.PROFILE_UPDATE
  ],
  admin: [
    // 管理员权限
    Permission.USER_VIEW,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.SYSTEM_CONFIG,
    Permission.SYSTEM_TASKS,
    Permission.GAME_USERS,
    Permission.GAME_ASSOCIATIONS,
    Permission.GAME_NAJIE,
    Permission.GAME_RANKINGS,
    Permission.GAME_CURRENCY,
    Permission.GAME_DATA_QUERY,
    Permission.MESSAGE_MANAGE,
    Permission.MUTE_MANAGE,
    Permission.PROFILE_VIEW,
    Permission.PROFILE_UPDATE
  ],
  operator: [
    // 运营人员权限
    Permission.SYSTEM_TASKS,
    Permission.GAME_USERS,
    Permission.GAME_ASSOCIATIONS,
    Permission.GAME_NAJIE,
    Permission.GAME_RANKINGS,
    Permission.GAME_CURRENCY,
    Permission.GAME_DATA_QUERY,
    Permission.MESSAGE_MANAGE,
    Permission.MUTE_MANAGE,
    Permission.PROFILE_VIEW,
    Permission.PROFILE_UPDATE
  ],
  developer: [
    // 开发人员权限
    Permission.SYSTEM_CONFIG,
    Permission.SYSTEM_TASKS,
    Permission.GAME_DATA_QUERY,
    Permission.PROFILE_VIEW,
    Permission.PROFILE_UPDATE
  ],
  team_member: [
    // 普通人员权限
    Permission.PROFILE_VIEW,
    Permission.PROFILE_UPDATE
  ]
};

// 角色信息
export interface RoleInfo {
  role: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

// 角色信息映射
export const ROLE_INFO: Record<string, RoleInfo> = {
  super_admin: {
    role: 'super_admin',
    name: '超级管理员',
    description: '拥有系统所有权限，可以管理所有用户和系统设置',
    color: 'red',
    icon: '👑'
  },
  admin: {
    role: 'admin',
    name: '管理员',
    description: '拥有大部分管理权限，可以管理用户和游戏数据',
    color: 'purple',
    icon: '🛡️'
  },
  operator: {
    role: 'operator',
    name: '运营人员',
    description: '负责系统运营和游戏数据管理',
    color: 'blue',
    icon: '⚙️'
  },
  developer: {
    role: 'developer',
    name: '开发人员',
    description: '负责系统开发和配置管理',
    color: 'green',
    icon: '💻'
  },
  team_member: {
    role: 'team_member',
    name: '普通人员',
    description: '基础权限，只能查看和修改个人资料',
    color: 'gray',
    icon: '👤'
  }
};

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: Omit<User, 'password'>;
  token?: string;
}

// 生成用户ID
const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 生成会话token
const generateToken = (): string => {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 15)}`;
};

// 创建用户结果类型
export interface CreateUserResult {
  success: boolean;
  user?: User;
  error?: 'USERNAME_EXISTS' | 'SUPER_ADMIN_EXISTS' | 'UNKNOWN_ERROR';
}

// 创建用户
export const createUser = async (username: string, password: string, role = 'admin'): Promise<CreateUserResult> => {
  try {
    // 检查用户名是否已存在
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return { success: false, error: 'USERNAME_EXISTS' };
    }

    // 如果要创建超级管理员，检查是否已存在超级管理员
    if (role === 'super_admin') {
      const hasSuperAdminUser = await hasSuperAdmin();

      if (hasSuperAdminUser) {
        logger.warn('超级管理员已存在，无法创建新的超级管理员');

        return { success: false, error: 'SUPER_ADMIN_EXISTS' };
      }
    }

    const user: User = {
      id: generateUserId(),
      username,
      password, // 实际项目中应该加密
      role,
      status: 'active',
      createdAt: Date.now()
    };

    // 存储到Redis
    await redis.set(keys.serverUser(user.id), JSON.stringify(user));
    await redis.set(keys.serverUsername(user.username), user.id);

    return { success: true, user };
  } catch (error) {
    logger.error('创建用户失败:', error);

    return { success: false, error: 'UNKNOWN_ERROR' };
  }
};

// 根据用户名获取用户
export const getUserByUsername = async (username: string): Promise<User | null> => {
  try {
    const userId = await redis.get(keys.serverUsername(username));

    if (!userId) {
      return null;
    }

    const userData = await redis.get(keys.serverUser(userId));

    if (!userData) {
      return null;
    }

    return JSON.parse(userData);
  } catch (error) {
    logger.error('获取用户失败:', error);

    return null;
  }
};

// 根据ID获取用户
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const userData = await redis.get(keys.serverUser(id));

    if (!userData) {
      return null;
    }

    return JSON.parse(userData);
  } catch (error) {
    logger.error('获取用户失败:', error);

    return null;
  }
};

// 检查是否存在超级管理员
export const hasSuperAdmin = async (): Promise<boolean> => {
  try {
    // 获取所有用户键
    const userKeys = await redis.keys(keys.serverUser('*'));

    for (const key of userKeys) {
      const userData = await redis.get(key);

      if (userData) {
        const user: User = JSON.parse(userData);

        if (user.role === 'super_admin') {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    logger.error('检查超级管理员失败:', error);

    return false;
  }
};

// 更新用户角色
export const updateUserRole = async (userId: string, newRole: string): Promise<boolean> => {
  try {
    const user = await getUserById(userId);

    if (!user) {
      return false;
    }

    // 如果当前用户是超级管理员，不允许修改角色
    if (user.role === 'super_admin') {
      logger.warn('超级管理员角色不能被修改');

      return false;
    }

    // 如果要设置为超级管理员，检查是否已存在超级管理员
    if (newRole === 'super_admin') {
      const hasSuperAdminUser = await hasSuperAdmin();

      if (hasSuperAdminUser) {
        logger.warn('超级管理员已存在，无法设置新的超级管理员');

        return false;
      }
    }

    // 更新用户角色
    user.role = newRole;
    await redis.set(keys.serverUser(userId), JSON.stringify(user));

    return true;
  } catch (error) {
    logger.error('更新用户角色失败:', error);

    return false;
  }
};

// 删除用户
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const user = await getUserById(userId);

    if (!user) {
      return false;
    }

    // 超级管理员不能被删除
    if (user.role === 'super_admin') {
      logger.warn('超级管理员不能被删除');

      return false;
    }

    // 删除用户数据
    await redis.del(keys.serverUser(userId));
    await redis.del(keys.serverUsername(user.username));

    return true;
  } catch (error) {
    logger.error('删除用户失败:', error);

    return false;
  }
};

// 获取所有用户
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const userKeys = await redis.keys(keys.serverUser('*'));
    const users: User[] = [];

    for (const key of userKeys) {
      const userData = await redis.get(key);

      if (userData) {
        const user: User = JSON.parse(userData);

        users.push(user);
      }
    }

    return users;
  } catch (error) {
    logger.error('获取所有用户失败:', error);

    return [];
  }
};

// 验证用户登录
export const validateLogin = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const user = await getUserByUsername(username);

    if (!user) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: '密码错误'
      };
    }

    // 生成token
    const token = generateToken();

    // 更新最后登录时间
    user.lastLoginAt = Date.now();
    await redis.set(keys.serverUser(user.id), JSON.stringify(user));

    // 存储会话信息（24小时过期）
    const sessionData = {
      userId: user.id,
      username: user.username,
      role: user.role,
      createdAt: Date.now()
    };

    await redis.setex(keys.serverSession(token), 86400, JSON.stringify(sessionData));

    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      message: '登录成功',
      user: userWithoutPassword,
      token
    };
  } catch (error) {
    logger.error('登录验证失败:', error);

    return {
      success: false,
      message: '登录失败，请重试'
    };
  }
};

// 验证token
export const validateToken = async (token: string): Promise<User | null> => {
  try {
    const sessionData = await redis.get(keys.serverSession(token));

    if (!sessionData) {
      return null;
    }

    const session = JSON.parse(sessionData);
    const user = await getUserById(session.userId);

    if (!user) {
      // 删除无效的session
      await redis.del(keys.serverSession(token));

      return null;
    }

    return user;
  } catch (error) {
    logger.error('验证token失败:', error);

    return null;
  }
};

// 登出
export const logout = async (token: string): Promise<boolean> => {
  try {
    await redis.del(keys.serverSession(token));

    return true;
  } catch (error) {
    logger.error('登出失败:', error);

    return false;
  }
};

// 更新用户密码
export const setUserPassword = async (userId: string, password: string): Promise<boolean> => {
  try {
    const user = await getUserById(userId);

    if (!user) {
      return false;
    }
    user.password = password;
    await redis.set(keys.serverUser(userId), JSON.stringify(user));

    return true;
  } catch (error) {
    logger.error('更新用户密码失败:', error);

    return false;
  }
};

// 初始化默认管理员账户
export const initDefaultAdmin = async (): Promise<void> => {
  try {
    // 检查是否已存在超级管理员
    const hasSuperAdminUser = await hasSuperAdmin();

    if (!hasSuperAdminUser) {
      // 如果不存在超级管理员，创建默认超级管理员
      const result = await createUser('lemonade', '123456', 'super_admin');

      if (result.success && result.user) {
        logger.info('默认超级管理员创建成功: lemonade');
      } else {
        logger.error('创建默认超级管理员失败:', result.error);
      }
    } else {
      logger.info('超级管理员已存在，跳过初始化');
    }
  } catch (error) {
    logger.error('初始化默认管理员失败:', error);
  }
};

// 基于权限的验证函数
export const validatePermission = async (ctx: Context, requiredPermissions: Permission[]) => {
  const token = ctx.request.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    ctx.status = 401;
    ctx.body = {
      code: 401,
      message: '需要登录',
      data: null
    };

    return false;
  }

  const user = await validateToken(token);

  if (!user) {
    ctx.status = 401;
    ctx.body = {
      code: 401,
      message: 'Token无效',
      data: null
    };

    return false;
  }

  // 获取用户权限
  const userPermissions = getUserPermissionsByRole(user.role);

  // 检查用户是否有任意一个所需权限
  const hasRequiredPermission = requiredPermissions.some(permission => userPermissions.includes(permission));

  if (!hasRequiredPermission) {
    ctx.status = 403;
    ctx.body = {
      code: 403,
      message: '权限不足',
      data: {
        required: requiredPermissions,
        userPermissions: userPermissions
      }
    };

    return false;
  }

  return true;
};

// 基于角色的验证函数（保持向后兼容）
export const validateRole = async (ctx: Context, requiredRoles: string[]) => {
  const token = ctx.request.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    ctx.status = 401;
    ctx.body = {
      code: 401,
      message: '需要登录',
      data: null
    };

    return false;
  }

  const user = await validateToken(token);

  if (!user) {
    ctx.status = 401;
    ctx.body = {
      code: 401,
      message: 'Token无效',
      data: null
    };

    return false;
  }

  // 检查用户角色是否在允许的角色列表中
  if (!requiredRoles.includes(user.role)) {
    ctx.status = 403;
    ctx.body = {
      code: 403,
      message: '权限不足',
      data: null
    };

    return false;
  }

  return true;
};

// 根据角色获取用户权限
export const getUserPermissionsByRole = (role: string): Permission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

// 获取角色信息
export const getRoleInfo = (role: string): RoleInfo | null => {
  return ROLE_INFO[role] || null;
};

// 检查用户是否有特定权限
export const hasPermission = (userRole: string, permission: Permission): boolean => {
  const userPermissions = getUserPermissionsByRole(userRole);

  return userPermissions.includes(permission);
};

// 检查用户是否有任意一个权限
export const hasAnyPermission = (userRole: string, permissions: Permission[]): boolean => {
  const userPermissions = getUserPermissionsByRole(userRole);

  return permissions.some(permission => userPermissions.includes(permission));
};

// 检查用户是否有所有权限
export const hasAllPermissions = (userRole: string, permissions: Permission[]): boolean => {
  const userPermissions = getUserPermissionsByRole(userRole);

  return permissions.every(permission => userPermissions.includes(permission));
};
