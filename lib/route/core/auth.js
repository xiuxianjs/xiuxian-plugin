import { getIoRedis } from '@alemonjs/db';
import '../../model/api.js';
import { keys } from '../../model/keys.js';
import 'alemonjs';
import 'dayjs';
import '../../model/DataList.js';
import '../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../resources/img/state.jpg.js';
import '../../resources/styles/tw.scss.js';
import '../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../resources/img/player.jpg.js';
import '../../resources/img/player_footer.png.js';
import '../../resources/img/user_state.png.js';
import '../../resources/img/fairyrealm.jpg.js';
import '../../resources/img/card.jpg.js';
import '../../resources/img/road.jpg.js';
import '../../resources/img/user_state2.png.js';
import '../../resources/html/help.js';
import '../../resources/img/najie.jpg.js';
import '../../resources/img/shituhelp.jpg.js';
import '../../resources/img/icon.png.js';
import '../../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../model/message.js';

const redis = getIoRedis();
var Permission;
(function (Permission) {
    Permission["USER_VIEW"] = "user:view";
    Permission["USER_CREATE"] = "user:create";
    Permission["USER_UPDATE"] = "user:update";
    Permission["USER_DELETE"] = "user:delete";
    Permission["USER_ROLE_MANAGE"] = "user:role_manage";
    Permission["SYSTEM_CONFIG"] = "system:config";
    Permission["SYSTEM_TASKS"] = "system:tasks";
    Permission["GAME_USERS"] = "game:users";
    Permission["GAME_ASSOCIATIONS"] = "game:associations";
    Permission["GAME_NAJIE"] = "game:najie";
    Permission["GAME_RANKINGS"] = "game:rankings";
    Permission["GAME_CURRENCY"] = "game:currency";
    Permission["GAME_DATA_QUERY"] = "game:data_query";
    Permission["MESSAGE_MANAGE"] = "message:manage";
    Permission["MUTE_MANAGE"] = "mute:manage";
    Permission["PROFILE_VIEW"] = "profile:view";
    Permission["PROFILE_UPDATE"] = "profile:update";
})(Permission || (Permission = {}));
const ROLE_PERMISSIONS = {
    super_admin: [
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
        Permission.SYSTEM_CONFIG,
        Permission.SYSTEM_TASKS,
        Permission.GAME_DATA_QUERY,
        Permission.PROFILE_VIEW,
        Permission.PROFILE_UPDATE
    ],
    team_member: [
        Permission.PROFILE_VIEW,
        Permission.PROFILE_UPDATE
    ]
};
const ROLE_INFO = {
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
            return { success: false, error: 'USERNAME_EXISTS' };
        }
        if (role === 'super_admin') {
            const hasSuperAdminUser = await hasSuperAdmin();
            if (hasSuperAdminUser) {
                logger.warn('超级管理员已存在，无法创建新的超级管理员');
                return { success: false, error: 'SUPER_ADMIN_EXISTS' };
            }
        }
        const user = {
            id: generateUserId(),
            username,
            password,
            role,
            status: 'active',
            createdAt: Date.now()
        };
        await redis.set(keys.serverUser(user.id), JSON.stringify(user));
        await redis.set(keys.serverUsername(user.username), user.id);
        return { success: true, user };
    }
    catch (error) {
        logger.error('创建用户失败:', error);
        return { success: false, error: 'UNKNOWN_ERROR' };
    }
};
const getUserByUsername = async (username) => {
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
    }
    catch (error) {
        logger.error('获取用户失败:', error);
        return null;
    }
};
const getUserById = async (id) => {
    try {
        const userData = await redis.get(keys.serverUser(id));
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
const hasSuperAdmin = async () => {
    try {
        const userKeys = await redis.keys(keys.serverUser('*'));
        for (const key of userKeys) {
            const userData = await redis.get(key);
            if (userData) {
                const user = JSON.parse(userData);
                if (user.role === 'super_admin') {
                    return true;
                }
            }
        }
        return false;
    }
    catch (error) {
        logger.error('检查超级管理员失败:', error);
        return false;
    }
};
const updateUserRole = async (userId, newRole) => {
    try {
        const user = await getUserById(userId);
        if (!user) {
            return false;
        }
        if (user.role === 'super_admin') {
            logger.warn('超级管理员角色不能被修改');
            return false;
        }
        if (newRole === 'super_admin') {
            const hasSuperAdminUser = await hasSuperAdmin();
            if (hasSuperAdminUser) {
                logger.warn('超级管理员已存在，无法设置新的超级管理员');
                return false;
            }
        }
        user.role = newRole;
        await redis.set(keys.serverUser(userId), JSON.stringify(user));
        return true;
    }
    catch (error) {
        logger.error('更新用户角色失败:', error);
        return false;
    }
};
const deleteUser = async (userId) => {
    try {
        const user = await getUserById(userId);
        if (!user) {
            return false;
        }
        if (user.role === 'super_admin') {
            logger.warn('超级管理员不能被删除');
            return false;
        }
        await redis.del(keys.serverUser(userId));
        await redis.del(keys.serverUsername(user.username));
        return true;
    }
    catch (error) {
        logger.error('删除用户失败:', error);
        return false;
    }
};
const getAllUsers = async () => {
    try {
        const userKeys = await redis.keys(keys.serverUser('*'));
        const users = [];
        for (const key of userKeys) {
            const userData = await redis.get(key);
            if (userData) {
                const user = JSON.parse(userData);
                users.push(user);
            }
        }
        return users;
    }
    catch (error) {
        logger.error('获取所有用户失败:', error);
        return [];
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
        await redis.set(keys.serverUser(user.id), JSON.stringify(user));
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
        const sessionData = await redis.get(keys.serverSession(token));
        if (!sessionData) {
            return null;
        }
        const session = JSON.parse(sessionData);
        const user = await getUserById(session.userId);
        if (!user) {
            await redis.del(keys.serverSession(token));
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
        await redis.del(keys.serverSession(token));
        return true;
    }
    catch (error) {
        logger.error('登出失败:', error);
        return false;
    }
};
const setUserPassword = async (userId, password) => {
    try {
        const user = await getUserById(userId);
        if (!user) {
            return false;
        }
        user.password = password;
        await redis.set(keys.serverUser(userId), JSON.stringify(user));
        return true;
    }
    catch (error) {
        logger.error('更新用户密码失败:', error);
        return false;
    }
};
const initDefaultAdmin = async () => {
    try {
        const hasSuperAdminUser = await hasSuperAdmin();
        if (!hasSuperAdminUser) {
            const result = await createUser('lemonade', '123456', 'super_admin');
            if (result.success && result.user) {
                logger.info('默认超级管理员创建成功: lemonade');
            }
            else {
                logger.error('创建默认超级管理员失败:', result.error);
            }
        }
        else {
            logger.info('超级管理员已存在，跳过初始化');
        }
    }
    catch (error) {
        logger.error('初始化默认管理员失败:', error);
    }
};
const validatePermission = async (ctx, requiredPermissions) => {
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
    const userPermissions = getUserPermissionsByRole(user.role);
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
const validateRole = async (ctx, requiredRoles) => {
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
const getUserPermissionsByRole = (role) => {
    return ROLE_PERMISSIONS[role] || [];
};
const getRoleInfo = (role) => {
    return ROLE_INFO[role] || null;
};
const hasPermission = (userRole, permission) => {
    const userPermissions = getUserPermissionsByRole(userRole);
    return userPermissions.includes(permission);
};
const hasAnyPermission = (userRole, permissions) => {
    const userPermissions = getUserPermissionsByRole(userRole);
    return permissions.some(permission => userPermissions.includes(permission));
};
const hasAllPermissions = (userRole, permissions) => {
    const userPermissions = getUserPermissionsByRole(userRole);
    return permissions.every(permission => userPermissions.includes(permission));
};

export { Permission, ROLE_INFO, ROLE_PERMISSIONS, createUser, deleteUser, getAllUsers, getRoleInfo, getUserById, getUserByUsername, getUserPermissionsByRole, hasAllPermissions, hasAnyPermission, hasPermission, hasSuperAdmin, initDefaultAdmin, logout, setUserPassword, updateUserRole, validateLogin, validatePermission, validateRole, validateToken };
