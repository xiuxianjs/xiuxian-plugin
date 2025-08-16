import React, { useState, useEffect } from 'react'
import { Table, Modal, message, Tag, Tooltip } from 'antd'
import {
  EyeOutlined,
  TeamOutlined,
  FireOutlined,
  CrownOutlined,
  ReloadOutlined,
  SearchOutlined,
  BankOutlined
} from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import { getAssociationsAPI, getAssociationsStatsAPI } from '@/api/auth'
import type { ColumnsType } from 'antd/es/table'

const pageSize = 10

interface Association {
  name: string
  宗门名称: string
  宗门等级: number
  宗主: string
  power: number
  所有成员: string[]
  副宗主: string[]
  长老: string[]
  内门弟子: string[]
  外门弟子: string[]
  灵石池: number
  宗门驻地: string | number
  宗门神兽: string | number
  最低加入境界: number
  创立时间: [string, number]
  维护时间: number
  大阵血量: number
}

export default function AssociationManager() {
  const { user } = useAuth()
  const [associations, setAssociations] = useState<Association[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedAssociation, setSelectedAssociation] =
    useState<Association | null>(null)
  const [associationDetailVisible, setAssociationDetailVisible] =
    useState(false)

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
    totalMembers: 0,
    totalPower: 0,
    totalLingshi: 0,
    xianjieCount: 0,
    fanjieCount: 0
  })

  // 获取宗门数据
  const fetchAssociations = async (page = 1, pSize = pageSize) => {
    if (!user) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      const result = await getAssociationsAPI(token, {
        page,
        pageSize: pSize,
        search: searchText
      })

      if (result.success && result.data) {
        setAssociations(result.data.list)
        setPagination(result.data.pagination)
      } else {
        message.error(result.message || '获取宗门数据失败')
      }
    } catch (error) {
      console.error('获取宗门数据失败:', error)
      message.error('获取宗门数据失败')
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

      const result = await getAssociationsStatsAPI(token, {
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
    fetchAssociations(1, pageSize)
    fetchStats()
  }, [user])

  // 处理搜索变化
  const handleSearchAndFilter = () => {
    fetchAssociations(1, pagination.pageSize)
    fetchStats()
  }

  // 处理分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    fetchAssociations(page, pageSize)
  }

  // 获取境界名称
  const getLevelName = (levelId: number) => {
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

  // 获取宗门类型
  const getAssociationType = (power: number) => {
    return power > 0 ? '仙界' : '凡界'
  }

  // 表格列定义
  const columns: ColumnsType<Association> = [
    {
      title: '宗门信息',
      key: 'associationInfo',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
            {record.宗门名称?.charAt(0) || '宗'}
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.宗门名称}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              等级: {record.宗门等级}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              宗主: {record.宗主}
            </div>
          </div>
        </div>
      )
    },
    {
      title: '宗门类型',
      key: 'type',
      width: 100,
      render: (_, record) => (
        <Tag color={record.power > 0 ? 'purple' : 'blue'}>
          {getAssociationType(record.power)}
        </Tag>
      )
    },
    {
      title: '成员统计',
      key: 'members',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            总成员: {record.所有成员?.length || 0}
          </div>
          <div style={{ fontSize: '12px' }}>
            副宗主: {record.副宗主?.length || 0}
          </div>
          <div style={{ fontSize: '12px' }}>
            长老: {record.长老?.length || 0}
          </div>
        </div>
      )
    },
    {
      title: '资源信息',
      key: 'resources',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#52c41a' }}>
            灵石池: {record.灵石池?.toLocaleString() || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#faad14' }}>
            大阵血量: {record.大阵血量?.toLocaleString() || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#722ed1' }}>
            最低境界: {getLevelName(record.最低加入境界)}
          </div>
        </div>
      )
    },
    {
      title: '宗门驻地',
      key: 'location',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>{record.宗门驻地 || '无驻地'}</div>
          <div style={{ fontSize: '12px' }}>
            神兽: {record.宗门神兽 || '无'}
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
              setSelectedAssociation(record)
              setAssociationDetailVisible(true)
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
        <h1 className="text-2xl font-bold text-gray-800">宗门管理</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          onClick={() => fetchAssociations(1, pagination.pageSize)}
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
              <TeamOutlined className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">总宗门数</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.total || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CrownOutlined className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">仙界宗门</p>
              <p className="text-2xl font-bold text-purple-600">
                {(stats.xianjieCount || 0).toLocaleString()}
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
              <p className="text-sm text-gray-600">总灵石池</p>
              <p className="text-2xl font-bold text-green-600">
                {(stats.totalLingshi || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FireOutlined className="text-orange-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">总成员数</p>
              <p className="text-2xl font-bold text-orange-600">
                {(stats.totalMembers || 0).toLocaleString()}
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
              placeholder="搜索宗门名称"
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

      {/* 宗门表格 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table
          columns={columns}
          dataSource={associations}
          rowKey="name"
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

      {/* 宗门详情弹窗 */}
      <Modal
        title="宗门详情"
        open={associationDetailVisible}
        onCancel={() => setAssociationDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedAssociation && (
          <div className="space-y-6">
            {/* 基础信息 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                基础信息
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">宗门名称</label>
                  <p className="font-medium">{selectedAssociation.宗门名称}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">宗门等级</label>
                  <p className="font-medium">{selectedAssociation.宗门等级}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">宗主</label>
                  <p className="font-medium">{selectedAssociation.宗主}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">宗门类型</label>
                  <Tag
                    color={selectedAssociation.power > 0 ? 'purple' : 'blue'}
                  >
                    {getAssociationType(selectedAssociation.power)}
                  </Tag>
                </div>
                <div>
                  <label className="text-sm text-gray-600">最低加入境界</label>
                  <p className="font-medium">
                    {getLevelName(selectedAssociation.最低加入境界)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">创立时间</label>
                  <p className="font-medium">
                    {selectedAssociation.创立时间?.[0] || '未知'}
                  </p>
                </div>
              </div>
            </div>

            {/* 成员信息 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                成员信息
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">总成员数</label>
                  <p className="text-xl font-bold text-blue-600">
                    {selectedAssociation.所有成员?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">副宗主数</label>
                  <p className="text-xl font-bold text-purple-600">
                    {selectedAssociation.副宗主?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">长老数</label>
                  <p className="text-xl font-bold text-green-600">
                    {selectedAssociation.长老?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">内门弟子数</label>
                  <p className="text-xl font-bold text-orange-600">
                    {selectedAssociation.内门弟子?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">外门弟子数</label>
                  <p className="text-xl font-bold text-red-600">
                    {selectedAssociation.外门弟子?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* 资源信息 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                资源信息
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">灵石池</label>
                  <p className="text-xl font-bold text-green-600">
                    {selectedAssociation.灵石池?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">大阵血量</label>
                  <p className="text-xl font-bold text-red-600">
                    {selectedAssociation.大阵血量?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">宗门驻地</label>
                  <p className="text-xl font-bold text-blue-600">
                    {selectedAssociation.宗门驻地 || '无驻地'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">宗门神兽</label>
                  <p className="text-xl font-bold text-purple-600">
                    {selectedAssociation.宗门神兽 || '无'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">维护时间</label>
                  <p className="text-xl font-bold text-yellow-600">
                    {selectedAssociation.维护时间
                      ? new Date(selectedAssociation.维护时间).toLocaleString()
                      : '-'}
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
