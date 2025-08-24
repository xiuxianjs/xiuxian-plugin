import React from 'react'
import classNames from 'classnames'
import { Table, Tag, Tooltip, Avatar } from 'antd'
import {
  EyeOutlined,
  EditOutlined,
  UserOutlined,
  TrophyOutlined,
  FireOutlined,
  CrownOutlined,
  SearchOutlined,
  StarOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  GoldOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { GameUser } from '@/types/types'
import UserInfo from './UserInfo'
import UserEditModal from './UserEditModal'
import { useUserManagerCode } from './UserManager.code'
import { levelNames } from '@/config'

// 导入UI组件库
import {
  XiuxianPageWrapper,
  XiuxianPageTitle,
  XiuxianStatCard,
  XiuxianSearchBar,
  XiuxianTableContainer,
  XiuxianRefreshButton,
  XiuxianUserAvatar,
  XiuxianTableWithPagination
} from '@/components/ui'

export default function UserManager() {
  const {
    gameUsers,
    loading,
    searchText,
    setSearchText,
    setSelectedUser,
    setUserDetailVisible,
    setUserEditVisible,
    stats,
    pagination,
    fetchGameUsers,
    handleSearchAndFilter,
    handleTableChange,
    handleEditUser,
    handleSaveUser,
    getSexDisplay,
    getLinggenColor,
    getLevelName,
    userDetailVisible,
    userEditVisible,
    editLoading,
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
          <XiuxianUserAvatar
            src={record.avatar}
            size={48}
            name={record.名号}
            online={true}
          />
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
      width: 150,
      render: (_, record) => (
        <div className="p-3 space-y-2">
          <Tooltip title="查看修仙详情">
            <button
              className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 text-sm flex items-center gap-2"
              onClick={() => {
                setSelectedUser(record)
                setUserDetailVisible(true)
              }}
            >
              <EyeOutlined />
              查看
            </button>
          </Tooltip>
          <Tooltip title="编辑用户信息">
            <button
              className="w-full px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 text-sm flex items-center gap-2"
              onClick={() => handleEditUser(record)}
            >
              <EditOutlined />
              编辑
            </button>
          </Tooltip>
        </div>
      )
    }
  ]

  return (
    <XiuxianPageWrapper>
      {/* 页面标题和刷新按钮 */}
      <XiuxianPageTitle
        icon={<CrownOutlined />}
        title="用户管理"
        subtitle="管理修仙界众位道友信息"
        actions={
          <XiuxianRefreshButton
            loading={loading}
            onClick={() => fetchGameUsers(1, pagination.pageSize)}
          />
        }
      />

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <XiuxianStatCard
          title="总修仙者"
          value={(stats.total || 0).toLocaleString()}
          icon={<UserOutlined />}
          gradient="blue"
        />
        <XiuxianStatCard
          title="高阶修士"
          value={(stats.highLevel || 0).toLocaleString()}
          icon={<CrownOutlined />}
          gradient="green"
        />
        <XiuxianStatCard
          title="总灵石"
          value={(Number(stats.totalLingshi) || 0).toLocaleString('en-US', {
            notation: 'compact',
            maximumFractionDigits: 2
          })}
          icon={<TrophyOutlined />}
          gradient="purple"
        />
        <XiuxianStatCard
          title="总轮回"
          value={(stats.totalLunhui || 0).toLocaleString()}
          icon={<FireOutlined />}
          gradient="yellow"
        />
      </div>

      {/* 搜索栏 */}
      <XiuxianSearchBar
        placeholder="搜索修仙者名号或ID..."
        value={searchText}
        onChange={setSearchText}
        onSearch={handleSearchAndFilter}
        onKeyPress={e => e.key === 'Enter' && handleSearchAndFilter()}
        className="mb-6"
      />

      {/* 用户表格 */}
      <XiuxianTableContainer
        title="修仙者列表"
        icon={<UserOutlined />}
      >
        <XiuxianTableWithPagination
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
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          onPaginationChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </XiuxianTableContainer>

      {/* 用户详情弹窗 */}
      <UserInfo
        userDetailVisible={userDetailVisible}
        setUserDetailVisible={setUserDetailVisible}
        selectedUser={selectedUser}
        getSexDisplay={getSexDisplay}
        getLevelName={getLevelName}
        getLinggenColor={getLinggenColor}
      />

      {/* 用户编辑弹窗 */}
      <UserEditModal
        visible={userEditVisible}
        onCancel={() => setUserEditVisible(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        loading={editLoading}
        getSexDisplay={getSexDisplay}
        getLinggenColor={getLinggenColor}
      />
    </XiuxianPageWrapper>
  )
}
