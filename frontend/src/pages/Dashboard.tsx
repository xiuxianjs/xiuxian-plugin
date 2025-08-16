import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const _navigate = useNavigate()

  // 统计数据
  const stats = {
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalSects: 0,
    totalItems: 0,
    totalBattles: 0,
    systemUptime: '0天 0小时 0分钟',
    serverLoad: 0,
    memoryUsage: 0,
    diskUsage: 0
  }

  // 用户增长数据
  const userGrowthData = [
    // { date: '01-10', users: 1200, growth: 2.1 },
    // { date: '01-11', users: 1215, growth: 1.3 },
    // { date: '01-12', users: 1230, growth: 1.2 },
    // { date: '01-13', users: 1240, growth: 0.8 },
    // { date: '01-14', users: 1245, growth: 0.4 },
    // { date: '01-15', users: 1250, growth: 0.4 }
  ]

  // 系统日志
  const systemLogs = [
    // {
    //   id: 3,
    //   level: 'warning',
    //   message: '内存使用率较高',
    //   time: '2024-01-15 08:30:00'
    // },
    // {
    //   id: 5,
    //   level: 'error',
    //   message: '用户登录失败次数过多',
    //   time: '2024-01-15 09:15:00'
    // },
    // {
    //   id: 6,
    //   level: 'info',
    //   message: '缓存清理完成',
    //   time: '2024-01-15 10:00:00'
    // }
  ]

  // 活跃宗门排行
  const topSects = [
    // { rank: 1, name: '青云门', members: 156, level: 8, activity: 95 },
    // { rank: 2, name: '蜀山派', members: 142, level: 7, activity: 88 },
    // { rank: 3, name: '昆仑派', members: 128, level: 7, activity: 82 },
    // { rank: 4, name: '峨眉派', members: 115, level: 6, activity: 76 },
    // { rank: 5, name: '武当派', members: 98, level: 6, activity: 71 }
  ]

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10 p-6 h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedPeriod === 'today'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
              onClick={() => setSelectedPeriod('today')}
            >
              今日
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedPeriod === 'week'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
              onClick={() => setSelectedPeriod('week')}
            >
              本周
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedPeriod === 'month'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
              onClick={() => setSelectedPeriod('month')}
            >
              本月
            </button>
          </div>
        </div>

        {/* 核心统计数据 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative overflow-hidden">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">总用户数</p>
                  <p className="text-white text-3xl font-bold mt-2">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                  <p className="text-blue-400 text-sm mt-1">
                    较昨日 +{stats.newUsers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">👥</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden">
            <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">活跃用户</p>
                  <p className="text-white text-3xl font-bold mt-2">
                    {stats.activeUsers.toLocaleString()}
                  </p>
                  <p className="text-red-400 text-sm mt-1">
                    活跃率{' '}
                    {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🔥</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden">
            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">宗门数量</p>
                  <p className="text-white text-3xl font-bold mt-2">
                    {stats.totalSects}
                  </p>
                  <p className="text-purple-400 text-sm mt-1">
                    平均成员 {Math.round(stats.totalUsers / stats.totalSects)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🏛️</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden">
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">物品总数</p>
                  <p className="text-white text-3xl font-bold mt-2">
                    {stats.totalItems.toLocaleString()}
                  </p>
                  <p className="text-yellow-400 text-sm mt-1">今日新增 156</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">📚</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 系统日志和排行榜 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold flex items-center">
                <span className="mr-2 text-cyan-400">📋</span>
                系统日志
              </h3>
              <button className="text-slate-400 hover:text-white text-sm">
                查看全部
              </button>
            </div>

            <div className="space-y-3">
              {systemLogs.map(log => (
                <div
                  key={log.id}
                  className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg"
                >
                  <span
                    className={`w-2 h-2 rounded-full mt-2 ${
                      log.level === 'error'
                        ? 'bg-red-400'
                        : log.level === 'warning'
                          ? 'bg-yellow-400'
                          : 'bg-green-400'
                    }`}
                  ></span>
                  <div className="flex-1">
                    <p className="text-white text-sm">{log.message}</p>
                    <p className="text-slate-400 text-xs mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold flex items-center">
                <span className="mr-2 text-yellow-400">🏆</span>
                活跃宗门排行
              </h3>
              <button className="text-slate-400 hover:text-white text-sm">
                查看全部
              </button>
            </div>

            <div className="space-y-3">
              {topSects.map(sect => (
                <div
                  key={sect.rank}
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        sect.rank <= 3
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          : 'bg-slate-600 text-slate-300'
                      }`}
                    >
                      #{sect.rank}
                    </span>
                    <div>
                      <p className="text-white font-medium">{sect.name}</p>
                      <p className="text-slate-400 text-xs">
                        等级 {sect.level} | {sect.members} 成员
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-slate-600 rounded-full h-2">
                      <div
                        className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${sect.activity}%` }}
                      ></div>
                    </div>
                    <span className="text-slate-300 text-sm">
                      {sect.activity}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
