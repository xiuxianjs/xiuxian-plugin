import React from 'react';
import { useLoginCode } from './Login.code';

// 导入UI组件库
import { XiuxianLoginCard, XiuxianAlert, XiuxianInputWithIcon, XiuxianDivider } from '@/components/ui';

export default function Login() {
  const { loading, error, handleSubmit } = useLoginCode();

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8'>
      <div className='relative z-10 w-full max-w-md mx-auto'>
        {/* 登录卡片 */}
        <XiuxianLoginCard>
          <div className='text-center mb-6'>
            <h2 className='text-white text-xl sm:text-2xl font-semibold mb-2'>管理员登录</h2>
            <p className='text-slate-400 text-sm sm:text-base'>请输入您的管理员账号和密码</p>
          </div>

          {/* 错误提示 */}
          {error && <XiuxianAlert type='error' title='登录失败' message={error} />}

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
            <div>
              <label className='block text-slate-300 text-sm font-medium mb-2'>用户名</label>
              <XiuxianInputWithIcon icon='👤' type='text' name='username' placeholder='请输入管理员用户名' required minLength={3} />
            </div>

            <div>
              <label className='block text-slate-300 text-sm font-medium mb-2'>密码</label>
              <XiuxianInputWithIcon icon='🔒' type='password' name='password' placeholder='请输入密码' required minLength={6} />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full py-3 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base'
            >
              {loading ? (
                <div className='flex items-center justify-center space-x-2'>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  <span>登录中...</span>
                </div>
              ) : (
                <div className='flex items-center justify-center space-x-2'>
                  <span>🚪</span>
                  <span>登录</span>
                </div>
              )}
            </button>
          </form>

          {/* 分割线 */}
          <XiuxianDivider text='系统信息' />

          {/* 系统信息 */}
          <div className='text-center space-y-2'>
            <div className='flex justify-between text-xs sm:text-sm text-slate-400'>
              <span>系统版本:</span>
              <span className='text-white'>v1.3.0</span>
            </div>
            <div className='flex justify-between text-xs sm:text-sm text-slate-400'>
              <span>技术支持:</span>
              <span className='text-white'>lemonade-lab</span>
            </div>
          </div>
        </XiuxianLoginCard>

        {/* 底部信息 */}
        <div className='text-center mt-6'>
          <p className='text-slate-400 text-xs sm:text-sm'>© 2024 修仙管理系统.</p>
        </div>

        {/* 安全提示 */}
        <XiuxianAlert type='info' title='安全提醒' message='请确保在安全的环境下登录，不要在公共场所保存密码。' className='mt-4' />
      </div>
    </div>
  );
}
