import { getIoRedis } from '@alemonjs/db';
import { KEY_USER_PREFIX, KEY_SESSION_PREFIX } from './config.js';

const redis = getIoRedis();
const generateUserId = () => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
const generateToken = () => {
    return `token_${Date.now()}_${Math.random().toString(36).substr(2, 15)}`;
};
const createUser = async (username, password, role = 'admin') => {
    try {
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return null;
        }
        const user = {
            id: generateUserId(),
            username,
            password,
            role,
            createdAt: Date.now()
        };
        await redis.set(`${KEY_USER_PREFIX}${user.id}`, JSON.stringify(user));
        await redis.set(`${KEY_USER_PREFIX}username:${username}`, user.id);
        return user;
    }
    catch (error) {
        logger.error('创建用户失败:', error);
        return null;
    }
};
const getUserByUsername = async (username) => {
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
    }
    catch (error) {
        logger.error('获取用户失败:', error);
        return null;
    }
};
const getUserById = async (id) => {
    try {
        const userData = await redis.get(`${KEY_USER_PREFIX}${id}`);
        if (!userData) {
            return null;
        }
        return JSON.parse(userData);
    }
    catch (error) {
        logger.error('获取用户失败:', error);
        return null;
    }
};
const validateLogin = async (username, password) => {
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
        const token = generateToken();
        user.lastLoginAt = Date.now();
        await redis.set(`${KEY_USER_PREFIX}${user.id}`, JSON.stringify(user));
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
    }
    catch (error) {
        logger.error('登录验证失败:', error);
        return {
            success: false,
            message: '登录失败，请重试'
        };
    }
};
const validateToken = async (token) => {
    try {
        const sessionData = await redis.get(`${KEY_SESSION_PREFIX}${token}`);
        if (!sessionData) {
            return null;
        }
        const session = JSON.parse(sessionData);
        const user = await getUserById(session.userId);
        if (!user) {
            await redis.del(`${KEY_SESSION_PREFIX}${token}`);
            return null;
        }
        return user;
    }
    catch (error) {
        logger.error('验证token失败:', error);
        return null;
    }
};
const logout = async (token) => {
    try {
        await redis.del(`${KEY_SESSION_PREFIX}${token}`);
        return true;
    }
    catch (error) {
        logger.error('登出失败:', error);
        return false;
    }
};
const getAllUsers = async () => {
    try {
        const keys = await redis.keys(`${KEY_USER_PREFIX}*`);
        const users = [];
        for (const key of keys) {
            if (!key.includes('username:')) {
                const userData = await redis.get(key);
                if (userData) {
                    users.push(JSON.parse(userData));
                }
            }
        }
        return users;
    }
    catch (error) {
        logger.error('获取所有用户失败:', error);
        return [];
    }
};
const setUserPassword = async (userId, password) => {
    try {
        const user = await getUserById(userId);
        if (!user) {
            return false;
        }
        user.password = password;
        await redis.set(`${KEY_USER_PREFIX}${userId}`, JSON.stringify(user));
        return true;
    }
    catch (error) {
        logger.error('更新用户密码失败:', error);
        return false;
    }
};
const deleteUser = async (userId) => {
    try {
        const user = await getUserById(userId);
        if (!user) {
            return false;
        }
        await redis.del(`${KEY_USER_PREFIX}${userId}`);
        await redis.del(`${KEY_USER_PREFIX}username:${user.username}`);
        return true;
    }
    catch (error) {
        logger.error('删除用户失败:', error);
        return false;
    }
};
const initDefaultAdmin = async () => {
    try {
        const adminUser = await getUserByUsername('lemonade');
        if (!adminUser) {
            await createUser('lemonade', '123456', 'admin');
        }
    }
    catch (error) {
        logger.error('初始化默认管理员失败:', error);
    }
};
const validateRole = async (ctx, role) => {
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

export { createUser, deleteUser, getAllUsers, getUserById, getUserByUsername, initDefaultAdmin, logout, setUserPassword, validateLogin, validateRole, validateToken };
