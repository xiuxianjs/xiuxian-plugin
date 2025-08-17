import React from 'react'
import { configCategories } from '@/config'
import classNames from 'classnames'
import { useConfigManagerCode } from './ConfigManager.code'
import { Modal } from 'antd'

export default function ConfigManager() {
  const {
    config,
    loading,
    activeTab,
    setActiveTab,
    jsonConfig,
    setJsonConfig,
    message,
    setMessage,
    loadConfig,
    handleSave,
    handleConfigChange,
    getConfigValue,
    open,
    setOpen
  } = useConfigManagerCode()

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10  p-2 md:p-6 h-full overflow-y-auto">
        {/* 页面标题 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <button
              onClick={loadConfig}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <span className="mr-2">🔄</span>
              {loading ? '刷新中...' : '刷新配置'}
            </button>
          </div>
          <div className="flex space-x-3">
            <div>
              <button
                onClick={() => {
                  setOpen(true)
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <span className="mr-2">🔄</span>
                JSON编辑
              </button>
            </div>
            {/* 保存按钮 */}
            {activeTab !== 'JSON编辑' && (
              <div className="flex justify-center">
                <button
                  onClick={() => config && handleSave(config)}
                  disabled={loading || !config}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="mr-2">💾</span>
                  {loading ? '保存中...' : '保存配置'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 消息提示 */}
        {message && (
          <div
            className={classNames('mb-6 rounded-xl p-4', {
              'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30':
                message.type === 'success',
              'bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30':
                message.type === 'error'
            })}
          >
            <div className="flex items-center space-x-3">
              <div
                className={classNames('w-3 h-3 rounded-full', {
                  'bg-green-400': message.type === 'success',
                  'bg-red-400': message.type === 'error'
                })}
              ></div>
              <div>
                <h3
                  className={classNames('font-semibold', {
                    'text-green-400': message.type === 'success',
                    'text-red-400': message.type === 'error'
                  })}
                >
                  {message.type === 'success' ? '成功' : '错误'}
                </h3>
                <p className="text-slate-300 text-sm mt-1">{message.text}</p>
              </div>
            </div>
          </div>
        )}

        {/* 标签页导航 */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {configCategories.map(category => (
              <button
                key={category.name}
                onClick={() => setActiveTab(category.name)}
                className={classNames(
                  'px-4 py-2 rounded-lg transition-all duration-200',
                  activeTab === category.name
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                )}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* 配置内容 */}
          {
            <div className="space-y-6">
              {configCategories
                .filter(category => category.name === activeTab)
                .map(category => (
                  <div key={category.name} className="space-y-4">
                    <h3 className="text-white text-xl font-semibold flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.items.map(item => (
                        <div
                          key={item.key}
                          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-white font-medium text-sm">
                              {item.name}
                            </label>
                            <span
                              className={classNames(
                                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                                item.type === 'string'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : item.type === 'number'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : item.type === 'boolean'
                                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              )}
                            >
                              {item.type.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-slate-400 text-xs mb-3">
                            {item.description}
                          </p>

                          {item.type === 'boolean' ? (
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={!!getConfigValue(item.key)}
                                onChange={e =>
                                  handleConfigChange(item.key, e.target.checked)
                                }
                                className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                              />
                              <span className="ml-2 text-slate-300 text-sm">
                                {getConfigValue(item.key) ? '启用' : '禁用'}
                              </span>
                            </div>
                          ) : item.type === 'array' ? (
                            <div>
                              <textarea
                                value={JSON.stringify(
                                  getConfigValue(item.key) || [],
                                  null,
                                  2
                                )}
                                onChange={e => {
                                  try {
                                    const value = JSON.parse(e.target.value)
                                    handleConfigChange(item.key, value)
                                  } catch (error) {
                                    console.error(error)
                                    // 忽略JSON解析错误
                                  }
                                }}
                                className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                                rows={3}
                                placeholder="请输入JSON数组格式"
                              />
                            </div>
                          ) : (
                            <input
                              type={item.type === 'number' ? 'number' : 'text'}
                              value={String(getConfigValue(item.key) || '')}
                              onChange={e => {
                                const value =
                                  item.type === 'number'
                                    ? parseFloat(e.target.value) || 0
                                    : e.target.value
                                handleConfigChange(item.key, value)
                              }}
                              className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                              placeholder={`请输入${item.name}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          }
        </div>
      </div>

      <Modal
        className="xiuxian-modal"
        title="JSON配置"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => {
          try {
            const parsed = JSON.parse(jsonConfig)
            handleSave(parsed)
            setOpen(false)
          } catch (error) {
            console.error(error)
            setMessage({ type: 'error', text: 'JSON格式错误' })
          }
        }}
        cancelText="取消"
        okText="确定"
      >
        <div>
          <div className="mb-4">
            <textarea
              value={jsonConfig}
              onChange={e => setJsonConfig(e.target.value)}
              className="w-full h-96 p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 font-mono text-sm"
              placeholder="请输入JSON格式的配置..."
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
