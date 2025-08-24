import React, { useEffect } from 'react'
import { DollarOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons'
import { useCurrencyManager } from './hooks/useCurrencyManager'
import StatsCards from './components/StatsCards'
import TabNavigation from './components/TabNavigation'
import UserCurrencyTab from './components/UserCurrencyTab'
import RechargeRecordsTab from './components/RechargeRecordsTab'
import StatsTab from './components/StatsTab'
import RechargeModal from './components/RechargeModal'

export default function CurrencyManager() {
  const {
    loading,
    users,
    records,
    stats,
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
    handleRechargeOk
  } = useCurrencyManager()

  useEffect(() => {
    fetchUsers()
    fetchStats()
  }, [])

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10 p-2 md:p-6 h-full overflow-y-auto">
        {/* 页面标题和操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <DollarOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                货币管理系统
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                管理用户金币、月卡和充值记录
              </p>
            </div>
          </div>
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
            <button
              className="px-2 py-1 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              onClick={() => {
                fetchUsers()
                fetchRecords()
                fetchStats()
              }}
            >
              <ReloadOutlined />
              刷新数据
            </button>
          </div>
        </div>

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
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarOutlined className="text-purple-400" />
              {selectedTab === 'users' && '用户货币管理'}
              {selectedTab === 'records' && '充值记录管理'}
              {selectedTab === 'stats' && '统计分析'}
            </h3>
          </div>

          <div className="p-6">
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
              <RechargeRecordsTab records={records} loading={loading} />
            )}

            {/* 统计分析 */}
            {selectedTab === 'stats' && <StatsTab stats={stats} />}
          </div>
        </div>

        {/* 充值弹窗 */}
        <RechargeModal
          visible={rechargeModalVisible}
          user={selectedUser}
          onCancel={() => {
            setRechargeModalVisible(false)
            setSelectedUser(null)
            rechargeForm.resetFields()
          }}
          onOk={handleRechargeOk}
          form={rechargeForm}
        />
      </div>
    </div>
  )
}
