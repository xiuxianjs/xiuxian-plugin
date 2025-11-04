import React, { PropsWithChildren } from 'react';
import { Spin } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionContext';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, requiredPermissions = [], requiredRoles = [], fallback = null }: PropsWithChildren<ProtectedRouteProps>) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 安全地获取权限上下文
  let user = null;
  let hasAnyPermission = (_permissions: any[]) => false;
  let canAccessRoute = (_route: string) => true;

  try {
    const permissions = usePermissions();

    user = permissions.user;
    hasAnyPermission = permissions.hasAnyPermission;
    canAccessRoute = permissions.canAccessRoute;
  } catch (error) {
    console.error(error);
    // 如果权限上下文不存在，使用默认值
    console.warn('PermissionProvider not found, using default permissions');
  }

  // 显示加载状态
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <Spin size='large' />
          <div className='mt-4 text-gray-500'>加载中...</div>
        </div>
      </div>
    );
  }

  // 未登录，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // 检查路由权限
  const currentRoute = location.pathname;

  if (!canAccessRoute(currentRoute)) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>🚫</div>
          <h1 className='text-2xl font-bold text-white mb-2'>访问被拒绝</h1>
          <p className='text-slate-400 mb-4'>您没有权限访问此页面</p>
          <button onClick={() => window.history.back()} className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'>
            返回上一页
          </button>
        </div>
      </div>
    );
  }

  // 检查特定权限
  if (requiredPermissions.length > 0 && !hasAnyPermission(requiredPermissions as any)) {
    return <>{fallback}</>;
  }

  // 检查角色权限
  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// 权限路由守卫Hook
export function useRoutePermission(route: string) {
  try {
    const { canAccessRoute } = usePermissions();

    return canAccessRoute(route);
  } catch (error) {
    console.error(error);
    console.warn('PermissionProvider not found, allowing access');

    return true;
  }
}

// 权限检查Hook
export function usePermissionCheck(permission: string) {
  try {
    const { hasPermission } = usePermissions();

    return hasPermission(permission as any);
  } catch (error) {
    console.error(error);
    console.warn('PermissionProvider not found, denying permission');

    return false;
  }
}
