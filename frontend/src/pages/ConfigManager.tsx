import React, { useState, useEffect } from 'react'
import { getConfig, saveConfig } from '@/api/config'

interface ConfigItem {
  key: string
  name: string
  value: string | number | boolean | unknown[]
  type: 'string' | 'number' | 'boolean' | 'json' | 'array'
  description: string
  category: string
}

interface ConfigCategory {
  name: string
  icon: string
  items: ConfigItem[]
}

export default function ConfigManager() {
  const [config, setConfig] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('CD配置')
  const [jsonConfig, setJsonConfig] = useState('')
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // 配置分类定义
  const configCategories: ConfigCategory[] = [
    {
      name: 'CD配置',
      icon: '⏱️',
      items: [
        {
          key: 'CD.association',
          name: '宗门维护CD',
          value: 10080,
          type: 'number',
          description: '宗门维护冷却时间（分钟）',
          category: 'cd'
        },
        {
          key: 'CD.joinassociation',
          name: '退宗CD',
          value: 450,
          type: 'number',
          description: '退出宗门冷却时间（分钟）',
          category: 'cd'
        },
        {
          key: 'CD.associationbattle',
          name: '宗门大战CD',
          value: 1440,
          type: 'number',
          description: '宗门大战冷却时间（分钟）',
          category: 'cd'
        },
        {
          key: 'CD.rob',
          name: '打劫CD',
          value: 120,
          type: 'number',
          description: '打劫冷却时间（分钟）',
          category: 'cd'
        },
        {
          key: 'CD.gambling',
          name: '金银坊CD',
          value: 10,
          type: 'number',
          description: '金银坊冷却时间（分钟）',
          category: 'cd'
        },
        {
          key: 'CD.couple',
          name: '双修CD',
          value: 360,
          type: 'number',
          description: '双修冷却时间（分钟）',
          category: 'cd'
        },
        {
          key: 'CD.garden',
          name: '药园CD',
          value: 3,
          type: 'number',
          description: '药园操作冷却时间（分钟）',
          category: 'cd'
        },
        {
          key: 'CD.level_up',
          name: '突破CD',
          value: 3,
          type: 'number',
          description: '突破冷却时间（分钟）',
          category: 'cd'
        },
        {
          key: 'CD.secretplace',
          name: '秘境CD',
          value: 7,
          type: 'number',
          description: '秘境冷却时间（分钟）',
          category: 'cd'
        },
        {
          key: 'CD.timeplace',
          name: '仙府CD',
          value: 7,
          type: 'number',
          description: '仙府冷却时间（分钟）',
          category: 'cd'
        },
        {
          key: 'CD.forbiddenarea',
          name: '禁地CD',
          value: 7,
          type: 'number',
          description: '禁地冷却时间（分钟）',
          category: 'cd'
        },
        {
          key: 'CD.reborn',
          name: '重生CD',
          value: 360,
          type: 'number',
          description: '重生冷却时间（分钟）',
          category: 'cd'
        },
        {
          key: 'CD.transfer',
          name: '转账CD',
          value: 240,
          type: 'number',
          description: '转账冷却时间（分钟）',
          category: 'cd'
        },
        {
          key: 'CD.honbao',
          name: '抢红包CD',
          value: 1,
          type: 'number',
          description: '抢红包冷却时间（分钟）',
          category: 'cd'
        }
      ]
    },
    {
      name: '百分比配置',
      icon: '📊',
      items: [
        {
          key: 'percentage.cost',
          name: '手续费',
          value: 0.05,
          type: 'number',
          description: '交易手续费比例',
          category: 'percentage'
        },
        {
          key: 'percentage.Moneynumber',
          name: '金银坊收益',
          value: 1,
          type: 'number',
          description: '金银坊收益倍数',
          category: 'percentage'
        },
        {
          key: 'percentage.punishment',
          name: '出千收益',
          value: 0.5,
          type: 'number',
          description: '出千收益比例',
          category: 'percentage'
        }
      ]
    },
    {
      name: '数值配置',
      icon: '🔢',
      items: [
        {
          key: 'size.Money',
          name: '出千控制',
          value: 200,
          type: 'number',
          description: '出千控制金额（万）',
          category: 'size'
        }
      ]
    },
    {
      name: '开关配置',
      icon: '🔘',
      items: [
        {
          key: 'switch.play',
          name: '怡红院开关',
          value: true,
          type: 'boolean',
          description: '怡红院功能开关',
          category: 'switch'
        },
        {
          key: 'switch.Moneynumber',
          name: '金银坊开关',
          value: true,
          type: 'boolean',
          description: '金银坊功能开关',
          category: 'switch'
        },
        {
          key: 'switch.couple',
          name: '双修开关',
          value: true,
          type: 'boolean',
          description: '双修功能开关',
          category: 'switch'
        },
        {
          key: 'switch.Xiuianplay_key',
          name: '怡红院卡图开关',
          value: false,
          type: 'boolean',
          description: '怡红院卡图功能开关',
          category: 'switch'
        }
      ]
    },
    {
      name: '闭关配置',
      icon: '🧘',
      items: [
        {
          key: 'biguan.size',
          name: '闭关倍率',
          value: 10,
          type: 'number',
          description: '闭关收益倍率',
          category: 'biguan'
        },
        {
          key: 'biguan.time',
          name: '闭关最低时间',
          value: 30,
          type: 'number',
          description: '闭关最低时间（分钟）',
          category: 'biguan'
        },
        {
          key: 'biguan.cycle',
          name: '闭关周期',
          value: 24,
          type: 'number',
          description: '闭关周期（小时）',
          category: 'biguan'
        }
      ]
    },
    {
      name: '打工配置',
      icon: '💼',
      items: [
        {
          key: 'work.size',
          name: '打工倍率',
          value: 15,
          type: 'number',
          description: '打工收益倍率',
          category: 'work'
        },
        {
          key: 'work.time',
          name: '打工最低时间',
          value: 15,
          type: 'number',
          description: '打工最低时间（分钟）',
          category: 'work'
        },
        {
          key: 'work.cycle',
          name: '打工周期',
          value: 32,
          type: 'number',
          description: '打工周期（小时）',
          category: 'work'
        }
      ]
    },
    {
      name: '签到配置',
      icon: '📅',
      items: [
        {
          key: 'Sign.ticket',
          name: '签到门票',
          value: 1,
          type: 'number',
          description: '每日签到给的沉迷门票数量',
          category: 'sign'
        }
      ]
    },
    {
      name: '拍卖配置',
      icon: '🏛️',
      items: [
        {
          key: 'Auction.interval',
          name: '间歇时间',
          value: 3,
          type: 'number',
          description: '拍卖间歇时间（小时）',
          category: 'auction'
        },
        {
          key: 'Auction.openHour',
          name: '星阁开启时间',
          value: 19,
          type: 'number',
          description: '星阁开启时间（小时）',
          category: 'auction'
        },
        {
          key: 'Auction.closeHour',
          name: '星阁关闭时间',
          value: 20,
          type: 'number',
          description: '星阁关闭时间（小时）',
          category: 'auction'
        }
      ]
    },
    {
      name: '秘境配置',
      icon: '🗺️',
      items: [
        {
          key: 'SecretPlace.one',
          name: '一级秘境出金概率',
          value: 0.99,
          type: 'number',
          description: '一级秘境出金概率',
          category: 'secretplace'
        },
        {
          key: 'SecretPlace.two',
          name: '二级秘境出金概率',
          value: 0.6,
          type: 'number',
          description: '二级秘境出金概率',
          category: 'secretplace'
        },
        {
          key: 'SecretPlace.three',
          name: '三级秘境出金概率',
          value: 0.28,
          type: 'number',
          description: '三级秘境出金概率',
          category: 'secretplace'
        }
      ]
    },
    {
      name: '纳戒配置',
      icon: '💍',
      items: [
        {
          key: 'najie_num',
          name: '纳戒存储量',
          value: [
            50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000
          ],
          type: 'array',
          description: '各级纳戒存储量',
          category: 'najie'
        },
        {
          key: 'najie_price',
          name: '纳戒升级消耗',
          value: [0, 50000, 100000, 500000, 500000, 1000000, 3000000, 6000000],
          type: 'array',
          description: '各级纳戒升级消耗',
          category: 'najie'
        }
      ]
    },
    {
      name: '黑白名单',
      icon: '📋',
      items: [
        {
          key: 'whitecrowd',
          name: '白名单群',
          value: [767253997],
          type: 'array',
          description: '白名单群号列表',
          category: 'list'
        },
        {
          key: 'blackid',
          name: '黑名单用户',
          value: [123456],
          type: 'array',
          description: '黑名单用户ID列表',
          category: 'list'
        }
      ]
    }
  ]

  const loadConfig = async () => {
    setLoading(true)
    try {
      const result = await getConfig('xiuxian')
      if (result) {
        const configData =
          (result.data as Record<string, any>) ||
          (result as unknown as Record<string, any>)
        setConfig(configData)
        setJsonConfig(JSON.stringify(configData, null, 2))
      }
    } catch (error) {
      console.error('加载配置失败:', error)
      setMessage({ type: 'error', text: '加载配置失败' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (values: Record<string, any>) => {
    setLoading(true)
    try {
      await saveConfig('xiuxian', values)
      setMessage({ type: 'success', text: '配置保存成功' })
      loadConfig()
    } catch (error) {
      console.error('保存配置失败:', error)
      setMessage({ type: 'error', text: '保存配置失败' })
    } finally {
      setLoading(false)
    }
  }

  const handleConfigChange = (key: string, value: unknown) => {
    if (!config) return

    const keys = key.split('.')
    const newConfig = { ...config }
    let current = newConfig as Record<string, unknown>

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]] as Record<string, unknown>
    }

    current[keys[keys.length - 1]] = value
    setConfig(newConfig)
    setJsonConfig(JSON.stringify(newConfig, null, 2))
  }

  const getConfigValue = (key: string): unknown => {
    if (!config) return undefined
    const keys = key.split('.')
    let value: unknown = config
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
    return value
  }

  useEffect(() => {
    loadConfig()
  }, [])

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10 p-6 h-full overflow-y-auto">
        {/* 页面标题 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-3">
            <button
              onClick={loadConfig}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <span className="mr-2">🔄</span>
              {loading ? '刷新中...' : '刷新配置'}
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
                {loading ? '保存中...' : '保存所有配置'}
              </button>
            </div>
          )}
        </div>

        {/* 消息提示 */}
        {message && (
          <div
            className={`mb-6 rounded-xl p-4 ${
              message.type === 'success'
                ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30'
                : 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  message.type === 'success' ? 'bg-green-400' : 'bg-red-400'
                }`}
              ></div>
              <div>
                <h3
                  className={`font-semibold ${
                    message.type === 'success'
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {message.type === 'success' ? '成功' : '错误'}
                </h3>
                <p className="text-slate-300 text-sm">{message.text}</p>
              </div>
            </div>
          </div>
        )}

        {/* 配置统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">配置分类</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {configCategories.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">📁</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">配置项</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {configCategories.reduce(
                    (total, cat) => total + cat.items.length,
                    0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">⚙️</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">CD配置</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {configCategories.find(cat => cat.name === 'CD配置')?.items
                    .length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">⏱️</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">开关配置</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {configCategories.find(cat => cat.name === '开关配置')?.items
                    .length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🔘</span>
              </div>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {configCategories.map(category => (
              <button
                key={category.name}
                onClick={() => setActiveTab(category.name)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === category.name
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
            <button
              onClick={() => setActiveTab('JSON编辑')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === 'JSON编辑'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              📄 JSON编辑
            </button>
          </div>

          {/* 配置内容 */}
          {activeTab !== 'JSON编辑' && (
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
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                item.type === 'string'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : item.type === 'number'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : item.type === 'boolean'
                                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              }`}
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
                                checked={Boolean(getConfigValue(item.key))}
                                onChange={e =>
                                  handleConfigChange(item.key, e.target.checked)
                                }
                                className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                              />
                              <span className="ml-2 text-slate-300 text-sm">
                                {Boolean(getConfigValue(item.key))
                                  ? '启用'
                                  : '禁用'}
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
                              value={getConfigValue(item.key) || ''}
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
          )}

          {/* JSON编辑 */}
          {activeTab === 'JSON编辑' && (
            <div>
              <div className="mb-4">
                <div className="flex justify-between py-2">
                  <div>
                    <label className="block text-slate-300 text-xl font-medium mb-2">
                      JSON配置
                    </label>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        try {
                          const parsed = JSON.parse(jsonConfig)
                          handleSave(parsed)
                        } catch (error) {
                          console.error(error)
                          setMessage({ type: 'error', text: 'JSON格式错误' })
                        }
                      }}
                      disabled={loading}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      <span className="mr-2">💾</span>
                      {loading ? '保存中...' : '保存配置'}
                    </button>
                    <button
                      onClick={loadConfig}
                      disabled={loading}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      <span className="mr-2">🔄</span>
                      重新加载
                    </button>
                  </div>
                </div>
                <textarea
                  value={jsonConfig}
                  onChange={e => setJsonConfig(e.target.value)}
                  className="w-full h-96 p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 font-mono text-sm"
                  placeholder="请输入JSON格式的配置..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
