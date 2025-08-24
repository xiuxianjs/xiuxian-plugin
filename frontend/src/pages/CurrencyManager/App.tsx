import React, { useEffect } from 'react'
import { DollarOutlined, PlusOutlined } from '@ant-design/icons'
import { useCurrencyManager } from './hooks/useCurrencyManager'
import StatsCards from './components/StatsCards'
import TabNavigation from './components/TabNavigation'
import UserCurrencyTab from './components/UserCurrencyTab'
import RechargeRecordsTab from './components/RechargeRecordsTab'
import StatsTab from './components/StatsTab'
import RechargeModal from './components/RechargeModal'

// 导入UI组件库
import {
  XiuxianPageWrapper,
  XiuxianPageTitle,
  XiuxianTableContainer,
  XiuxianRefreshButton
} from '@/components/ui'

export default function CurrencyManager() {
  const {
    loading,
    users,
    records,
    stats,
    config,
    selectedTab,
    rechargeModalVisible,
    selectedUser,
    rechargeForm,
    setSelectedTab,
    setRechargeModalVisible,
    setSelectedUser,
    fetchUsers,
    fetchRecords,
    fetchStats,
    fetchConfig,
    handleRechargeOk
  } = useCurrencyManager()

  useEffect(() => {
    fetchUsers()
    fetchStats()
  }, [])

  const handleRefresh = () => {
    fetchUsers()
    fetchRecords()
    fetchStats()
    fetchConfig()
  }

  return (
    <XiuxianPageWrapper>
      {/* 页面标题和操作按钮 */}
      <XiuxianPageTitle
        icon={<DollarOutlined />}
        title="货币管理系统"
        subtitle="管理用户金币、月卡和充值记录"
        actions={
          <div className="flex gap-2">
            <button
              className="px-2 py-1 rounded-md bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              onClick={() => {
                setSelectedUser(null)
                setRechargeModalVisible(true)
              }}
            >
              <PlusOutlined />
              充值
            </button>
            <XiuxianRefreshButton loading={loading} onClick={handleRefresh} />
          </div>
        }
      />

      {/* 统计卡片 */}
      {stats && <StatsCards stats={stats} />}

      {/* 标签页导航 */}
      <TabNavigation
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        onRecordsTabClick={() => {
          setSelectedTab('records')
          fetchRecords()
        }}
      />

      {/* 内容区域 */}
      <XiuxianTableContainer
        title={
          (selectedTab === 'users' && '用户货币管理') ||
          (selectedTab === 'records' && '充值记录管理') ||
          (selectedTab === 'stats' && '统计分析') ||
          '货币管理'
        }
        icon={<DollarOutlined />}
      >
        {/* 用户货币管理 */}
        {selectedTab === 'users' && (
          <UserCurrencyTab
            users={users}
            loading={loading}
            onRefresh={fetchUsers}
            onStatsRefresh={fetchStats}
          />
        )}

        {/* 充值记录管理 */}
        {selectedTab === 'records' && (
          <RechargeRecordsTab
            records={records}
            loading={loading}
            config={config}
          />
        )}

        {/* 统计分析 */}
        {selectedTab === 'stats' && <StatsTab stats={stats} />}
      </XiuxianTableContainer>

      {/* 充值弹窗 */}
      <RechargeModal
        visible={rechargeModalVisible}
        user={selectedUser}
        config={config}
        users={users}
        onCancel={() => {
          setRechargeModalVisible(false)
          setSelectedUser(null)
          rechargeForm.resetFields()
        }}
        onOk={handleRechargeOk}
        form={rechargeForm}
      />
    </XiuxianPageWrapper>
  )
}
