import { getIoRedis } from '@alemonjs/db';
import { Context } from 'koa';
import { KEY_SESSION_PREFIX, KEY_USER_PREFIX } from './config';

const redis = getIoRedis();

export interface User {
  id: string;
  username: string;
  password: string;
  role: string;
  createdAt: number;
  lastLoginAt?: number;
}

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

// 创建用户
export const createUser = async (username: string, password: string, role = 'admin'): Promise<User | null> => {
  try {
    // 检查用户名是否已存在
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return null;
    }

    const user: User = {
      id: generateUserId(),
      username,
      password, // 实际项目中应该加密
      role,
      createdAt: Date.now()
    };

    // 存储到Redis
    await redis.set(`${KEY_USER_PREFIX}${user.id}`, JSON.stringify(user));
    await redis.set(`${KEY_USER_PREFIX}username:${username}`, user.id);

    return user;
  } catch (error) {
    logger.error('创建用户失败:', error);

    return null;
  }
};

// 根据用户名获取用户
export const getUserByUsername = async (username: string): Promise<User | null> => {
  try {
    const userId = await redis.get(`${KEY_USER_PREFIX}username:${username}`);

    if (!userId) {
      return null;
    }

    const userData = await redis.get(`${KEY_USER_PREFIX}${userId}`);

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
    const userData = await redis.get(`${KEY_USER_PREFIX}${id}`);

    if (!userData) {
      return null;
    }

    return JSON.parse(userData);
  } catch (error) {
    logger.error('获取用户失败:', error);

    return null;
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
    await redis.set(`${KEY_USER_PREFIX}${user.id}`, JSON.stringify(user));

    // 存储会话信息（24小时过期）
    const sessionData = {
      userId: user.id,
      username: user.username,
      role: user.role,
      createdAt: Date.now()
    };

    await redis.setex(`${KEY_SESSION_PREFIX}${token}`, 86400, JSON.stringify(sessionData));

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
    const sessionData = await redis.get(`${KEY_SESSION_PREFIX}${token}`);

    if (!sessionData) {
      return null;
    }

    const session = JSON.parse(sessionData);
    const user = await getUserById(session.userId);

    if (!user) {
      // 删除无效的session
      await redis.del(`${KEY_SESSION_PREFIX}${token}`);

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
    await redis.del(`${KEY_SESSION_PREFIX}${token}`);

    return true;
  } catch (error) {
    logger.error('登出失败:', error);

    return false;
  }
};

// 获取所有用户
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const keys = await redis.keys(`${KEY_USER_PREFIX}*`);
    const users: User[] = [];

    for (const key of keys) {
      if (!key.includes('username:')) {
        // 排除用户名索引
        const userData = await redis.get(key);

        if (userData) {
          users.push(JSON.parse(userData));
        }
      }
    }

    return users;
  } catch (error) {
    logger.error('获取所有用户失败:', error);

    return [];
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
    await redis.set(`${KEY_USER_PREFIX}${userId}`, JSON.stringify(user));

    return true;
  } catch (error) {
    logger.error('更新用户密码失败:', error);

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

    // 删除用户数据
    await redis.del(`${KEY_USER_PREFIX}${userId}`);
    await redis.del(`${KEY_USER_PREFIX}username:${user.username}`);

    return true;
  } catch (error) {
    logger.error('删除用户失败:', error);

    return false;
  }
};

// 初始化默认管理员账户
export const initDefaultAdmin = async (): Promise<void> => {
  try {
    const adminUser = await getUserByUsername('lemonade');

    if (!adminUser) {
      await createUser('lemonade', '123456', 'admin');
      logger.info('默认管理员账户已创建');
    }
  } catch (error) {
    logger.error('初始化默认管理员失败:', error);
  }
};

export const validateRole = async (ctx: Context, role: string) => {
  // 验证管理员权限
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

  if (!user || user.role !== role) {
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
