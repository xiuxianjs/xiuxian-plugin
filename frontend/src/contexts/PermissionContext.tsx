import { createContext, useContext, useMemo, PropsWithChildren, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Permission, UserRole, ROLE_PERMISSIONS, ROUTE_PERMISSIONS, PAGE_PERMISSIONS, PermissionContextType, AdminUser } from '@/types/permissions';
import { getCurrentUserPermissions, UserPermissionsResponse } from '@/api/auth/user-permissions';

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 将普通User转换为AdminUser（这里需要根据实际API调整）
  const adminUser: AdminUser | null = useMemo(() => {
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role as UserRole,
      status: 'active',
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    };
  }, [user]);

  // 从后端获取用户权限
  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!user) {
        setUserPermissions([]);

        return;
      }

      try {
        setLoading(true);
        const response = await getCurrentUserPermissions();

        setUserPermissions(response.permissions);
      } catch (error) {
        console.error('获取用户权限失败:', error);
        // 如果后端获取失败，使用前端默认权限配置
        if (adminUser) {
          setUserPermissions(ROLE_PERMISSIONS[adminUser.role] || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserPermissions();
  }, [user, adminUser]);

  // 获取用户权限
  const permissions = useMemo(() => {
    if (!adminUser) {
      return [];
    }

    // 优先使用从后端获取的权限，如果为空则使用前端默认配置
    if (userPermissions.length > 0) {
      return userPermissions as Permission[];
    }

    return ROLE_PERMISSIONS[adminUser.role] || [];
  }, [adminUser, userPermissions]);

  // 检查是否有特定权限
  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  // 检查是否有任意一个权限
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  // 检查是否有所有权限
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  // 检查是否可以访问特定路由
  const canAccessRoute = (route: string): boolean => {
    const routePermissions = ROUTE_PERMISSIONS[route];

    if (!routePermissions || routePermissions.length === 0) {
      return true; // 没有权限要求的路由默认可以访问
    }

    return hasAnyPermission(routePermissions);
  };

  // 检查是否可以访问特定页面
  const canAccessPage = (page: string): boolean => {
    const pagePermissions = PAGE_PERMISSIONS[page];

    if (!pagePermissions || pagePermissions.length === 0) {
      return true; // 没有权限要求的页面默认可以访问
    }

    return hasAnyPermission(pagePermissions);
  };

  // 刷新权限
  const refreshPermissions = async () => {
    if (!user) {
      setUserPermissions([]);

      return;
    }

    try {
      setLoading(true);
      const response = await getCurrentUserPermissions();

      setUserPermissions(response.permissions);
    } catch (error) {
      console.error('刷新用户权限失败:', error);
      // 如果后端获取失败，使用前端默认权限配置
      if (adminUser) {
        setUserPermissions(ROLE_PERMISSIONS[adminUser.role] || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const value: PermissionContextType = {
    user: adminUser,
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    canAccessPage,
    refreshPermissions
  };

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermissions() {
  const context = useContext(PermissionContext);

  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }

  return context;
}

// 权限检查Hook
export function usePermissionCheck(permission: Permission) {
  const { hasPermission } = usePermissions();

  return hasPermission(permission);
}

// 多权限检查Hook
export function usePermissionsCheck(permissions: Permission[], requireAll = false) {
  const { hasAnyPermission, hasAllPermissions } = usePermissions();

  return requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
}

// 路由权限检查Hook
export function useRoutePermission(route: string) {
  const { canAccessRoute } = usePermissions();

  return canAccessRoute(route);
}

// 页面权限检查Hook
export function usePagePermission(page: string) {
  const { canAccessPage } = usePermissions();

  return canAccessPage(page);
}
