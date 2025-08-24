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

// 导入新的可复用组件
import {
  XiuxianPageWrapper,
  XiuxianPageTitle,
  XiuxianStatCard,
  XiuxianTableContainer,
  XiuxianRefreshButton,
  XiuxianEmptyState
} from '@/components/ui'

export default function DashboardRefactored() {
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
    <XiuxianPageWrapper>
      {/* 页面标题和刷新按钮 */}
      <XiuxianPageTitle
        icon={<TrophyOutlined />}
        title="数据看板"
        subtitle="修仙界数据总览"
        actions={
          <XiuxianRefreshButton loading={loading} onClick={fetchStats} />
        }
      />

      {stats && (
        <>
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <XiuxianStatCard
              title="总玩家数"
              value={stats.users.total}
              icon={<UserOutlined />}
              gradient="blue"
              subtitle={`活跃: ${stats.users.active} | 今日新增: ${stats.users.newToday}`}
            />
            <XiuxianStatCard
              title="宗门总数"
              value={stats.associations.total}
              icon={<TeamOutlined />}
              gradient="green"
              subtitle={`总成员: ${stats.associations.totalMembers}`}
            />
            <XiuxianStatCard
              title="定时任务总数"
              value={stats.system.activeTasks}
              icon={<ClockCircleOutlined />}
              gradient="yellow"
              subtitle={`运行时间: ${stats.system.uptime}`}
            />
            <XiuxianStatCard
              title="数据更新时间"
              value={new Date(stats.rankings.lastUpdate).toLocaleString(
                'zh-CN'
              )}
              icon={<RiseOutlined />}
              gradient="purple"
              subtitle={`最后更新: ${new Date(stats.rankings.lastUpdate).toLocaleString('zh-CN')}`}
            />
          </div>

          {/* 排行榜区域 */}
          <XiuxianTableContainer title="排行榜数据" icon={<TrophyOutlined />}>
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
          </XiuxianTableContainer>
        </>
      )}

      {!stats && !loading && (
        <XiuxianEmptyState
          icon={
            <ExclamationCircleOutlined className="text-6xl text-slate-400" />
          }
          title="暂无数据"
          description="请点击刷新按钮获取最新数据"
        />
      )}
    </XiuxianPageWrapper>
  )
}
