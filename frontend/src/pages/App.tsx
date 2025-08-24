import React from 'react'
import { Outlet } from 'react-router-dom'
import classNames from 'classnames'
import { menuItems } from '@/config'
import { useAppCode } from './App.code'

export default function App() {
  const {
    user,
    navigate,
    sidebarCollapsed,
    isMobile,
    mobileMenuOpen,
    handleLogout,
    toggleSidebar,
    closeMobileMenu
  } = useAppCode()

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 移动端遮罩层 */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* 侧边栏 */}
      <div
        className={classNames(
          'fixed left-0 top-0 h-full z-50 transition-all duration-300',
          {
            // 桌面端
            'w-16': !isMobile && sidebarCollapsed,
            'w-48': !isMobile && !sidebarCollapsed,
            // 移动端
            'w-48 transform': isMobile,
            '-translate-x-full': isMobile && !mobileMenuOpen,
            'translate-x-0': isMobile && mobileMenuOpen
          }
        )}
      >
        <div className="h-full bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl">
          {/* Logo区域 */}
          <div className="h-20 flex items-center justify-center border-b border-slate-700/50 px-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white text-xl">👑</span>
            </div>
            {(!sidebarCollapsed || isMobile) && (
              <div className="ml-3 min-w-0">
                <div className="text-white font-bold text-lg truncate">
                  修仙MIS
                </div>
                <div className="text-slate-400 text-xs">管理系统</div>
              </div>
            )}
          </div>

          {/* 导航菜单 */}
          <nav className="px-3 py-2 flex-1 overflow-y-auto max-h-[calc(100vh-5rem)]">
            {menuItems.map(item => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  closeMobileMenu()
                }}
                className="w-full mb-2 group relative overflow-hidden"
              >
                <div className="flex items-center px-3 py-3 text-slate-300 hover:text-white transition-all duration-200 rounded-xl hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 border border-transparent hover:border-purple-500/30">
                  <div className="text-lg flex-shrink-0">{item.icon}</div>
                  {(!sidebarCollapsed || isMobile) && (
                    <span className="ml-3 font-medium truncate">
                      {item.label}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 主内容区域 */}
      <div
        className={classNames(
          'h-full transition-all duration-300 flex flex-col',
          {
            // 桌面端
            'ml-16': !isMobile && sidebarCollapsed,
            'ml-48': !isMobile && !sidebarCollapsed,
            // 移动端
            'ml-0': isMobile
          }
        )}
      >
        {/* 固定顶部导航栏 */}
        <header
          className={classNames(
            'fixed top-0 right-0 z-40 h-20 bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-b border-slate-700/50 shadow-lg transition-all duration-300',
            {
              // 桌面端
              'left-16': !isMobile && sidebarCollapsed,
              'left-48': !isMobile && !sidebarCollapsed,
              // 移动端
              'left-0': isMobile
            }
          )}
        >
          <div className="h-full flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-600/50 transition-all duration-200 border border-slate-600/50">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                    👤
                  </div>
                  <span className="hidden sm:block truncate max-w-24">
                    {user?.username || '管理员'}
                  </span>
                  <span className="hidden sm:block">▼</span>
                </button>

                <div className="absolute z-10 right-0 top-full w-48 bg-slate-800/95 backdrop-blur-xl rounded-lg shadow-xl border border-slate-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200"
                    >
                      👤 个人设置
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200"
                    >
                      🚪 退出登录
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 主内容区域 - 添加顶部边距避免被固定header遮挡 */}
        <main className="flex-1 overflow-y-auto pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
