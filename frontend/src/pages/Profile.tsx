import React from 'react'
import { useProfileCode } from './Profile.code'
import classNames from 'classnames'

export default function Profile() {
  const {
    activeTab,
    setActiveTab,
    loading,
    message,
    passwordForm,
    handlePasswordChange,
    handleInputChange,
    user
  } = useProfileCode()

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10 p-6 h-full overflow-y-auto">
        {/* 标签页导航 */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={classNames(
                'px-4 py-2 rounded-lg transition-all duration-200',
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              )}
            >
              👤 个人信息
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={classNames(
                'px-4 py-2 rounded-lg transition-all duration-200',
                activeTab === 'password'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              )}
            >
              🔒 修改密码
            </button>
          </div>

          {/* 个人信息标签页 */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 用户头像 */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-white text-3xl">👤</span>
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">
                      {user?.username || '管理员'}
                    </h3>
                    <p className="text-slate-400 text-sm">系统管理员</p>
                  </div>
                </div>

                {/* 基本信息 */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-white text-lg font-semibold mb-4">
                    基本信息
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">用户名</span>
                      <span className="text-white font-medium">
                        {user?.username || 'admin'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">角色</span>
                      <span className="text-purple-400 font-medium">
                        超级管理员
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">登录时间</span>
                      <span className="text-white font-medium">
                        {new Date().toLocaleString('zh-CN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">账户状态</span>
                      <span className="text-green-400 font-medium">正常</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 系统信息 */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg">
                <h3 className="text-white text-lg font-semibold mb-4">
                  系统信息
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">系统版本</span>
                      <span className="text-blue-400 font-medium">v1.0.0</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">运行状态</span>
                      <span className="text-green-400 font-medium">正常</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">最后更新</span>
                      <span className="text-purple-400 font-medium">
                        2024-01-15
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 修改密码标签页 */}
          {activeTab === 'password' && (
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg">
                <h3 className="text-white text-lg font-semibold mb-6 text-center">
                  修改密码
                </h3>

                {/* 消息提示 */}
                {message && (
                  <div
                    className={classNames(
                      'mb-6 rounded-xl p-4',
                      message.type === 'success'
                        ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30'
                        : 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={classNames(
                          'w-3 h-3 rounded-full',
                          message.type === 'success'
                            ? 'bg-green-400'
                            : 'bg-red-400'
                        )}
                      ></div>
                      <div>
                        <h3
                          className={classNames(
                            'font-semibold',
                            message.type === 'success'
                              ? 'text-green-400'
                              : 'text-red-400'
                          )}
                        >
                          {message.type === 'success' ? '成功' : '错误'}
                        </h3>
                        <p className="text-slate-300 text-sm">{message.text}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      当前密码
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-400 text-lg">🔒</span>
                      </div>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={handleInputChange('currentPassword')}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                        placeholder="请输入当前密码"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      新密码
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-400 text-lg">🔐</span>
                      </div>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={handleInputChange('newPassword')}
                        required
                        minLength={6}
                        className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                        placeholder="请输入新密码（至少6位）"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      确认新密码
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-400 text-lg">✅</span>
                      </div>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                        placeholder="请再次输入新密码"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        修改中...
                      </span>
                    ) : (
                      '修改密码'
                    )}
                  </button>
                </form>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl">
                  <h4 className="text-blue-400 font-semibold mb-2">
                    密码安全提示
                  </h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• 密码长度至少6位</li>
                    <li>• 建议包含字母、数字和特殊字符</li>
                    <li>• 定期更换密码以提高安全性</li>
                    <li>• 不要使用与其他账户相同的密码</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
