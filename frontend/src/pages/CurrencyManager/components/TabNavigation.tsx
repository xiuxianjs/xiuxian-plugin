import React from 'react'
import classNames from 'classnames'
import {
  UserOutlined,
  HistoryOutlined,
  BarChartOutlined
} from '@ant-design/icons'

interface TabNavigationProps {
  selectedTab: string
  onTabChange: (tab: string) => void
  onRecordsTabClick: () => void
}

export default function TabNavigation({
  selectedTab,
  onTabChange,
  onRecordsTabClick
}: TabNavigationProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg mb-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <BarChartOutlined className="text-purple-400" />
        功能模块
      </h3>
      <div className="flex gap-4">
        <button
          className={classNames(
            'px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2',
            selectedTab === 'users'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600'
          )}
          onClick={() => onTabChange('users')}
        >
          <UserOutlined />
          用户货币
        </button>
        <button
          className={classNames(
            'px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2',
            selectedTab === 'records'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600'
          )}
          onClick={onRecordsTabClick}
        >
          <HistoryOutlined />
          充值记录
        </button>
        <button
          className={classNames(
            'px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2',
            selectedTab === 'stats'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600'
          )}
          onClick={() => onTabChange('stats')}
        >
          <BarChartOutlined />
          统计分析
        </button>
      </div>
    </div>
  )
}
