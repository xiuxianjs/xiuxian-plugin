import React, { useState, useEffect } from 'react'
import { Table, Modal, message, Tag, Tooltip, Avatar } from 'antd'
import {
  EyeOutlined,
  UserOutlined,
  TrophyOutlined,
  FireOutlined,
  CrownOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import { getGameUsersAPI, getGameUsersStatsAPI } from '@/api/auth'
import type { ColumnsType } from 'antd/es/table'

const pageSize = 10

interface GameUser {
  id: string
  名号: string
  sex: string
  宣言: string
  avatar: string
  level_id: number
  Physique_id: number
  race: number
  修为: number
  血气: number
  灵石: number
  灵根: {
    id: number
    name: string
    type: string
    eff: number
    法球倍率: number
  }
  神石: number
  favorability: number
  breakthrough: boolean
  linggen: unknown[]
  linggenshow: number
  学习的功法: unknown[]
  修炼效率提升: number
  连续签到天数: number
  攻击加成: number
  防御加成: number
  生命加成: number
  power_place: number
  当前血量: number
  lunhui: number
  lunhuiBH: number
  轮回点: number
  occupation: unknown[]
  occupation_level: number
  镇妖塔层数: number
  神魄段数: number
  魔道值: number
  仙宠: unknown[]
  练气皮肤: number
  装备皮肤: number
  幸运: number
  addluckyNo: number
  师徒任务阶段: number
  师徒积分: number
  攻击: number
  防御: number
  血量上限: number
  暴击率: number
  暴击伤害: number
}

export default function UserManager() {
  const { user } = useAuth()
  const [gameUsers, setGameUsers] = useState<GameUser[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedUser, setSelectedUser] = useState<GameUser | null>(null)
  const [userDetailVisible, setUserDetailVisible] = useState(false)

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
    highLevel: 0,
    mediumLevel: 0,
    lowLevel: 0,
    totalLingshi: 0,
    totalShenshi: 0,
    totalLunhui: 0
  })

  // 获取游戏用户数据
  const fetchGameUsers = async (page = 1, pSize = pageSize) => {
    if (!user) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      const result = await getGameUsersAPI(token, {
        page,
        pageSize: pSize,
        search: searchText
      })

      if (result.success && result.data) {
        setGameUsers(result.data.list)
        setPagination(result.data.pagination)
      } else {
        message.error(result.message || '获取用户数据失败')
      }
    } catch (error) {
      console.error('获取游戏用户数据失败:', error)
      message.error('获取用户数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGameUsers(1, 20)
    fetchStats()
  }, [user])

  // 处理搜索和筛选变化
  const handleSearchAndFilter = () => {
    fetchGameUsers(1, pagination.pageSize)
    fetchStats()
  }

  // 处理分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    fetchGameUsers(page, pageSize)
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

  // 获取性别显示
  const getSexDisplay = (sex: string) => {
    return sex === '0' ? '男' : sex === '1' ? '女' : '未知'
  }

  // 获取灵根颜色
  const getLinggenColor = (linggen: unknown) => {
    if (!linggen) return 'default'
    const name = (linggen as { name?: string })?.name || ''
    if (name.includes('混沌') || name.includes('天五') || name.includes('九转'))
      return 'gold'
    if (name.includes('五灵') || name.includes('九重')) return 'purple'
    if (name.includes('三灵') || name.includes('双灵')) return 'blue'
    return 'green'
  }

  // 表格列定义
  const columns: ColumnsType<GameUser> = [
    {
      title: '用户信息',
      key: 'userInfo',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar src={record.avatar} size={40} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.名号}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              ID: {record.id}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {getSexDisplay(record.sex)} | 轮回: {record.lunhui}
            </div>
          </div>
        </div>
      )
    },
    {
      title: '境界修为',
      key: 'level',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
            {getLevelName(record.level_id)}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            修为: {(record.修为 || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            血气: {(record.血气 || 0).toLocaleString()}
          </div>
        </div>
      )
    },
    {
      title: '灵根',
      key: 'linggen',
      width: 120,
      render: (_, record) => (
        <Tag color={getLinggenColor(record.灵根)}>
          {record.灵根?.name || '未知'}
        </Tag>
      )
    },
    {
      title: '战斗属性',
      key: 'combat',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            攻击: {(record.攻击 || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px' }}>
            防御: {(record.防御 || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px' }}>
            血量: {(record.当前血量 || 0).toLocaleString()}/
            {(record.血量上限 || 0).toLocaleString()}
          </div>
        </div>
      )
    },
    {
      title: '资源',
      key: 'resources',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#52c41a' }}>
            灵石: {(record.灵石 || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#faad14' }}>
            神石: {(record.神石 || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#722ed1' }}>
            轮回点: {record.轮回点}
          </div>
        </div>
      )
    },
    {
      title: '成就',
      key: 'achievements',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>镇妖塔: {record.镇妖塔层数}层</div>
          <div style={{ fontSize: '12px' }}>神魄段: {record.神魄段数}段</div>
          <div style={{ fontSize: '12px' }}>魔道值: {record.魔道值}</div>
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
              setSelectedUser(record)
              setUserDetailVisible(true)
            }}
          >
            <EyeOutlined />
            查看
          </button>
        </Tooltip>
      )
    }
  ]

  // 获取统计数据
  const fetchStats = async () => {
    if (!user) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      const result = await getGameUsersStatsAPI(token, {
        search: searchText
      })

      if (result.success && result.data) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 页面标题和刷新按钮 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">游戏用户管理</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          onClick={() => fetchGameUsers(1, pagination.pageSize)}
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
              <UserOutlined className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">总用户数</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.total || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <CrownOutlined className="text-red-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">高级用户</p>
              <p className="text-2xl font-bold text-red-600">
                {(stats.highLevel || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrophyOutlined className="text-green-600 text-xl" />
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
              <FireOutlined className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">总轮回</p>
              <p className="text-2xl font-bold text-purple-600">
                {(stats.totalLunhui || 0).toLocaleString()}
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
              placeholder="搜索用户名或ID"
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

      {/* 用户表格 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table
          columns={columns}
          dataSource={gameUsers}
          rowKey="id"
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

      {/* 用户详情弹窗 */}
      <Modal
        title="用户详情"
        open={userDetailVisible}
        onCancel={() => setUserDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* 基础信息 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                基础信息
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">用户ID</label>
                  <p className="font-medium">{selectedUser.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">名号</label>
                  <p className="font-medium">{selectedUser.名号}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">性别</label>
                  <p className="font-medium">
                    {getSexDisplay(selectedUser.sex)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">境界</label>
                  <p className="font-medium">
                    {getLevelName(selectedUser.level_id)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">灵根</label>
                  <Tag color={getLinggenColor(selectedUser.灵根)}>
                    {selectedUser.灵根?.name || '未知'}
                  </Tag>
                </div>
                <div>
                  <label className="text-sm text-gray-600">修炼效率</label>
                  <p className="font-medium">
                    {((selectedUser.修炼效率提升 || 0) * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">宣言</label>
                  <p className="font-medium">
                    {selectedUser.宣言 || '这个人很懒还没有写'}
                  </p>
                </div>
              </div>
            </div>

            {/* 战斗属性 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                战斗属性
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">攻击力</label>
                  <p className="text-xl font-bold text-blue-600">
                    {(selectedUser.攻击 || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">防御力</label>
                  <p className="text-xl font-bold text-green-600">
                    {(selectedUser.防御 || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">当前血量</label>
                  <p className="text-xl font-bold text-red-600">
                    {(selectedUser.当前血量 || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">血量上限</label>
                  <p className="text-xl font-bold text-red-600">
                    {(selectedUser.血量上限 || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">暴击率</label>
                  <p className="text-xl font-bold text-purple-600">
                    {((selectedUser.暴击率 || 0) * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">暴击伤害</label>
                  <p className="text-xl font-bold text-purple-600">
                    {selectedUser.暴击伤害}%
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
                  <label className="text-sm text-gray-600">灵石</label>
                  <p className="text-xl font-bold text-green-600">
                    {(selectedUser.灵石 || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">神石</label>
                  <p className="text-xl font-bold text-yellow-600">
                    {(selectedUser.神石 || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">轮回点</label>
                  <p className="text-xl font-bold text-purple-600">
                    {selectedUser.轮回点}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">修为</label>
                  <p className="text-xl font-bold text-blue-600">
                    {(selectedUser.修为 || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">血气</label>
                  <p className="text-xl font-bold text-red-600">
                    {(selectedUser.血气 || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">好感度</label>
                  <p className="text-xl font-bold text-pink-600">
                    {selectedUser.favorability}
                  </p>
                </div>
              </div>
            </div>

            {/* 成就信息 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                成就信息
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">镇妖塔层数</label>
                  <p className="text-xl font-bold text-orange-600">
                    {selectedUser.镇妖塔层数}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">神魄段数</label>
                  <p className="text-xl font-bold text-indigo-600">
                    {selectedUser.神魄段数}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">魔道值</label>
                  <p className="text-xl font-bold text-red-600">
                    {selectedUser.魔道值}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">轮回次数</label>
                  <p className="text-xl font-bold text-purple-600">
                    {selectedUser.lunhui}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">连续签到</label>
                  <p className="text-xl font-bold text-green-600">
                    {selectedUser.连续签到天数}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600">幸运值</label>
                  <p className="text-xl font-bold text-yellow-600">
                    {selectedUser.幸运}
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
