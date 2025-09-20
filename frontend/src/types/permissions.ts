// 权限管理系统类型定义

// 用户角色枚举
export enum UserRole {
  SUPER_ADMIN = 'super_admin', // 超级管理员
  ADMIN = 'admin', // 管理员
  OPERATOR = 'operator', // 运营人员
  DEVELOPER = 'developer', // 开发人员
  TEAM_MEMBER = 'team_member' // 普通人员
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
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
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
  [UserRole.ADMIN]: [
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
  [UserRole.OPERATOR]: [
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
  [UserRole.DEVELOPER]: [
    // 开发人员权限
    Permission.SYSTEM_CONFIG,
    Permission.SYSTEM_TASKS,
    Permission.GAME_DATA_QUERY,
    Permission.PROFILE_VIEW,
    Permission.PROFILE_UPDATE
  ],
  [UserRole.TEAM_MEMBER]: [
    // 普通人员权限
    Permission.PROFILE_VIEW,
    Permission.PROFILE_UPDATE
  ]
};

// 角色信息
export interface RoleInfo {
  role: UserRole;
  name: string;
  description: string;
  color: string;
  icon: string;
}

// 角色信息映射
export const ROLE_INFO: Record<UserRole, RoleInfo> = {
  [UserRole.SUPER_ADMIN]: {
    role: UserRole.SUPER_ADMIN,
    name: '超级管理员',
    description: '拥有系统所有权限，可以管理所有用户和系统设置',
    color: 'red',
    icon: '👑'
  },
  [UserRole.ADMIN]: {
    role: UserRole.ADMIN,
    name: '管理员',
    description: '拥有大部分管理权限，可以管理用户和游戏数据',
    color: 'purple',
    icon: '🛡️'
  },
  [UserRole.OPERATOR]: {
    role: UserRole.OPERATOR,
    name: '运营人员',
    description: '负责系统运营和游戏数据管理',
    color: 'blue',
    icon: '⚙️'
  },
  [UserRole.DEVELOPER]: {
    role: UserRole.DEVELOPER,
    name: '开发人员',
    description: '负责系统开发和配置管理',
    color: 'green',
    icon: '💻'
  },
  [UserRole.TEAM_MEMBER]: {
    role: UserRole.TEAM_MEMBER,
    name: '普通人员',
    description: '基础权限，只能查看和修改个人资料',
    color: 'gray',
    icon: '👤'
  }
};

// 扩展的用户接口
export interface AdminUser {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: number;
  lastLoginAt?: number;
  createdBy?: string;
  permissions?: Permission[];
  avatar?: string;
  realName?: string;
  department?: string;
  phone?: string;
}

// 用户创建/更新表单
export interface UserFormData {
  username: string;
  email?: string;
  password?: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  realName?: string;
  department?: string;
  phone?: string;
}

// 权限检查结果
export interface PermissionCheck {
  hasPermission: boolean;
  reason?: string;
}

// 权限管理上下文类型
export interface PermissionContextType {
  user: AdminUser | null;
  permissions: Permission[];
  loading: boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canAccessRoute: (route: string) => boolean;
  canAccessPage: (page: string) => boolean;
  refreshPermissions: () => Promise<void>;
}

// 路由权限映射
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  '/': [], // 数据板，所有登录用户都可以访问
  '/users': [Permission.GAME_USERS], // 游戏用户管理
  '/admin-users': [Permission.USER_VIEW], // 管理员用户管理
  '/config': [Permission.SYSTEM_CONFIG], // 系统配置
  '/tasks': [Permission.SYSTEM_TASKS], // 任务管理
  '/associations': [Permission.GAME_ASSOCIATIONS], // 宗门管理
  '/najie': [Permission.GAME_NAJIE], // 背包管理
  '/rankings': [Permission.GAME_RANKINGS], // 排行榜管理
  '/currency': [Permission.GAME_CURRENCY], // 货币管理
  '/data-query': [Permission.GAME_DATA_QUERY], // 数据查询
  '/messages': [Permission.MESSAGE_MANAGE], // 消息管理
  '/mute': [Permission.MUTE_MANAGE], // 禁言管理
  '/profile': [Permission.PROFILE_VIEW] // 个人资料
};

// 页面权限映射
export const PAGE_PERMISSIONS: Record<string, Permission[]> = {
  'user-management': [Permission.USER_VIEW],
  'system-config': [Permission.SYSTEM_CONFIG],
  'task-management': [Permission.SYSTEM_TASKS],
  'game-user-management': [Permission.GAME_USERS],
  'association-management': [Permission.GAME_ASSOCIATIONS],
  'najie-management': [Permission.GAME_NAJIE],
  'ranking-management': [Permission.GAME_RANKINGS],
  'currency-management': [Permission.GAME_CURRENCY],
  'data-query': [Permission.GAME_DATA_QUERY],
  'message-management': [Permission.MESSAGE_MANAGE],
  'mute-management': [Permission.MUTE_MANAGE],
  profile: [Permission.PROFILE_VIEW]
};
