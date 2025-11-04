import { Outlet } from 'react-router-dom';
import classNames from 'classnames';
import { Dropdown, Button, Space, Avatar } from 'antd';
import { menuItems } from '@/config';
import { useAppCode } from './App.code';
import { usePermissions } from '@/contexts/PermissionContext';

// 内部菜单组件
function AppContent() {
  const { user, navigate, sidebarCollapsed, isMobile, mobileMenuOpen, handleLogout, toggleSidebar, closeMobileMenu } = useAppCode();
  const { hasPermission } = usePermissions();

  // 过滤有权限的菜单项
  const visibleMenuItems = menuItems.filter(item => !item.permission || hasPermission(item.permission));

  return (
    <div className='h-full'>
      {/* 移动端遮罩层 */}
      {isMobile && mobileMenuOpen && <div className='fixed inset-0 z-40 lg:hidden' onClick={closeMobileMenu} />}

      {/* 侧边栏 */}
      <div
        className={classNames('fixed left-0 top-0 h-full z-50 transition-all duration-300 bg-slate-300', {
          // 桌面端
          'w-16': !isMobile && sidebarCollapsed,
          'w-48': !isMobile && !sidebarCollapsed,
          // 移动端
          'w-48 transform': isMobile,
          '-translate-x-full': isMobile && !mobileMenuOpen,
          'translate-x-0': isMobile && mobileMenuOpen
        })}
      >
        <div className='h-full'>
          {/* Logo区域 */}
          <div className='h-20 flex items-center justify-center px-4'>
            <div className='w-12 h-12 flex items-center justify-center flex-shrink-0'>
              <span>👑</span>
            </div>
            {(!sidebarCollapsed || isMobile) && (
              <div className='ml-3 min-w-0'>
                <div className='truncate'>修仙MIS</div>
                <div className='text-xs'>管理系统</div>
              </div>
            )}
          </div>

          {/* 导航菜单 */}
          <nav className='px-3 py-2 flex-1 overflow-y-auto max-h-[calc(100vh-5rem)]'>
            {visibleMenuItems.map(item => (
              <button
                key={item.path}
                onClick={() => {
                  void navigate(item.path);
                  closeMobileMenu();
                }}
                className='w-full mb-2'
              >
                <div className='flex items-center px-3 py-3'>
                  <div className='text-lg flex-shrink-0'>{item.icon}</div>
                  {(!sidebarCollapsed || isMobile) && <span className='ml-3 truncate'>{item.label}</span>}
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 主内容区域 */}
      <div
        className={classNames('h-full transition-all duration-300 flex flex-col', {
          // 桌面端
          'ml-16': !isMobile && sidebarCollapsed,
          'ml-48': !isMobile && !sidebarCollapsed,
          // 移动端
          'ml-0': isMobile
        })}
      >
        {/* 固定顶部导航栏 */}
        <header
          className={classNames('fixed top-0 right-0 z-40 h-20', {
            // 桌面端
            'left-16': !isMobile && sidebarCollapsed,
            'left-48': !isMobile && !sidebarCollapsed,
            // 移动端
            'left-0': isMobile
          })}
        >
          <div className='h-full flex items-center justify-between px-4 sm:px-6'>
            <div className='flex items-center space-x-4'>
              <button onClick={toggleSidebar} className='p-2'>
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                </svg>
              </button>
            </div>

            <div className='flex items-center'>
              <Dropdown
                menu={{
                  items: [
                    { key: 'profile', label: '个人设置' },
                    { key: 'logout', label: '退出登录' }
                  ],
                  onClick: ({ key }) => {
                    if (key === 'profile') {
                      void navigate('/profile');
                    } else if (key === 'logout') {
                      void handleLogout();
                    }
                  }
                }}
                trigger={['click']}
              >
                <Button>
                  <Space>
                    <Avatar size={24}>👤</Avatar>
                    <span className='hidden sm:block truncate max-w-24'>{user?.username ?? '管理员'}</span>
                  </Space>
                </Button>
              </Dropdown>
            </div>
          </div>
        </header>

        {/* 主内容区域 - 添加顶部边距避免被固定header遮挡 */}
        <main className='flex-1 overflow-y-auto pt-20'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// 主应用组件
export default function App() {
  return <AppContent />;
}
