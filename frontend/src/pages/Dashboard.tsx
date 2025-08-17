import React from 'react'
import { Card, Row, Col, Statistic, Table, Progress } from 'antd'
import {
  UserOutlined,
  TeamOutlined,
  CrownOutlined,
  TrophyOutlined,
  ReloadOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'

import type { ColumnsType } from 'antd/es/table'
import { TopAssociation, TopPlayer } from '@/types'
import { levelNames } from '@/config'
import { useDashboardCode } from './Dashboard.code'
import classNames from 'classnames'

export default function Dashboard() {
  const { stats, loading, fetchStats, levelDistributionData, categoryData } =
    useDashboardCode()

  // 玩家排行榜列配置
  const playerColumns: ColumnsType<TopPlayer> = [
    {
      title: (
        <div className="flex items-center gap-2 text-purple-400 font-bold">
          <span>排名</span>
        </div>
      ),
      key: 'rank',
      width: 60,
      render: (_, __, index) => (
        <div className="flex items-center justify-center">
          <span
            className={classNames('text-sm font-bold', {
              'text-yellow-400': index === 0,
              'text-slate-400': index === 1,
              'text-orange-400': index === 2
            })}
          >
            {index + 1}
          </span>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-blue-400 font-bold">
          <span>玩家</span>
        </div>
      ),
      key: 'name',
      render: (_, record) => (
        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
          <div className="font-medium text-sm text-white">{record.name}</div>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-green-400 font-bold">
          <span>ID</span>
        </div>
      ),
      key: 'id',
      render: (_, record) => (
        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
          <div className="text-xs text-slate-400">{record.id}</div>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-yellow-400 font-bold">
          <span>境界</span>
        </div>
      ),
      key: 'level',
      render: (_, record) => (
        <div className="text-sm font-medium text-blue-400">
          {levelNames[record.level]}
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <span>战力</span>
        </div>
      ),
      key: 'power',
      render: (_, record) => (
        <div className="text-sm font-bold text-green-600">
          {(record.power || 0).toLocaleString()}
        </div>
      )
    }
  ]

  // 宗门排行榜列配置
  const associationColumns: ColumnsType<TopAssociation> = [
    {
      title: (
        <div className="flex items-center gap-2 text-purple-400 font-bold">
          <span>排名</span>
        </div>
      ),
      key: 'rank',
      width: 60,
      render: (_, __, index) => (
        <div className="flex items-center justify-center">
          <span
            className={classNames('text-sm font-bold', {
              'text-yellow-400': index === 0,
              'text-slate-400': index === 1,
              'text-orange-400': index === 2
            })}
          >
            {index + 1}
          </span>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-blue-400 font-bold">
          <span>宗门</span>
        </div>
      ),
      key: 'name',
      render: (_, record) => (
        <div className="font-medium text-sm truncate max-w-24 sm:max-w-none text-white">
          {record.name}
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-green-400 font-bold">
          <span>成员数</span>
        </div>
      ),
      key: 'members',
      render: (_, record) => (
        <div className="text-sm text-slate-400">{record.members}</div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-yellow-400 font-bold">
          <span>总战力</span>
        </div>
      ),
      key: 'power',
      render: (_, record) => (
        <div className="text-sm font-bold text-green-400">
          {(record.power || 0).toLocaleString()}
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-purple-400 font-bold">
          <span>灵石池</span>
        </div>
      ),
      key: 'lingshi',
      render: (_, record) => (
        <div className="text-sm text-purple-400">
          {(record.lingshi || 0).toLocaleString()}
        </div>
      )
    }
  ]

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10  p-2 md:p-6 h-full overflow-y-auto">
        {/* 页面标题和刷新按钮 */}
        <div className="flex flex-col sm:flex-row  gap-2  justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrophyOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                数据看板
              </h1>
              <p className="text-slate-400 text-sm mt-1">修仙界数据总览</p>
            </div>
          </div>
          <button
            className="p-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
            onClick={fetchStats}
            disabled={loading}
          >
            <ReloadOutlined className={loading ? 'animate-spin' : ''} />
            {loading ? '刷新中...' : '刷新数据'}
          </button>
        </div>

        {stats && (
          <>
            {/* 主要统计卡片 */}
            <Row gutter={[16, 16]} className="mb-8">
              <Col xs={24} sm={12} lg={6}>
                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-lg h-full">
                  <Statistic
                    title={
                      <span className="text-slate-400 text-sm font-medium">
                        总玩家数
                      </span>
                    }
                    value={stats.users.total}
                    prefix={<UserOutlined className="text-blue-400" />}
                    valueStyle={{
                      color: '#ffffff',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}
                  />
                  <div className="mt-2 text-xs sm:text-sm text-slate-400">
                    活跃: {stats.users.active} | 今日新增:{' '}
                    {stats.users.newToday}
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-2xl shadow-lg h-full">
                  <Statistic
                    title={
                      <span className="text-slate-400 text-sm font-medium">
                        宗门总数
                      </span>
                    }
                    value={stats.associations.total}
                    prefix={<TeamOutlined className="text-green-400" />}
                    valueStyle={{
                      color: '#ffffff',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}
                  />
                  <div className="mt-2 text-xs sm:text-sm text-slate-400">
                    总成员: {stats.associations.totalMembers}
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-2xl shadow-lg h-full">
                  <Statistic
                    title={
                      <span className="text-slate-400 text-sm font-medium">
                        定时任务总数
                      </span>
                    }
                    value={stats.system.activeTasks}
                    prefix={<ClockCircleOutlined className="text-yellow-400" />}
                    valueStyle={{
                      color: '#ffffff',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}
                    suffix="个任务"
                  />
                  <div className="mt-2 text-xs sm:text-sm text-slate-400">
                    运行时间: {stats.system.uptime}
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-lg h-full">
                  <Statistic
                    title={
                      <span className="text-slate-400 text-sm font-medium">
                        数据更新时间
                      </span>
                    }
                    value={new Date(stats.rankings.lastUpdate).toLocaleString(
                      'zh-CN'
                    )}
                    prefix={<RiseOutlined className="text-purple-400" />}
                    valueStyle={{
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}
                  />
                  <div className="mt-2 text-xs sm:text-sm text-slate-400">
                    最后更新:{' '}
                    {new Date(stats.rankings.lastUpdate).toLocaleString(
                      'zh-CN'
                    )}
                  </div>
                </Card>
              </Col>
            </Row>

            {/* 境界分布和玩家排行榜 */}
            <Row gutter={[16, 16]} className="mb-6">
              {/* 境界分布 */}
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <span className="text-xl font-bold text-white flex items-center gap-2">
                      <CrownOutlined className="text-purple-400" />
                      境界分布 TOP10
                    </span>
                  }
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg h-full"
                >
                  <div className="space-y-3">
                    {levelDistributionData.map((item, index) => (
                      <div
                        key={item.level}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <span className="text-xs sm:text-sm font-medium text-slate-400 w-6 sm:w-8 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-xs sm:text-sm truncate text-white">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <div className="w-16 sm:w-20">
                            <Progress
                              percent={parseFloat(item.percentage)}
                              size="small"
                              showInfo={false}
                              strokeColor="#8b5cf6"
                            />
                          </div>
                          <span className="text-xs sm:text-sm text-slate-400 w-8 sm:w-12 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>

              {/* 玩家排行榜 */}
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <div className="flex items-center gap-2">
                      <TrophyOutlined className="text-yellow-400" />
                      <span className="text-xl font-bold text-white">
                        玩家排行榜 TOP10
                      </span>
                    </div>
                  }
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg h-full"
                >
                  <Table
                    columns={playerColumns}
                    dataSource={stats.rankings.topPlayers.slice(0, 10)}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    scroll={{ x: 300, y: 300 }}
                    rowClassName={() => 'bg-slate-700 hover:bg-slate-600'}
                    className="bg-transparent xiuxian-table"
                  />
                </Card>
              </Col>
            </Row>

            {/* 宗门排行榜和物品分类 */}
            <Row gutter={[16, 16]}>
              {/* 宗门排行榜 */}
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <div className="flex items-center gap-2">
                      <CrownOutlined className="text-purple-400" />
                      <span className="text-xl font-bold text-white">
                        宗门排行榜 TOP10
                      </span>
                    </div>
                  }
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg h-full"
                >
                  <Table
                    columns={associationColumns}
                    dataSource={stats.rankings.topAssociations.slice(0, 10)}
                    rowKey="name"
                    pagination={false}
                    size="small"
                    scroll={{ x: 400, y: 300 }}
                    rowClassName={() => 'bg-slate-700 hover:bg-slate-600'}
                    className="bg-transparent xiuxian-table"
                  />
                </Card>
              </Col>

              {/* 物品分类统计 */}
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <span className="text-xl font-bold text-white flex items-center gap-2">
                      <TrophyOutlined className="text-green-400" />
                      物品分类统计
                    </span>
                  }
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg h-full"
                >
                  <div className="space-y-3">
                    {categoryData.map((item, index) => (
                      <div
                        key={item.category}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <span className="text-xs sm:text-sm font-medium text-slate-400 w-6 sm:w-8 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-xs sm:text-sm truncate text-white">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <div className="w-16 sm:w-20">
                            <Progress
                              percent={parseFloat(item.percentage)}
                              size="small"
                              showInfo={false}
                              strokeColor="#10b981"
                            />
                          </div>
                          <span className="text-xs sm:text-sm text-slate-400 w-8 sm:w-12 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {!stats && !loading && (
          <div className="text-center py-12">
            <ExclamationCircleOutlined className="text-4xl text-slate-400 mb-4" />
            <p className="text-slate-400">暂无数据</p>
          </div>
        )}
      </div>
    </div>
  )
}
