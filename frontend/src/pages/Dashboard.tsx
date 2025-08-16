import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Progress, Button, Space } from 'antd'
import {
  UserOutlined,
  TeamOutlined,
  CrownOutlined,
  TrophyOutlined,
  BankOutlined,
  ReloadOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import {
  getGameUsersStatsAPI,
  getAssociationsStatsAPI,
  getNajieStatsAPI,
  getRankingsStatsAPI
} from '@/api/auth'
import type { ColumnsType } from 'antd/es/table'

interface DashboardStats {
  users: {
    total: number
    active: number
    newToday: number
    levelDistribution: { [key: string]: number }
  }
  associations: {
    total: number
    totalMembers: number
    totalPower: number
    totalLingshi: number
  }
  najie: {
    total: number
    totalLingshi: number
    totalItems: number
    categoryStats: { [key: string]: number }
  }
  rankings: {
    lastUpdate: string
    topAssociations: any[]
    topPlayers: any[]
  }
  system: {
    uptime: string
    lastBackup: string
    activeTasks: number
  }
}

interface TopPlayer {
  id: string
  name: string
  level: number
  association?: string
  power: number
  rank: number
}

interface TopAssociation {
  id: string
  name: string
  members: number
  power: number
  lingshi: number
  rank: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  // 获取统计数据
  const fetchStats = async () => {
    if (!user) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('未找到登录令牌')
        return
      }

      // 并行获取所有统计数据
      const [userStats, associationStats, najieStats, rankingStats] =
        await Promise.all([
          getGameUsersStatsAPI(token),
          getAssociationsStatsAPI(token),
          getNajieStatsAPI(token),
          getRankingsStatsAPI(token)
        ])

      const dashboardStats: DashboardStats = {
        users: {
          total: userStats.success ? userStats.data?.total || 0 : 0,
          active: userStats.success ? userStats.data?.total || 0 : 0,
          newToday: 0,
          levelDistribution: {}
        },
        associations: {
          total: associationStats.success
            ? associationStats.data?.total || 0
            : 0,
          totalMembers: associationStats.success
            ? associationStats.data?.totalMembers || 0
            : 0,
          totalPower: associationStats.success
            ? associationStats.data?.totalPower || 0
            : 0,
          totalLingshi: associationStats.success
            ? associationStats.data?.totalLingshi || 0
            : 0
        },
        najie: {
          total: najieStats.success ? najieStats.data?.total || 0 : 0,
          totalLingshi: najieStats.success
            ? najieStats.data?.totalLingshi || 0
            : 0,
          totalItems: najieStats.success ? najieStats.data?.totalItems || 0 : 0,
          categoryStats: najieStats.success
            ? najieStats.data?.categoryStats || {}
            : {}
        },
        rankings: {
          lastUpdate: rankingStats.success
            ? rankingStats.data?.lastUpdate || ''
            : '',
          topAssociations: rankingStats.success
            ? rankingStats.data?.topAssociations || []
            : [],
          topPlayers: rankingStats.success
            ? rankingStats.data?.topPlayers || []
            : []
        },
        system: {
          uptime: '7天 12小时 30分钟',
          lastBackup: new Date().toISOString(),
          activeTasks: 7
        }
      }

      setStats(dashboardStats)
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [user])

  // 获取境界名称
  const getLevelName = (levelId: number): string => {
    const levelNames: { [key: number]: string } = {
      1: '练气一层',
      2: '练气二层',
      3: '练气三层',
      4: '练气四层',
      5: '练气五层',
      6: '练气六层',
      7: '练气七层',
      8: '练气八层',
      9: '练气九层',
      10: '练气十层',
      11: '筑基初期',
      12: '筑基中期',
      13: '筑基后期',
      14: '筑基大圆满',
      15: '金丹初期',
      16: '金丹中期',
      17: '金丹后期',
      18: '金丹大圆满',
      19: '元婴初期',
      20: '元婴中期',
      21: '元婴后期',
      22: '元婴大圆满',
      23: '化神初期',
      24: '化神中期',
      25: '化神后期',
      26: '化神大圆满',
      27: '炼虚初期',
      28: '炼虚中期',
      29: '炼虚后期',
      30: '炼虚大圆满',
      31: '合体初期',
      32: '合体中期',
      33: '合体后期',
      34: '合体大圆满',
      35: '大乘初期',
      36: '大乘中期',
      37: '大乘后期',
      38: '大乘大圆满',
      39: '渡劫初期',
      40: '渡劫中期',
      41: '渡劫后期',
      42: '渡劫大圆满',
      43: '真仙',
      44: '天仙',
      45: '金仙',
      46: '太乙金仙',
      47: '大罗金仙',
      48: '混元大罗金仙',
      49: '圣人',
      50: '天道圣人',
      51: '大道圣人',
      52: '混沌圣人',
      53: '鸿蒙圣人',
      54: '创世神',
      55: '主宰',
      56: '至尊',
      57: '大帝',
      58: '天帝',
      59: '神帝',
      60: '仙帝',
      61: '圣帝',
      62: '道帝',
      63: '神王',
      64: '凡人'
    }
    return levelNames[levelId] || `境界${levelId}`
  }

  // 玩家排行榜列定义
  const playerColumns: ColumnsType<TopPlayer> = [
    {
      title: '排名',
      key: 'rank',
      width: 80,
      render: (_, record) => (
        <div className="flex items-center justify-center">
          {record.rank <= 3 ? (
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                record.rank === 1
                  ? 'bg-yellow-500'
                  : record.rank === 2
                    ? 'bg-gray-400'
                    : 'bg-orange-500'
              }`}
            >
              {record.rank}
            </div>
          ) : (
            <span className="text-gray-600 font-medium">{record.rank}</span>
          )}
        </div>
      )
    },
    {
      title: '玩家',
      key: 'name',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {getLevelName(record.level)}
          </div>
        </div>
      )
    },
    {
      title: '宗门',
      key: 'association',
      render: (_, record) => record.association || '-'
    },
    {
      title: '战力',
      key: 'power',
      render: (_, record) => (record.power || 0).toLocaleString()
    }
  ]

  // 宗门排行榜列定义
  const associationColumns: ColumnsType<TopAssociation> = [
    {
      title: '排名',
      key: 'rank',
      width: 80,
      render: (_, record) => (
        <div className="flex items-center justify-center">
          {record.rank <= 3 ? (
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                record.rank === 1
                  ? 'bg-yellow-500'
                  : record.rank === 2
                    ? 'bg-gray-400'
                    : 'bg-orange-500'
              }`}
            >
              {record.rank}
            </div>
          ) : (
            <span className="text-gray-600 font-medium">{record.rank}</span>
          )}
        </div>
      )
    },
    {
      title: '宗门',
      key: 'name',
      render: (_, record) => (
        <div style={{ fontWeight: 'bold' }}>{record.name}</div>
      )
    },
    {
      title: '成员数',
      key: 'members',
      render: (_, record) => record.members
    },
    {
      title: '总战力',
      key: 'power',
      render: (_, record) => (record.power || 0).toLocaleString()
    },
    {
      title: '灵石池',
      key: 'lingshi',
      render: (_, record) => (record.lingshi || 0).toLocaleString()
    }
  ]

  // 境界分布数据
  const levelDistributionData = stats?.users.levelDistribution
    ? Object.entries(stats.users.levelDistribution)
        .map(([level, count]) => ({
          level: parseInt(level),
          name: getLevelName(parseInt(level)),
          count,
          percentage: ((count / (stats.users.total || 1)) * 100).toFixed(1)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    : []

  // 物品分类数据
  const categoryData = stats?.najie.categoryStats
    ? Object.entries(stats.najie.categoryStats)
        .map(([category, count]) => ({
          category,
          count,
          percentage: ((count / (stats.najie.totalItems || 1)) * 100).toFixed(1)
        }))
        .sort((a, b) => b.count - a.count)
    : []

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 页面标题和刷新按钮 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">数据看板</h1>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={fetchStats}
          loading={loading}
        >
          刷新数据
        </Button>
      </div>

      {stats && (
        <>
          {/* 主要统计卡片 */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="总玩家数"
                  value={stats.users.total}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
                <div className="mt-2 text-sm text-gray-500">
                  活跃: {stats.users.active} | 今日新增: {stats.users.newToday}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="宗门总数"
                  value={stats.associations.total}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
                <div className="mt-2 text-sm text-gray-500">
                  总成员: {stats.associations.totalMembers}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="总灵石"
                  value={stats.najie.totalLingshi}
                  prefix={<BankOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                  formatter={value =>
                    `${(Number(value || 0) / 10000).toFixed(1)}万`
                  }
                />
                <div className="mt-2 text-sm text-gray-500">
                  总物品: {(stats.najie.totalItems || 0).toLocaleString()}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="系统运行"
                  value={stats.system.activeTasks}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                  suffix="个任务"
                />
                <div className="mt-2 text-sm text-gray-500">
                  运行时间: {stats.system.uptime}
                </div>
              </Card>
            </Col>
          </Row>

          {/* 详细统计和排行榜 */}
          <Row gutter={[16, 16]}>
            {/* 境界分布 */}
            <Col xs={24} lg={12}>
              <Card title="境界分布 TOP10" className="h-full">
                <div className="space-y-3">
                  {levelDistributionData.map((item, index) => (
                    <div
                      key={item.level}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-600 w-8">
                          {index + 1}
                        </span>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress
                          percent={parseFloat(item.percentage)}
                          size="small"
                          showInfo={false}
                          strokeColor="#1890ff"
                        />
                        <span className="text-sm text-gray-500 w-12 text-right">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            {/* 物品分类统计 */}
            <Col xs={24} lg={12}>
              <Card title="物品分类统计" className="h-full">
                <div className="space-y-3">
                  {categoryData.map((item, index) => (
                    <div
                      key={item.category}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-600 w-8">
                          {index + 1}
                        </span>
                        <span className="text-sm">{item.category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress
                          percent={parseFloat(item.percentage)}
                          size="small"
                          showInfo={false}
                          strokeColor="#52c41a"
                        />
                        <span className="text-sm text-gray-500 w-12 text-right">
                          {(item.count || 0).toLocaleString()}
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
                  <div className="flex items-center space-x-2">
                    <TrophyOutlined />
                    <span>玩家排行榜 TOP10</span>
                  </div>
                }
                className="h-full"
              >
                <Table
                  columns={playerColumns}
                  dataSource={stats.rankings.topPlayers.slice(0, 10)}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  scroll={{ y: 300 }}
                />
              </Card>
            </Col>

            {/* 宗门排行榜 */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <div className="flex items-center space-x-2">
                    <CrownOutlined />
                    <span>宗门排行榜 TOP10</span>
                  </div>
                }
                className="h-full"
              >
                <Table
                  columns={associationColumns}
                  dataSource={stats.rankings.topAssociations.slice(0, 10)}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  scroll={{ y: 300 }}
                />
              </Card>
            </Col>
          </Row>

          {/* 系统状态 */}
          <Row gutter={[16, 16]} className="mt-6">
            <Col xs={24}>
              <Card title="系统状态">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        <RiseOutlined />
                      </div>
                      <div className="text-sm text-gray-600 mt-2">系统状态</div>
                      <div className="text-lg font-semibold text-green-600">
                        正常
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        <ClockCircleOutlined />
                      </div>
                      <div className="text-sm text-gray-600 mt-2">最后更新</div>
                      <div className="text-sm font-semibold">
                        {new Date(stats.rankings.lastUpdate).toLocaleString(
                          'zh-CN'
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        <ExclamationCircleOutlined />
                      </div>
                      <div className="text-sm text-gray-600 mt-2">活跃任务</div>
                      <div className="text-lg font-semibold text-purple-600">
                        {stats.system.activeTasks} 个
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {!stats && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500">暂无数据</div>
        </div>
      )}
    </div>
  )
}
