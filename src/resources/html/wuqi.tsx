import React from 'react'
import HTML from './HTML'

const WuQi = ({ nickname, wuqi_have, wuqi_need }) => {
  return (
    <HTML>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
        {/* 背景装饰元素 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-indigo-400 rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border border-blue-400 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-cyan-400 rounded-full"></div>
          <div className="absolute bottom-40 right-1/3 w-20 h-20 border border-purple-400 rounded-full"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* 主标题区域 */}
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl px-8 py-4 border border-indigo-400/30">
                <h1 className="text-3xl font-bold text-white tracking-wider">
                  ⚔️ {nickname}的装备图鉴 ⚔️
                </h1>
              </div>
            </div>
            <div className="mt-4 text-indigo-200 text-sm">
              🗡️ 修仙之路，神兵相伴 🗡️
            </div>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* 已拥有装备 */}
            {wuqi_have && wuqi_have.length > 0 && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl"></div>
                <div className="relative backdrop-blur-sm bg-white/10 rounded-3xl border border-green-400/30 p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mr-4 border border-green-300/50">
                      <span className="text-2xl">⚔️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-green-300 tracking-wide">
                      【已拥有装备】
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {wuqi_have.map((item, index) => (
                      <div key={index} className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-2xl blur-sm"></div>
                        <div className="relative backdrop-blur-md bg-white/5 rounded-2xl border border-green-400/40 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-green-200">
                              {item.name}
                            </h3>
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                              <span className="text-sm">🗡️</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center text-sm">
                              <span className="w-16 text-indigo-200">类型</span>
                              <span className="text-green-100 font-medium">
                                {item.type}
                              </span>
                            </div>

                            {item.atk > 10 || item.def > 10 || item.HP > 10 ? (
                              <>
                                <div className="flex items-center text-sm">
                                  <span className="w-16 text-indigo-200">
                                    攻击
                                  </span>
                                  <span className="text-red-300 font-medium">
                                    {item.atk}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <span className="w-16 text-indigo-200">
                                    防御
                                  </span>
                                  <span className="text-blue-300 font-medium">
                                    {item.def}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <span className="w-16 text-indigo-200">
                                    血量
                                  </span>
                                  <span className="text-green-300 font-medium">
                                    {item.HP}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center text-sm">
                                  <span className="w-16 text-indigo-200">
                                    攻击
                                  </span>
                                  <span className="text-red-300 font-medium">
                                    {(item.atk * 100).toFixed(0)}%
                                  </span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <span className="w-16 text-indigo-200">
                                    防御
                                  </span>
                                  <span className="text-blue-300 font-medium">
                                    {(item.def * 100).toFixed(0)}%
                                  </span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <span className="w-16 text-indigo-200">
                                    血量
                                  </span>
                                  <span className="text-green-300 font-medium">
                                    {(item.HP * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </>
                            )}

                            <div className="flex items-center text-sm">
                              <span className="w-16 text-indigo-200">暴击</span>
                              <span className="text-purple-300 font-medium">
                                {(item.bao * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 未拥有装备 */}
            {wuqi_need && wuqi_need.length > 0 && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
                <div className="relative backdrop-blur-sm bg-white/10 rounded-3xl border border-red-400/30 p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-600 rounded-xl flex items-center justify-center mr-4 border border-red-300/50">
                      <span className="text-2xl">🔮</span>
                    </div>
                    <h2 className="text-2xl font-bold text-red-300 tracking-wide">
                      【未拥有装备】
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {wuqi_need.map((item, index) => (
                      <div key={index} className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-pink-600/20 rounded-2xl blur-sm"></div>
                        <div className="relative backdrop-blur-md bg-white/5 rounded-2xl border border-red-400/40 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-red-200">
                              {item.name}
                            </h3>
                            <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-600 rounded-lg flex items-center justify-center">
                              <span className="text-sm">🔒</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center text-sm">
                              <span className="w-16 text-indigo-200">类型</span>
                              <span className="text-red-100 font-medium">
                                {item.type}
                              </span>
                            </div>

                            {item.atk > 10 || item.def > 10 || item.HP > 10 ? (
                              <>
                                <div className="flex items-center text-sm">
                                  <span className="w-16 text-indigo-200">
                                    攻击
                                  </span>
                                  <span className="text-red-300 font-medium">
                                    {item.atk}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <span className="w-16 text-indigo-200">
                                    防御
                                  </span>
                                  <span className="text-blue-300 font-medium">
                                    {item.def}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <span className="w-16 text-indigo-200">
                                    血量
                                  </span>
                                  <span className="text-green-300 font-medium">
                                    {item.HP}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center text-sm">
                                  <span className="w-16 text-indigo-200">
                                    攻击
                                  </span>
                                  <span className="text-red-300 font-medium">
                                    {(item.atk * 100).toFixed(0)}%
                                  </span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <span className="w-16 text-indigo-200">
                                    防御
                                  </span>
                                  <span className="text-blue-300 font-medium">
                                    {(item.def * 100).toFixed(0)}%
                                  </span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <span className="w-16 text-indigo-200">
                                    血量
                                  </span>
                                  <span className="text-green-300 font-medium">
                                    {(item.HP * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </>
                            )}

                            <div className="flex items-center text-sm">
                              <span className="w-16 text-indigo-200">暴击</span>
                              <span className="text-purple-300 font-medium">
                                {(item.bao * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 底部装饰 */}
          <div className="text-center mt-12">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-full border border-indigo-400/30 backdrop-blur-sm">
              <span className="text-indigo-200 text-sm">
                ⚔️ 修仙之路漫漫，神兵利器相伴 ⚔️
              </span>
            </div>
          </div>
        </div>
      </div>
    </HTML>
  )
}

export default WuQi
