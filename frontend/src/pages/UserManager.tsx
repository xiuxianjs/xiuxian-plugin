import React from 'react'
import classNames from 'classnames'
import { Table, Tag, Tooltip, Avatar } from 'antd'
import {
  EyeOutlined,
  UserOutlined,
  TrophyOutlined,
  FireOutlined,
  CrownOutlined,
  ReloadOutlined,
  SearchOutlined,
  StarOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  GoldOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { GameUser } from '@/types'
import UserInfo from './modals/UserInfo'
import { useUserManagerCode } from './UserManager.code'
import { levelNames } from '@/config'

export default function UserManager() {
  const {
    gameUsers,
    loading,
    searchText,
    setSearchText,
    setSelectedUser,
    setUserDetailVisible,
    stats,
    pagination,
    fetchGameUsers,
    handleSearchAndFilter,
    handleTableChange,
    getSexDisplay,
    getLinggenColor,
    getLevelName,
    userDetailVisible,
    selectedUser
  } = useUserManagerCode()

  // 表格列定义
  const columns: ColumnsType<GameUser> = [
    {
      title: (
        <div className="flex items-center gap-2 text-purple-400 font-bold">
          <UserOutlined className="text-lg" />
          <span>修仙者信息</span>
        </div>
      ),
      key: 'userInfo',
      width: 220,
      render: (_, record) => (
        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg">
          <div className="relative">
            <Avatar
              src={record.avatar}
              size={48}
              className="border-2 border-purple-500/50"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="font-bold text-white text-lg mb-1">
              {record.名号}
            </div>
            <div className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full inline-block">
              ID: {record.id}
            </div>
            <div className="text-xs text-slate-300 mt-1">
              <span className="inline-flex items-center gap-1">
                <HeartOutlined className="text-pink-400" />
                {getSexDisplay(record.sex)}
              </span>
              <span className="mx-2 text-slate-500">|</span>
              <span className="inline-flex items-center gap-1">
                <StarOutlined className="text-yellow-400" />
                轮回: {record.lunhui}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-blue-400 font-bold">
          <CrownOutlined className="text-lg" />
          <span>境界修为</span>
        </div>
      ),
      key: 'level',
      width: 160,
      render: (_, record) => (
        <div className="p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-xl shadow-lg">
          <div className="font-bold text-blue-400 text-lg mb-2">
            {levelNames[record.level_id]}
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-300 bg-slate-700/50 px-2 py-1 rounded-full">
              修为: {(record.修为 || 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-300 bg-slate-700/50 px-2 py-1 rounded-full">
              血气: {(record.血气 || 0).toLocaleString()}
            </div>
          </div>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-green-400 font-bold">
          <ThunderboltOutlined className="text-lg" />
          <span>灵根资质</span>
        </div>
      ),
      key: 'linggen',
      width: 130,
      render: (_, record) => (
        <div className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-xl shadow-lg">
          <Tag
            color={getLinggenColor(record.灵根)}
            className="text-sm font-bold px-3 py-1 border-0"
          >
            {record.灵根?.name || '未知'}
          </Tag>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-red-400 font-bold">
          <SafetyOutlined className="text-lg" />
          <span>战斗属性</span>
        </div>
      ),
      key: 'combat',
      width: 160,
      render: (_, record) => (
        <div className="p-3 bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl shadow-lg">
          <div className="space-y-1">
            <div className="text-xs text-slate-300 bg-slate-700/50 px-2 py-1 rounded-full">
              攻击: {(record.攻击 || 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-300 bg-slate-700/50 px-2 py-1 rounded-full">
              防御: {(record.防御 || 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-300 bg-slate-700/50 px-2 py-1 rounded-full">
              血量: {(record.当前血量 || 0).toLocaleString()}/
              {(record.血量上限 || 0).toLocaleString()}
            </div>
          </div>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-yellow-400 font-bold">
          <GoldOutlined className="text-lg" />
          <span>修仙资源</span>
        </div>
      ),
      key: 'resources',
      width: 140,
      render: (_, record) => (
        <div className="p-3 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-xl shadow-lg">
          <div className="space-y-1">
            <div className="text-xs text-green-400 bg-slate-700/50 px-2 py-1 rounded-full font-medium">
              灵石: {(record.灵石 || 0).toLocaleString()}
            </div>
            <div className="text-xs text-yellow-400 bg-slate-700/50 px-2 py-1 rounded-full font-medium">
              神石: {(record.神石 || 0).toLocaleString()}
            </div>
            <div className="text-xs text-purple-400 bg-slate-700/50 px-2 py-1 rounded-full font-medium">
              轮回点: {record.轮回点}
            </div>
          </div>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-purple-400 font-bold">
          <TrophyOutlined className="text-lg" />
          <span>修仙成就</span>
        </div>
      ),
      key: 'achievements',
      width: 140,
      render: (_, record) => (
        <div className="p-3 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-lg">
          <div className="space-y-1">
            <div className="text-xs text-slate-300 bg-slate-700/50 px-2 py-1 rounded-full">
              镇妖塔: {record.镇妖塔层数}层
            </div>
            <div className="text-xs text-slate-300 bg-slate-700/50 px-2 py-1 rounded-full">
              神魄段: {record.神魄段数}段
            </div>
            <div className="text-xs text-slate-300 bg-slate-700/50 px-2 py-1 rounded-full">
              魔道值: {record.魔道值}
            </div>
          </div>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-blue-400 font-bold">
          <EyeOutlined className="text-lg" />
          <span>操作</span>
        </div>
      ),
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <div className="p-3">
          <Tooltip title="查看修仙详情">
            <button
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 text-sm flex items-center gap-2"
              onClick={() => {
                setSelectedUser(record)
                setUserDetailVisible(true)
              }}
            >
              <EyeOutlined />
              查看
            </button>
          </Tooltip>
        </div>
      )
    }
  ]

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10 p-2 md:p-6 h-full overflow-y-auto">
        {/* 页面标题和刷新按钮 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <CrownOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                用户管理
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                管理修仙界众位道友信息
              </p>
            </div>
          </div>
          <button
            className="p-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-3"
            onClick={() => fetchGameUsers(1, pagination.pageSize)}
            disabled={loading}
          >
            <ReloadOutlined
              className={classNames('text-lg', { 'animate-spin': loading })}
            />
            {loading ? '刷新中...' : '刷新数据'}
          </button>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">总修仙者</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {(stats.total || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <UserOutlined className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">高阶修士</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {(stats.highLevel || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <CrownOutlined className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">总灵石</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {(stats.totalLingshi || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrophyOutlined className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">总轮回</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {(stats.totalLunhui || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <FireOutlined className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <SearchOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                placeholder="搜索修仙者名号或ID..."
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearchAndFilter()}
              />
            </div>
            <button
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              onClick={handleSearchAndFilter}
            >
              搜索
            </button>
          </div>
        </div>

        {/* 用户表格 */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <UserOutlined className="text-purple-400" />
              修仙者列表
            </h3>
          </div>
          <Table
            columns={columns}
            dataSource={gameUsers}
            rowKey="id"
            loading={loading}
            rowClassName={record =>
              classNames({
                'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-l-4 border-yellow-400 bg-slate-700 hover:bg-slate-600':
                  record.数据状态 === 'corrupted',
                'hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 transition-all duration-300 bg-slate-700 hover:bg-slate-600':
                  record.数据状态 !== 'corrupted'
              })
            }
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              onChange: handleTableChange,
              className: 'p-6'
            }}
            scroll={{ x: 1200 }}
            className={classNames('bg-transparent', 'xiuxian-table')}
          />
        </div>

        {/* 用户详情弹窗 */}
        <UserInfo
          userDetailVisible={userDetailVisible}
          setUserDetailVisible={setUserDetailVisible}
          selectedUser={selectedUser}
          getSexDisplay={getSexDisplay}
          getLevelName={getLevelName}
          getLinggenColor={getLinggenColor}
        />
      </div>
    </div>
  )
}
