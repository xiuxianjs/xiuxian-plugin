import React, { PropsWithChildren } from 'react';
import { usePermissions } from '@/contexts/PermissionContext';
import { Permission } from '@/types/permissions';

// 权限守卫组件
interface PermissionGuardProps {
  permission: Permission;
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

export function PermissionGuard({ permission, fallback = null, children }: PropsWithChildren<PermissionGuardProps>) {
  let hasPermission = (perm: Permission) => false;

  try {
    const permissions = usePermissions();

    hasPermission = permissions.hasPermission;
  } catch (error) {
    console.warn('PermissionProvider not found, denying permission');
  }

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// 多权限守卫组件
interface MultiPermissionGuardProps {
  permissions: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export function MultiPermissionGuard({ permissions, requireAll = false, fallback = null, children }: PropsWithChildren<MultiPermissionGuardProps>) {
  let hasAnyPermission = (permissions: Permission[]) => false;
  let hasAllPermissions = (permissions: Permission[]) => false;

  try {
    const permissionContext = usePermissions();

    hasAnyPermission = permissionContext.hasAnyPermission;
    hasAllPermissions = permissionContext.hasAllPermissions;
  } catch (error) {
    console.warn('PermissionProvider not found, denying permission');
  }

  const hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// 角色守卫组件
interface RoleGuardProps {
  roles: string[];
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

export function RoleGuard({ roles, requireAll = false, fallback = null, children }: PropsWithChildren<RoleGuardProps>) {
  let user = null;

  try {
    const permissions = usePermissions();

    user = permissions.user;
  } catch (error) {
    console.warn('PermissionProvider not found, denying access');
  }

  if (!user) {
    return <>{fallback}</>;
  }

  const hasRole = requireAll ? roles.every(role => user.role === role) : roles.includes(user.role);

  if (!hasRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// 路由权限守卫组件
interface RouteGuardProps {
  route: string;
  fallback?: React.ReactNode;
}

export function RouteGuard({ route, fallback = null, children }: PropsWithChildren<RouteGuardProps>) {
  let canAccessRoute = (route: string) => true;

  try {
    const permissions = usePermissions();

    canAccessRoute = permissions.canAccessRoute;
  } catch (error) {
    console.warn('PermissionProvider not found, allowing access');
  }

  if (!canAccessRoute(route)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// 页面权限守卫组件
interface PageGuardProps {
  page: string;
  fallback?: React.ReactNode;
}

export function PageGuard({ page, fallback = null, children }: PropsWithChildren<PageGuardProps>) {
  let canAccessPage = (page: string) => true;

  try {
    const permissions = usePermissions();

    canAccessPage = permissions.canAccessPage;
  } catch (error) {
    console.warn('PermissionProvider not found, allowing access');
  }

  if (!canAccessPage(page)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// 权限检查Hook组件
interface PermissionCheckProps {
  permission: Permission;
  children: (hasPermission: boolean) => React.ReactNode;
}

export function PermissionCheck({ permission, children }: PermissionCheckProps) {
  let hasPermission = (perm: Permission) => false;

  try {
    const permissions = usePermissions();

    hasPermission = permissions.hasPermission;
  } catch (error) {
    console.warn('PermissionProvider not found, denying permission');
  }

  return <>{children(hasPermission(permission))}</>;
}

// 角色检查Hook组件
interface RoleCheckProps {
  roles: string[];
  children: (hasRole: boolean) => React.ReactNode;
  requireAll?: boolean;
}

export function RoleCheck({ roles, requireAll = false, children }: RoleCheckProps) {
  let user = null;

  try {
    const permissions = usePermissions();

    user = permissions.user;
  } catch (error) {
    console.warn('PermissionProvider not found, denying access');
  }

  if (!user) {
    return <>{children(false)}</>;
  }

  const hasRole = requireAll ? roles.every(role => user.role === role) : roles.includes(user.role);

  return <>{children(hasRole)}</>;
}
