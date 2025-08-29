import React from 'react';
import { useProfileCode } from './Profile.code';
import classNames from 'classnames';

// 导入UI组件库
import { XiuxianPageWrapper, XiuxianPageTitle, XiuxianTabGroup, XiuxianInfoCard } from '@/components/ui';

export default function Profile() {
  const { activeTab, setActiveTab, loading, message, passwordForm, handlePasswordChange, handleInputChange, user } = useProfileCode();

  // 构建标签页数据
  const tabs = [
    {
      name: 'profile',
      icon: '👤',
      content: (
        <div className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* 用户头像 */}
            <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg'>
              <div className='text-center'>
                <div className='w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg'>
                  <span className='text-white text-3xl'>👤</span>
                </div>
                <h3 className='text-white text-xl font-semibold mb-2'>{user?.username || '管理员'}</h3>
                <p className='text-slate-400 text-sm'>系统管理员</p>
              </div>
            </div>

            {/* 基本信息 */}
            <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg'>
              <h3 className='text-white text-lg font-semibold mb-4'>基本信息</h3>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-slate-400'>用户名</span>
                  <span className='text-white font-medium'>{user?.username || 'admin'}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-slate-400'>角色</span>
                  <span className='text-purple-400 font-medium'>超级管理员</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-slate-400'>登录时间</span>
                  <span className='text-white font-medium'>{new Date().toLocaleString('zh-CN')}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-slate-400'>账户状态</span>
                  <span className='text-green-400 font-medium'>正常</span>
                </div>
              </div>
            </div>
          </div>

          {/* 系统信息 */}
          <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg'>
            <h3 className='text-white text-lg font-semibold mb-4'>系统信息</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <XiuxianInfoCard label='系统版本' value='v1.3.0' gradient='blue' />
              <XiuxianInfoCard label='Node.js版本' value='v18.17.0' gradient='green' />
              <XiuxianInfoCard label='数据库版本' value='MySQL 8.0' gradient='purple' />
            </div>
          </div>
        </div>
      )
    },
    {
      name: 'password',
      icon: '🔒',
      content: (
        <div className='space-y-6'>
          <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg'>
            <h3 className='text-white text-lg font-semibold mb-4'>修改密码</h3>
            <form className='space-y-4'>
              <div>
                <label className='block text-slate-300 text-sm font-medium mb-2'>当前密码</label>
                <input
                  type='password'
                  name='currentPassword'
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className='w-full p-3 xiuxian-input rounded-lg'
                  placeholder='请输入当前密码'
                  required
                />
              </div>
              <div>
                <label className='block text-slate-300 text-sm font-medium mb-2'>新密码</label>
                <input
                  type='password'
                  name='newPassword'
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className='w-full p-3 xiuxian-input rounded-lg'
                  placeholder='请输入新密码'
                  required
                />
              </div>
              <div>
                <label className='block text-slate-300 text-sm font-medium mb-2'>确认新密码</label>
                <input
                  type='password'
                  name='confirmPassword'
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className='w-full p-3 xiuxian-input rounded-lg'
                  placeholder='请再次输入新密码'
                  required
                />
              </div>
              <button
                type='submit'
                disabled={loading}
                className='w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? '修改中...' : '修改密码'}
              </button>
            </form>
          </div>
        </div>
      )
    }
  ];

  return (
    <XiuxianPageWrapper>
      {/* 页面标题 */}
      <XiuxianPageTitle icon='👤' title='个人设置' subtitle='管理您的个人信息和账户设置' />

      {/* 标签页组 */}
      <XiuxianTabGroup tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </XiuxianPageWrapper>
  );
}
