import React from 'react'
import { Table, Tooltip } from 'antd'
import {
  EyeOutlined,
  ShoppingOutlined,
  BankOutlined,
  GiftOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { Najie } from '@/types'
import NajieInfo from './modals/NajieInfo'
import { useNajieManagerCode } from './NajieManager.code'

export default function NajieManager() {
  const {
    najieList,
    loading,
    searchText,
    selectedNajie,
    najieDetailVisible,
    pagination,
    stats,
    fetchNajie,
    handleSearchAndFilter,
    handleTableChange,
    getTotalItems,
    setSearchText,
    setSelectedNajie,
    setNajieDetailVisible
  } = useNajieManagerCode()

  // 表格列定义
  const columns: ColumnsType<Najie> = [
    {
      title: (
        <div className="flex items-center gap-2 text-purple-400 font-bold">
          <span>用户信息</span>
        </div>
      ),
      key: 'userInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <div className="font-bold text-white">用户ID: {record.userId}</div>
          <div className="text-xs text-slate-400">
            背包等级: {record.等级 || 1}
          </div>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-green-400 font-bold">
          <span>灵石信息</span>
        </div>
      ),
      key: 'lingshi',
      width: 120,
      render: (_, record) => (
        <div>
          <div className="text-xs text-green-500">
            当前: {record.灵石?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-yellow-500">
            上限: {record.灵石上限?.toLocaleString() || 0}
          </div>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-blue-400 font-bold">
          <span>物品统计</span>
        </div>
      ),
      key: 'items',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="text-xs text-slate-300">
            总物品: {getTotalItems(record)}
          </div>
          <div className="text-xs text-slate-300">
            装备: {record.装备?.length || 0}
          </div>
          <div className="text-xs text-slate-300">
            丹药: {record.丹药?.length || 0}
          </div>
          <div className="text-xs text-slate-300">
            道具: {record.道具?.length || 0}
          </div>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-yellow-400 font-bold">
          <span>其他物品</span>
        </div>
      ),
      key: 'otherItems',
      width: 150,
      render: (_, record) => (
        <div>
          <div className="text-xs text-slate-300">
            功法: {record.功法?.length || 0}
          </div>
          <div className="text-xs text-slate-300">
            草药: {record.草药?.length || 0}
          </div>
          <div className="text-xs text-slate-300">
            材料: {record.材料?.length || 0}
          </div>
          <div className="text-xs text-slate-300">
            仙宠: {record.仙宠?.length || 0}
          </div>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <span>操作</span>
        </div>
      ),
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Tooltip title="查看详情">
          <button
            className="px-3 py-1 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-1"
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
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10  p-2 md:p-6 h-full overflow-y-auto">
        {/* 页面标题和刷新按钮 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                背包管理
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                管理修仙界道友的背包物品
              </p>
            </div>
          </div>
          <button
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
            onClick={() => fetchNajie(1, pagination.pageSize)}
            disabled={loading}
          >
            <ReloadOutlined className={loading ? 'animate-spin' : ''} />
            {loading ? '刷新中...' : '刷新数据'}
          </button>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">总背包数</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {(stats.total || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingOutlined className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">总灵石</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {(stats.totalLingshi || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <BankOutlined className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">总物品数</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {(stats.totalItems || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <GiftOutlined className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">装备总数</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {(stats.categoryStats?.装备 || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <GiftOutlined className="text-white text-xl" />
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
                placeholder="搜索用户ID"
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearchAndFilter()}
              />
            </div>
            <button
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              onClick={handleSearchAndFilter}
            >
              搜索
            </button>
          </div>
        </div>

        {/* 背包表格 */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingOutlined className="text-purple-400" />
              背包列表
            </h3>
          </div>
          <Table
            columns={columns}
            dataSource={najieList}
            rowKey="userId"
            loading={loading}
            rowClassName={record => {
              // 如果是损坏数据，添加黄色背景
              return record.数据状态 === 'corrupted'
                ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-l-4 border-yellow-400  bg-slate-700 hover:bg-slate-600'
                : 'hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 transition-all duration-300 bg-slate-700 hover:bg-slate-600'
            }}
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
            className="bg-transparent xiuxian-table"
          />
        </div>

        {/* 背包详情弹窗 */}
        <NajieInfo
          najieDetailVisible={najieDetailVisible}
          setNajieDetailVisible={setNajieDetailVisible}
          selectedNajie={selectedNajie}
          getTotalItems={getTotalItems}
        />
      </div>
    </div>
  )
}
