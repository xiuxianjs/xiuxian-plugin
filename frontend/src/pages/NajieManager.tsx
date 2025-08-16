import React, { useState, useEffect } from 'react'
import { Table, Modal, message, Tooltip } from 'antd'
import {
  EyeOutlined,
  ShoppingOutlined,
  BankOutlined,
  GiftOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import { getNajieAPI, getNajieStatsAPI } from '@/api/auth'
import type { ColumnsType } from 'antd/es/table'

const pageSize = 10

interface NajieItem {
  name: string
  grade?: string
  pinji?: number
  数量?: number
  atk?: number
  def?: number
  HP?: number
}

interface Najie {
  userId: string
  装备: NajieItem[]
  丹药: NajieItem[]
  道具: NajieItem[]
  功法: NajieItem[]
  草药: NajieItem[]
  材料: NajieItem[]
  仙宠: NajieItem[]
  仙宠口粮: NajieItem[]
  灵石: number
  灵石上限?: number
  等级?: number
}

export default function NajieManager() {
  const { user } = useAuth()
  const [najieList, setNajieList] = useState<Najie[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedNajie, setSelectedNajie] = useState<Najie | null>(null)
  const [najieDetailVisible, setNajieDetailVisible] = useState(false)

  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
    total: 0,
    totalPages: 0
  })

  // 统计数据状态
  const [stats, setStats] = useState({
    total: 0,
    totalLingshi: 0,
    totalItems: 0,
    categoryStats: {
      装备: 0,
      丹药: 0,
      道具: 0,
      功法: 0,
      草药: 0,
      材料: 0,
      仙宠: 0,
      仙宠口粮: 0
    }
  })

  // 获取背包数据
  const fetchNajie = async (page = 1, pSize = pageSize) => {
    if (!user) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      const result = await getNajieAPI(token, {
        page,
        pageSize: pSize,
        search: searchText
      })

      if (result.success && result.data) {
        setNajieList(result.data.list)
        setPagination(result.data.pagination)
      } else {
        message.error(result.message || '获取背包数据失败')
      }
    } catch (error) {
      console.error('获取背包数据失败:', error)
      message.error('获取背包数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取统计数据
  const fetchStats = async () => {
    if (!user) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      const result = await getNajieStatsAPI(token, {
        search: searchText
      })

      if (result.success && result.data) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }

  useEffect(() => {
    fetchNajie(1, pageSize)
    fetchStats()
  }, [user])

  // 处理搜索变化
  const handleSearchAndFilter = () => {
    fetchNajie(1, pagination.pageSize)
    fetchStats()
  }

  // 处理分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    fetchNajie(page, pageSize)
  }

  // 计算背包总物品数
  const getTotalItems = (najie: Najie) => {
    const categories = [
      '装备',
      '丹药',
      '道具',
      '功法',
      '草药',
      '材料',
      '仙宠',
      '仙宠口粮'
    ] as const
    return categories.reduce((total, cat) => {
      return total + (Array.isArray(najie[cat]) ? najie[cat].length : 0)
    }, 0)
  }

  // 表格列定义
  const columns: ColumnsType<Najie> = [
    {
      title: '用户信息',
      key: 'userInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>用户ID: {record.userId}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            背包等级: {record.等级 || 1}
          </div>
        </div>
      )
    },
    {
      title: '灵石信息',
      key: 'lingshi',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#52c41a' }}>
            当前: {record.灵石?.toLocaleString() || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#faad14' }}>
            上限: {record.灵石上限?.toLocaleString() || 0}
          </div>
        </div>
      )
    },
    {
      title: '物品统计',
      key: 'items',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            总物品: {getTotalItems(record)}
          </div>
          <div style={{ fontSize: '12px' }}>
            装备: {record.装备?.length || 0}
          </div>
          <div style={{ fontSize: '12px' }}>
            丹药: {record.丹药?.length || 0}
          </div>
          <div style={{ fontSize: '12px' }}>
            道具: {record.道具?.length || 0}
          </div>
        </div>
      )
    },
    {
      title: '其他物品',
      key: 'otherItems',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            功法: {record.功法?.length || 0}
          </div>
          <div style={{ fontSize: '12px' }}>
            草药: {record.草药?.length || 0}
          </div>
          <div style={{ fontSize: '12px' }}>
            材料: {record.材料?.length || 0}
          </div>
          <div style={{ fontSize: '12px' }}>
            仙宠: {record.仙宠?.length || 0}
          </div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Tooltip title="查看详情">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm flex items-center gap-1 transition-colors"
            onClick={() => {
              setSelectedNajie(record)
              setNajieDetailVisible(true)
            }}
          >
            <EyeOutlined />
            查看
          </button>
        </Tooltip>
      )
    }
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 页面标题和刷新按钮 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">背包管理</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          onClick={() => fetchNajie(1, pagination.pageSize)}
          disabled={loading}
        >
          <ReloadOutlined className={loading ? 'animate-spin' : ''} />
          刷新数据
        </button>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingOutlined className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">总背包数</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.total || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BankOutlined className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">总灵石</p>
              <p className="text-2xl font-bold text-green-600">
                {(stats.totalLingshi || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <GiftOutlined className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">总物品数</p>
              <p className="text-2xl font-bold text-purple-600">
                {(stats.totalItems || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <GiftOutlined className="text-orange-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">装备总数</p>
              <p className="text-2xl font-bold text-orange-600">
                {(stats.categoryStats?.装备 || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索用户ID"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearchAndFilter()}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            onClick={handleSearchAndFilter}
          >
            搜索
          </button>
        </div>
      </div>

      {/* 背包表格 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table
          columns={columns}
          dataSource={najieList}
          rowKey="userId"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: handleTableChange
          }}
          scroll={{ x: 1200 }}
        />
      </div>

      {/* 背包详情弹窗 */}
      <Modal
        title="背包详情"
        open={najieDetailVisible}
        onCancel={() => setNajieDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedNajie && (
          <div className="space-y-6">
            {/* 基础信息 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                基础信息
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">用户ID</label>
                  <p className="font-medium">{selectedNajie.userId}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">背包等级</label>
                  <p className="font-medium">{selectedNajie.等级 || 1}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">总物品数</label>
                  <p className="font-medium">{getTotalItems(selectedNajie)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">当前灵石</label>
                  <p className="font-medium text-green-600">
                    {selectedNajie.灵石?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* 物品统计 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                物品统计
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">装备</label>
                  <p className="text-xl font-bold text-blue-600">
                    {selectedNajie.装备?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">丹药</label>
                  <p className="text-xl font-bold text-green-600">
                    {selectedNajie.丹药?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">道具</label>
                  <p className="text-xl font-bold text-purple-600">
                    {selectedNajie.道具?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">功法</label>
                  <p className="text-xl font-bold text-orange-600">
                    {selectedNajie.功法?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">草药</label>
                  <p className="text-xl font-bold text-red-600">
                    {selectedNajie.草药?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">材料</label>
                  <p className="text-xl font-bold text-yellow-600">
                    {selectedNajie.材料?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">仙宠</label>
                  <p className="text-xl font-bold text-pink-600">
                    {selectedNajie.仙宠?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">仙宠口粮</label>
                  <p className="text-xl font-bold text-indigo-600">
                    {selectedNajie.仙宠口粮?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
