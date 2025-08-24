import React from 'react'
import { Row, Col, Table } from 'antd'
import {
  UserOutlined,
  TeamOutlined,
  CrownOutlined,
  TrophyOutlined,
  ReloadOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined
} from '@ant-design/icons'

import type { ColumnsType } from 'antd/es/table'
import { TopAssociation, TopPlayer } from '@/types/types'
import { levelNames } from '@/config'
import { useDashboardCode } from './Dashboard.code'
import classNames from 'classnames'

export default function Dashboard() {
  const { stats, loading, fetchStats } = useDashboardCode()

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
          <div className="font-mono text-xs bg-slate-700/50 px-2 py-1 rounded text-slate-400">
            {record.id}
          </div>
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
        <div className="text-sm font-bold text-green-400">
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
        <div className="text-sm font-bold text-purple-400">
          {(record.lingshi || 0).toLocaleString()}
        </div>
      )
    }
  ]

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10  p-2 md:p-6 h-full overflow-y-auto">
        {/* 页面标题和刷新按钮 */}
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-center mb-6">
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
          <div className="flex gap-2">
            <button
              className="px-2 py-1 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
              onClick={fetchStats}
              disabled={loading}
            >
              <ReloadOutlined className={loading ? 'animate-spin' : ''} />
              {loading ? '刷新中...' : '刷新数据'}
            </button>
          </div>
        </div>

        {stats && (
          <>
            {/* 统计卡片 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChartOutlined className="text-purple-400" />
                数据统计
              </h3>
              <Row gutter={16}>
                <Col span={6}>
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="text-sm text-slate-400 mb-2">总玩家数</div>
                    <div className="text-2xl font-bold text-blue-400 flex items-center gap-2">
                      <UserOutlined />
                      {stats.users.total.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      活跃: {stats.users.active} | 今日新增:{' '}
                      {stats.users.newToday}
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="text-sm text-slate-400 mb-2">宗门总数</div>
                    <div className="text-2xl font-bold text-green-400 flex items-center gap-2">
                      <TeamOutlined />
                      {stats.associations.total.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      总成员: {stats.associations.totalMembers}
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="text-sm text-slate-400 mb-2">
                      定时任务总数
                    </div>
                    <div className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
                      <ClockCircleOutlined />
                      {stats.system.activeTasks.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      运行时间: {stats.system.uptime}
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
                    <div className="text-sm text-slate-400 mb-2">
                      数据更新时间
                    </div>
                    <div className="text-lg font-bold text-purple-400 flex items-center gap-2">
                      <RiseOutlined />
                      {new Date(stats.rankings.lastUpdate).toLocaleString(
                        'zh-CN'
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      最后更新:{' '}
                      {new Date(stats.rankings.lastUpdate).toLocaleString(
                        'zh-CN'
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* 排行榜区域 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-slate-700/50">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrophyOutlined className="text-purple-400" />
                  排行榜数据
                </h3>
              </div>

              <div className="p-6">
                <Row gutter={[16, 16]}>
                  {/* 玩家排行榜 */}
                  <Col xs={24} lg={12}>
                    <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-xl border border-slate-600/50 rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <TrophyOutlined className="text-yellow-400" />
                        <span className="text-lg font-bold text-white">
                          玩家排行榜 TOP10
                        </span>
                      </div>
                      <Table
                        columns={playerColumns}
                        dataSource={stats.rankings.topPlayers.slice(0, 10)}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        scroll={{ x: 300, y: 300 }}
                        rowClassName={() => 'bg-slate-700 hover:bg-slate-600'}
                        className="xiuxian-table"
                      />
                    </div>
                  </Col>

                  {/* 宗门排行榜 */}
                  <Col xs={24} lg={12}>
                    <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-xl border border-slate-600/50 rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <CrownOutlined className="text-purple-400" />
                        <span className="text-lg font-bold text-white">
                          宗门排行榜 TOP10
                        </span>
                      </div>
                      <Table
                        columns={associationColumns}
                        dataSource={stats.rankings.topAssociations.slice(0, 10)}
                        rowKey="name"
                        pagination={false}
                        size="small"
                        scroll={{ x: 400, y: 300 }}
                        rowClassName={() => 'bg-slate-700 hover:bg-slate-600'}
                        className="xiuxian-table"
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </>
        )}

        {!stats && !loading && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 shadow-lg text-center">
            <ExclamationCircleOutlined className="text-6xl text-slate-400 mb-4" />
            <p className="text-slate-400 text-lg">暂无数据</p>
            <p className="text-slate-500 text-sm mt-2">
              请点击刷新按钮获取最新数据
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
