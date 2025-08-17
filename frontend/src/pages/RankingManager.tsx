import React from 'react'
import { Table } from 'antd'
import {
  TrophyOutlined,
  CrownOutlined,
  ReloadOutlined,
  TeamOutlined,
  StarOutlined
} from '@ant-design/icons'

import type { ColumnsType } from 'antd/es/table'
import { RankingItem } from '@/types'
import classNames from 'classnames'
import { levelNames } from '@/config'
import { rankingTypes, useRankingManagerCode } from './RankingManager.code'

export default function RankingManager() {
  const {
    rankingStats,
    selectedRankingType,
    rankingLimit,
    rankingData,
    loading,
    getRankingTypeLabel,
    handleTriggerCalculation,
    fetchRankingStats,
    handleRankingTypeChange,
    handleRankingLimitChange,
    fetchRankingData
  } = useRankingManagerCode()

  // 表格列定义
  const columns: ColumnsType<RankingItem> = [
    {
      title: (
        <div className="flex items-center gap-2 text-purple-400 font-bold">
          <span>排名</span>
        </div>
      ),
      key: 'rank',
      width: 80,
      render: (_, record) => (
        <div className="flex items-center justify-center">
          {record.rank <= 3 ? (
            <div
              className={classNames(
                'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold',
                {
                  'bg-yellow-500': record.rank === 1,
                  'bg-gray-400': record.rank === 2,
                  'bg-orange-500': record.rank === 3
                }
              )}
            >
              {record.rank}
            </div>
          ) : (
            <span className="text-slate-400 font-medium">{record.rank}</span>
          )}
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-blue-400 font-bold">
          <span>名称</span>
        </div>
      ),
      key: 'name',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-bold text-white">{record.name}</div>
          {record.extra?.名号 && (
            <div className="text-xs text-slate-400">
              道号: {record.extra.名号}
            </div>
          )}
          {record.extra?.宗主 && (
            <div className="text-xs text-slate-400">
              宗主: {record.extra.宗主}
            </div>
          )}
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-green-400 font-bold">
          <span>
            {selectedRankingType === 'PLAYER_LEVEL' ? '境界' : '数值'}
          </span>
        </div>
      ),
      key: 'value',
      width: 120,
      render: (_, record) => {
        // 如果选择了境界。value是境界等级
        if (selectedRankingType === 'PLAYER_LEVEL') {
          return (
            <div className="font-bold text-blue-500">
              {levelNames[record.value]}
            </div>
          )
        }
        return (
          <div>
            <div className="font-bold text-blue-500">
              {(record.value || 0).toLocaleString()}
            </div>
          </div>
        )
      }
    },
    {
      title: (
        <div className="flex items-center gap-2 text-yellow-400 font-bold">
          <span>详细信息</span>
        </div>
      ),
      key: 'details',
      render: (_, record) => (
        <div>
          {record.extra?.成员数 && (
            <div className="text-xs text-slate-300">
              成员数: {record.extra.成员数}
            </div>
          )}
          {record.extra?.宗门等级 && (
            <div className="text-xs text-slate-300">
              等级: {record.extra.宗门等级}
            </div>
          )}
          {record.extra?.灵石池 && (
            <div className="text-xs text-slate-300">
              灵石池: {(record.extra?.灵石池 || 0).toLocaleString()}
            </div>
          )}
          {record.extra?.攻击 && (
            <div className="text-xs text-slate-300">
              攻击: {(record.extra?.攻击 || 0).toLocaleString()}
            </div>
          )}
          {record.extra?.防御 && (
            <div className="text-xs text-slate-300">
              防御: {(record.extra?.防御 || 0).toLocaleString()}
            </div>
          )}
          {record.extra?.血量 && (
            <div className="text-xs text-slate-300">
              血量: {(record.extra?.血量 || 0).toLocaleString()}
            </div>
          )}
          {record.extra?.宗门 && (
            <div className="text-xs text-slate-300">
              宗门: {record.extra.宗门}
            </div>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10  p-2 md:p-6 h-full overflow-y-auto">
        {/* 页面标题和操作按钮 */}
        <div className="flex flex-col sm:flex-row  gap-2 justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrophyOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                排名管理
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                管理修仙界各类排行榜
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              onClick={handleTriggerCalculation}
            >
              <ReloadOutlined />
              重新计算排名
            </button>
            <button
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">宗门总数</p>
                  <p className="text-white text-3xl font-bold mt-2">
                    {(rankingStats.associationCount || 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CrownOutlined className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">玩家总数</p>
                  <p className="text-white text-3xl font-bold mt-2">
                    {(rankingStats.playerCount || 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <TeamOutlined className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">最后更新</p>
                  <p className="text-white text-lg font-bold mt-2">
                    {rankingStats.lastUpdate
                      ? new Date(rankingStats.lastUpdate).toLocaleString()
                      : '-'}
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
                  <p className="text-slate-400 text-sm font-medium">
                    当前排名类型
                  </p>
                  <p className="text-white text-lg font-bold mt-2">
                    {getRankingTypeLabel(selectedRankingType)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <StarOutlined className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 排名类型选择 */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrophyOutlined className="text-purple-400" />
            排名类型
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {rankingTypes.map(type => (
              <button
                key={type.value}
                className={classNames(
                  'p-3 rounded-xl border-2 transition-all duration-200',
                  selectedRankingType === type.value
                    ? 'border-purple-500 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 shadow-lg'
                    : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-600/50'
                )}
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
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <StarOutlined className="text-yellow-400" />
            显示数量
          </h3>
          <div className="flex gap-4">
            {[10, 20, 50, 100].map(limit => (
              <button
                key={limit}
                className={classNames(
                  'px-4 py-2 rounded-lg transition-all duration-200',
                  rankingLimit === limit
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600'
                )}
                onClick={() => handleRankingLimitChange(limit)}
              >
                前{limit}名
              </button>
            ))}
          </div>
        </div>

        {/* 排名表格 */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrophyOutlined className="text-purple-400" />
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
            rowClassName={() => {
              return ' bg-slate-700 hover:bg-slate-600'
            }}
            className="bg-transparent xiuxian-table"
          />
        </div>
      </div>
    </div>
  )
}
