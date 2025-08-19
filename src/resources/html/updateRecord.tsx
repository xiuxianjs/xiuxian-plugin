import React from 'react'
import HTML from './HTML'

// 更新日志组件
export default ({ Record }) => {
  return (
    <HTML>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 relative overflow-hidden">
        {/* 背景装饰元素 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-teal-400 rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border border-cyan-400 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-blue-400 rounded-full"></div>
          <div className="absolute bottom-40 right-1/3 w-20 h-20 border border-indigo-400 rounded-full"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* 主标题区域 */}
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl px-8 py-4 border border-teal-400/30">
                <h1 className="text-3xl font-bold text-white tracking-wider">
                  📜 修仙界更新日志 📜
                </h1>
              </div>
            </div>
          </div>

          {/* 更新记录区域 */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>
              <div className="relative backdrop-blur-sm bg-white/10 rounded-3xl border border-teal-400/30 p-8">
                <div className="space-y-6">
                  {Record.map((item, index) => (
                    <div key={item.id || index} className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-2xl blur-sm"></div>
                      <div className="relative backdrop-blur-md bg-white/5 rounded-2xl border border-teal-400/20 p-6">
                        <div className="flex items-start gap-6">
                          {/* 用户头像区域 */}
                          <div className="flex flex-col items-center">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-full blur-sm"></div>
                              <div className="relative w-16 h-16 rounded-full border-2 border-teal-400/30 overflow-hidden">
                                {item.user.avatar ? (
                                  <img
                                    src={item.user.avatar}
                                    alt={item.user.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-2xl font-bold text-white">
                                    {item.user.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mt-3 text-center">
                              <span className="text-sm font-medium text-teal-200">
                                {item.user.name}
                              </span>
                            </div>
                          </div>

                          {/* 内容区域 */}
                          <div className="flex-1">
                            <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-xl p-4 border border-teal-400/20">
                              <p className="text-base text-gray-200 leading-relaxed">
                                {item.text}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                              <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center">
                                <span className="text-xs">⏰</span>
                              </div>
                              <time className="text-sm text-yellow-200 font-medium">
                                {item.time}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 底部统计信息 */}
                <div className="mt-8 pt-6 border-t border-teal-400/20">
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-full flex items-center justify-center">
                        <span className="text-xs">📊</span>
                      </div>
                      <span className="text-sm text-teal-200">
                        共 {Record.length} 条更新记录
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部装饰 */}
          <div className="text-center mt-12">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 rounded-full border border-teal-400/30 backdrop-blur-sm">
              <span className="text-teal-200 text-sm">
                📜 修仙路上，每一次更新都是新的开始 📜
              </span>
            </div>
          </div>
        </div>
      </div>
    </HTML>
  )
}
