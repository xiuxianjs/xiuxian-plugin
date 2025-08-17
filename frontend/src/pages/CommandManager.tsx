import React from 'react'
import { Card, Button, Breadcrumb, Spin, Empty, List, Avatar } from 'antd'
import {
  ReloadOutlined,
  ArrowLeftOutlined,
  FolderOutlined,
  FileOutlined
} from '@ant-design/icons'
import { useCommandManagerCode } from './CommandManager.code'

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
  } = useCommandManagerCode()

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10 p-2 md:p-6 h-full overflow-y-auto">
        {/* 页面标题 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              ⚡ 响应体开关
            </h1>
            <p className="text-slate-300">管理和控制修仙插件的各种响应体功能</p>
          </div>
          <div className="flex gap-2">
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={handleBackToParent}
              disabled={currentPath.length === 0}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 border-0 hover:from-blue-600 hover:to-indigo-600"
            >
              返回上级
            </Button>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:from-purple-600 hover:to-pink-600"
            >
              刷新
            </Button>
          </div>
        </div>

        {/* 面包屑导航 */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg mb-6">
          <Breadcrumb
            items={[
              {
                title: (
                  <span
                    className="text-slate-200 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleNavigateToPath([])}
                  >
                    根目录
                  </span>
                )
              },
              ...currentPath.map((item, index) => ({
                title: (
                  <span
                    className="text-slate-300 cursor-pointer hover:text-white"
                    onClick={() =>
                      handleNavigateToPath(currentPath.slice(0, index + 1))
                    }
                  >
                    {item}
                  </span>
                )
              }))
            ]}
            className="text-slate-300"
          />
        </Card>

        {/* 当前目录内容 */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg">
          <div className="p-6 border-b border-slate-700/50">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FolderOutlined className="text-blue-400" />
              当前目录
              {currentPath.length > 0 && (
                <span className="text-slate-400 text-sm font-normal">
                  ({currentPath.join('/')})
                </span>
              )}
            </h3>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Spin size="large" />
              </div>
            ) : currentItems.length > 0 ? (
              <List
                dataSource={currentItems}
                renderItem={item => (
                  <List.Item className="border-b border-slate-700/30 last:border-b-0 hover:bg-slate-700/20 rounded-lg p-4 transition-colors">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Avatar
                          icon={
                            item.isDir ? <FolderOutlined /> : <FileOutlined />
                          }
                          className={`${
                            item.isDir
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}
                        />
                        <span
                          className={`text-slate-200 font-medium ${
                            item.isDir
                              ? 'cursor-pointer hover:text-blue-400'
                              : ''
                          }`}
                          onClick={() => {
                            if (item.isDir) {
                              handleEnterDirectory(item.path)
                            }
                          }}
                        >
                          {item.name}
                        </span>
                      </div>

                      {item.isFile && (
                        <div className="flex items-center gap-4">
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
                            onClick={() =>
                              handleToggleStatus(item.path, !item.status)
                            }
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
              <Empty description="当前目录为空" className="text-slate-400" />
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
