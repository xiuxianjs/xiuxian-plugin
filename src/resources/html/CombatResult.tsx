import React from 'react'
import HTML from './HTML'

/**
 * 战斗的2方。
 * @param param0
 * @returns
 */
const CombatResult = ({
  msg,
  playerA,
  playerB,
  result
}: {
  msg: string[]
  playerA: {
    id: string
    name: string
    avatar: string
    power: number
    hp: number
    maxHp: number
  }
  playerB: {
    id: string
    name: string
    avatar: string
    power: number
    hp: number
    maxHp: number
  }
  result: 'A' | 'B' | 'draw' // A胜、B胜、平局
}) => {
  return (
    <HTML className="w-full text-center p-4 md:p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative min-h-screen">
      {/* 背景装饰 */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      {/* 主容器 */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* 标题区域 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-400/30 rounded-full shadow-2xl">
            <div className="w-6 h-6 mr-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">⚔</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              修仙对决
            </h1>
            {/* 胜负结果 */}
            <div className="mt-4">
              {result === 'A' && (
                <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-full">
                  <span className="text-green-400 text-lg mr-2">🏆</span>
                  <span className="text-green-300 font-semibold">
                    {playerA.name} 获胜！
                  </span>
                </div>
              )}
              {result === 'B' && (
                <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-full">
                  <span className="text-green-400 text-lg mr-2">🏆</span>
                  <span className="text-green-300 font-semibold">
                    {playerB.name} 获胜！
                  </span>
                </div>
              )}
              {result === 'draw' && (
                <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-full">
                  <span className="text-yellow-400 text-lg mr-2">🤝</span>
                  <span className="text-yellow-300 font-semibold">
                    势均力敌，平局！
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 战斗结果主区域 */}
        <div className="bg-gradient-to-br from-slate-800/80 via-purple-800/60 to-slate-800/80 backdrop-blur-md border border-purple-400/30 rounded-2xl shadow-2xl p-6 md:p-8 mb-8">
          <div className="relative">
            {/* 装饰性边框 */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-purple-500/20 rounded-2xl"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>

            {/* 战斗双方区域 */}
            <div className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* 战斗方A */}
                <div className="bg-gradient-to-br from-blue-900/60 to-cyan-800/40 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6 shadow-lg relative overflow-hidden">
                  {/* 装饰性光效 */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"></div>

                  <div className="flex flex-col items-center">
                    {/* 头像区域 */}
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full p-1 shadow-lg">
                        <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
                          {playerA.avatar ? (
                            <img
                              src={playerA.avatar}
                              alt={playerA.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-2xl">👤</span>
                          )}
                        </div>
                      </div>
                      {/* 等级标识 */}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                        <span className="text-white text-xs font-bold">A</span>
                      </div>
                    </div>

                    {/* 玩家信息 */}
                    <h3 className="text-lg font-semibold text-blue-200 mb-2">
                      {playerA.name}
                    </h3>

                    {/* 战力显示 */}
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-blue-400/20 w-full mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-100 text-sm">战力</span>
                        <span className="text-amber-300 font-bold text-lg">
                          {playerA.power}
                        </span>
                      </div>
                    </div>

                    {/* 血量显示 */}
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-blue-400/20 w-full">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-100 text-sm">血量</span>
                        <span className="text-red-300 font-bold text-sm">
                          {playerA.hp}/{playerA.maxHp}
                        </span>
                      </div>
                      {/* 血条 */}
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.max(0, (playerA.hp / playerA.maxHp) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VS 标识 */}
                <div className="hidden md:flex items-center justify-center">
                  <div className="relative">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl ${
                        result === 'A'
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                          : result === 'B'
                            ? 'bg-gradient-to-br from-red-500 to-pink-500'
                            : 'bg-gradient-to-br from-purple-500 to-pink-500'
                      }`}
                    >
                      <span className="text-white text-2xl font-bold">
                        {result === 'A' ? 'A胜' : result === 'B' ? 'B胜' : 'VS'}
                      </span>
                    </div>
                    <div
                      className={`absolute inset-0 rounded-full blur-lg opacity-50 ${
                        result === 'A'
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                          : result === 'B'
                            ? 'bg-gradient-to-br from-red-500 to-pink-500'
                            : 'bg-gradient-to-br from-purple-500 to-pink-500'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* 战斗方B */}
                <div className="bg-gradient-to-br from-red-900/60 to-pink-800/40 backdrop-blur-sm border border-red-400/30 rounded-xl p-6 shadow-lg relative overflow-hidden">
                  {/* 装饰性光效 */}
                  <div className="absolute top-0 left-0 w-20 h-20 bg-red-400/10 rounded-full blur-xl"></div>

                  <div className="flex flex-col items-center">
                    {/* 头像区域 */}
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-400 rounded-full p-1 shadow-lg">
                        <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
                          {playerB.avatar ? (
                            <img
                              src={playerB.avatar}
                              alt={playerB.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-2xl">👹</span>
                          )}
                        </div>
                      </div>
                      {/* 等级标识 */}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                        <span className="text-white text-xs font-bold">B</span>
                      </div>
                    </div>

                    {/* 玩家信息 */}
                    <h3 className="text-lg font-semibold text-red-200 mb-2">
                      {playerB.name}
                    </h3>

                    {/* 战力显示 */}
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-red-400/20 w-full mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-red-100 text-sm">战力</span>
                        <span className="text-amber-300 font-bold text-lg">
                          {playerB.power}
                        </span>
                      </div>
                    </div>

                    {/* 血量显示 */}
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-red-400/20 w-full">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-red-100 text-sm">血量</span>
                        <span className="text-red-300 font-bold text-sm">
                          {playerB.hp}/{playerB.maxHp}
                        </span>
                      </div>
                      {/* 血条 */}
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.max(0, (playerB.hp / playerB.maxHp) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 战斗过程区域 */}
              <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm border border-slate-500/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-lg">⚡</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-200">
                    战斗过程
                  </h3>
                </div>

                <div className="space-y-4 pr-2">
                  {msg.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-slate-600/50 to-slate-700/50 backdrop-blur-sm border border-slate-500/20 rounded-lg p-4 shadow-md relative overflow-hidden"
                    >
                      {/* 装饰性光效 */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400/30 to-transparent"></div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0 shadow-md">
                          <span className="text-white text-sm font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed flex-1">
                          {item}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="flex justify-center">
          <div className="flex space-x-4">
            <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-lg"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full shadow-lg"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-lg"></div>
          </div>
        </div>
      </div>
    </HTML>
  )
}

export default CombatResult
