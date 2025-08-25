import React from 'react';
import { Breadcrumb, Spin, Empty, List, Avatar } from 'antd';
import { ArrowLeftOutlined, FolderOutlined, FileOutlined } from '@ant-design/icons';
import { useCommandManagerCode } from './CommandManager.code';

// 导入UI组件库
import {
  XiuxianPageWrapper,
  XiuxianPageTitle,
  XiuxianTableContainer,
  XiuxianRefreshButton,
  XiuxianEmptyState
} from '@/components/ui';

export default function CommandManager() {
  const {
    currentItems,
    loading,
    currentPath,
    handleEnterDirectory,
    handleBackToParent,
    handleNavigateToPath,
    handleToggleStatus,
    handleRefresh
  } = useCommandManagerCode();

  return (
    <XiuxianPageWrapper>
      {/* 页面标题和操作按钮 */}
      <XiuxianPageTitle
        icon={<FolderOutlined />}
        title='指令开关'
        subtitle='管理和控制修仙插件的各种响应体功能'
        actions={
          <div className='flex gap-2'>
            <button
              className='px-2 py-1 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2'
              onClick={handleBackToParent}
              disabled={currentPath.length === 0}
            >
              <ArrowLeftOutlined />
              返回上级
            </button>
            <XiuxianRefreshButton loading={loading} onClick={handleRefresh} />
          </div>
        }
      />

      {/* 面包屑导航 */}
      <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg mb-6'>
        <h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
          <FolderOutlined className='text-purple-400' />
          路径导航
        </h3>
        <Breadcrumb
          items={[
            {
              title: (
                <span
                  className='text-slate-200 font-medium cursor-pointer hover:text-white'
                  onClick={() => handleNavigateToPath([])}
                >
                  根目录
                </span>
              )
            },
            ...currentPath.map((item, index) => ({
              title: (
                <span
                  className='text-slate-300 cursor-pointer hover:text-white'
                  onClick={() => handleNavigateToPath(currentPath.slice(0, index + 1))}
                >
                  {item}
                </span>
              )
            }))
          ]}
          className='text-slate-300'
        />
      </div>

      {/* 当前目录内容 */}
      <XiuxianTableContainer
        title={`当前目录${currentPath.length > 0 ? ` (${currentPath.join('/')})` : ''}`}
        icon={<FolderOutlined />}
      >
        {loading ? (
          <div className='flex justify-center items-center py-12'>
            <Spin size='large' />
          </div>
        ) : currentItems.length > 0 ? (
          <List
            dataSource={currentItems}
            renderItem={item => (
              <List.Item className='border-b border-slate-700/30 last:border-b-0 hover:bg-slate-700/20 rounded-lg p-4 transition-colors'>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-center gap-3'>
                    <Avatar
                      icon={item.isDir ? <FolderOutlined /> : <FileOutlined />}
                      className={`${
                        item.isDir
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}
                    />
                    <span
                      className={`text-slate-200 font-medium ${
                        item.isDir ? 'cursor-pointer hover:text-blue-400' : ''
                      }`}
                      onClick={() => {
                        if (item.isDir) {
                          handleEnterDirectory(item.path);
                        }
                      }}
                    >
                      {item.name}
                    </span>
                  </div>

                  {item.isFile && (
                    <div className='flex items-center gap-4'>
                      <span
                        className={`text-sm font-medium ${
                          item.status === true
                            ? 'text-emerald-400'
                            : item.status === false
                              ? 'text-red-400'
                              : 'text-slate-400'
                        }`}
                      >
                        {item.status === true
                          ? '已在启用'
                          : item.status === false
                            ? '已被禁用'
                            : '未知状态'}
                      </span>
                      <button
                        onClick={() => handleToggleStatus(item.path, !item.status)}
                        className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                          item.status === true
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                        }`}
                      >
                        {item.status === true ? '禁用' : '启用'}
                      </button>
                    </div>
                  )}
                </div>
              </List.Item>
            )}
          />
        ) : (
          <XiuxianEmptyState title='当前目录为空' description='该目录下没有任何文件或文件夹' />
        )}
      </XiuxianTableContainer>
    </XiuxianPageWrapper>
  );
}
