import React, { useState, useEffect } from 'react'
import { Table, message } from 'antd'
import {
  TrophyOutlined,
  CrownOutlined,
  FireOutlined,
  ReloadOutlined,
  TeamOutlined,
  BankOutlined,
  StarOutlined
} from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import {
  getRankingsAPI,
  getRankingsStatsAPI,
  triggerRankingCalculationAPI
} from '@/api/auth'
import type { ColumnsType } from 'antd/es/table'

interface RankingItem {
  id: string
  name: string
  value: number
  rank: number
  extra?: any
}

interface RankingStats {
  lastUpdate: string
  associationCount: number
  playerCount: number
  topAssociations: RankingItem[]
  topPlayers: RankingItem[]
}

export default function RankingManager() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [rankingStats, setRankingStats] = useState<RankingStats | null>(null)
  const [selectedRankingType, setSelectedRankingType] =
    useState<string>('ASSOCIATION_POWER')
  const [rankingData, setRankingData] = useState<RankingItem[]>([])
  const [rankingLimit, setRankingLimit] = useState<number>(10)

  // 排名类型选项
  const rankingTypes = [
    {
      value: 'ASSOCIATION_POWER',
      label: '宗门综合实力',
      icon: <CrownOutlined />
    },
    {
      value: 'ASSOCIATION_MEMBERS',
      label: '宗门成员数',
      icon: <TeamOutlined />
    },
    {
      value: 'ASSOCIATION_LINGSHI',
      label: '宗门灵石池',
      icon: <BankOutlined />
    },
    { value: 'ASSOCIATION_LEVEL', label: '宗门等级', icon: <StarOutlined /> },
    { value: 'PLAYER_LEVEL', label: '玩家境界', icon: <FireOutlined /> },
    { value: 'PLAYER_ATTACK', label: '玩家攻击力', icon: <TrophyOutlined /> },
    { value: 'PLAYER_DEFENSE', label: '玩家防御力', icon: <TrophyOutlined /> }
  ]

  // 获取排名统计信息
  const fetchRankingStats = async () => {
    if (!user) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      const result = await getRankingsStatsAPI(token)

      if (result.success && result.data) {
        setRankingStats(result.data)
      } else {
        message.error(result.message || '获取排名统计失败')
      }
    } catch (error) {
      console.error('获取排名统计失败:', error)
      message.error('获取排名统计失败')
    }
  }

  // 获取排名数据
  const fetchRankingData = async (type: string, limit: number) => {
    if (!user) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      const result = await getRankingsAPI(token, {
        type,
        limit
      })

      if (result.success && result.data) {
        setRankingData(result.data)
      } else {
        message.error(result.message || '获取排名数据失败')
      }
    } catch (error) {
      console.error('获取排名数据失败:', error)
      message.error('获取排名数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 触发排名计算
  const handleTriggerCalculation = async () => {
    if (!user) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      message.loading('正在计算排名...', 0)
      const result = await triggerRankingCalculationAPI(token)
      message.destroy()

      if (result.success) {
        message.success('排名计算完成')
        // 重新获取数据
        fetchRankingStats()
        fetchRankingData(selectedRankingType, rankingLimit)
      } else {
        message.error(result.message || '排名计算失败')
      }
    } catch (error) {
      message.destroy()
      console.error('触发排名计算失败:', error)
      message.error('触发排名计算失败')
    }
  }

  useEffect(() => {
    fetchRankingStats()
    fetchRankingData(selectedRankingType, rankingLimit)
  }, [user])

  // 处理排名类型变化
  const handleRankingTypeChange = (type: string) => {
    setSelectedRankingType(type)
    fetchRankingData(type, rankingLimit)
  }

  // 处理排名数量变化
  const handleRankingLimitChange = (limit: number) => {
    setRankingLimit(limit)
    fetchRankingData(selectedRankingType, limit)
  }

  // 获取排名类型显示名称
  const getRankingTypeLabel = (type: string) => {
    const found = rankingTypes.find(item => item.value === type)
    return found ? found.label : type
  }

  // 表格列定义
  const columns: ColumnsType<RankingItem> = [
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
      title: '名称',
      key: 'name',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.name}</div>
          {record.extra?.名号 && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              道号: {record.extra.名号}
            </div>
          )}
          {record.extra?.宗主 && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              宗主: {record.extra.宗主}
            </div>
          )}
        </div>
      )
    },
    {
      title: '数值',
      key: 'value',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
            {(record.value || 0).toLocaleString()}
          </div>
          {record.extra?.境界 && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.extra.境界}
            </div>
          )}
        </div>
      )
    },
    {
      title: '详细信息',
      key: 'details',
      render: (_, record) => (
        <div>
          {record.extra?.成员数 && (
            <div style={{ fontSize: '12px' }}>
              成员数: {record.extra.成员数}
            </div>
          )}
          {record.extra?.宗门等级 && (
            <div style={{ fontSize: '12px' }}>
              等级: {record.extra.宗门等级}
            </div>
          )}
          {record.extra?.灵石池 && (
            <div style={{ fontSize: '12px' }}>
              灵石池: {(record.extra?.灵石池 || 0).toLocaleString()}
            </div>
          )}
          {record.extra?.攻击 && (
            <div style={{ fontSize: '12px' }}>
              攻击: {(record.extra?.攻击 || 0).toLocaleString()}
            </div>
          )}
          {record.extra?.防御 && (
            <div style={{ fontSize: '12px' }}>
              防御: {(record.extra?.防御 || 0).toLocaleString()}
            </div>
          )}
          {record.extra?.血量 && (
            <div style={{ fontSize: '12px' }}>
              血量: {(record.extra?.血量 || 0).toLocaleString()}
            </div>
          )}
          {record.extra?.宗门 && (
            <div style={{ fontSize: '12px' }}>宗门: {record.extra.宗门}</div>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 页面标题和操作按钮 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">排名管理</h1>
        <div className="flex gap-2">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={handleTriggerCalculation}
          >
            <ReloadOutlined />
            重新计算排名
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={() => {
              fetchRankingStats()
              fetchRankingData(selectedRankingType, rankingLimit)
            }}
          >
            <ReloadOutlined />
            刷新数据
          </button>
        </div>
      </div>

      {/* 统计信息 */}
      {rankingStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CrownOutlined className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">宗门总数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(rankingStats.associationCount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TeamOutlined className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">玩家总数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(rankingStats.playerCount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrophyOutlined className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">最后更新</p>
                <p className="text-lg font-bold text-gray-900">
                  {rankingStats.lastUpdate
                    ? new Date(rankingStats.lastUpdate).toLocaleString()
                    : '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <StarOutlined className="text-orange-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">当前排名类型</p>
                <p className="text-lg font-bold text-gray-900">
                  {getRankingTypeLabel(selectedRankingType)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 排名类型选择 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">排名类型</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {rankingTypes.map(type => (
            <button
              key={type.value}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedRankingType === type.value
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleRankingTypeChange(type.value)}
            >
              <div className="flex items-center gap-2">
                {type.icon}
                <span className="text-sm">{type.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 排名数量选择 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">显示数量</h3>
        <div className="flex gap-4">
          {[10, 20, 50, 100].map(limit => (
            <button
              key={limit}
              className={`px-4 py-2 rounded-lg transition-colors ${
                rankingLimit === limit
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => handleRankingLimitChange(limit)}
            >
              前{limit}名
            </button>
          ))}
        </div>
      </div>

      {/* 排名表格 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {getRankingTypeLabel(selectedRankingType)} - 前{rankingLimit}名
          </h3>
        </div>
        <Table
          columns={columns}
          dataSource={rankingData}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 800 }}
        />
      </div>
    </div>
  )
}
