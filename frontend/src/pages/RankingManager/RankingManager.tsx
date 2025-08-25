import React from 'react';
import { Table } from 'antd';
import { TrophyOutlined, CrownOutlined, TeamOutlined, StarOutlined } from '@ant-design/icons';

import type { ColumnsType } from 'antd/es/table';
import { RankingItem } from '@/types/types';
import classNames from 'classnames';
import { levelNames } from '@/config';
import { rankingTypes, useRankingManagerCode } from './RankingManager.code';

// 导入UI组件库
import {
  XiuxianPageWrapper,
  XiuxianPageTitle,
  XiuxianStatCard,
  XiuxianTableContainer,
  XiuxianRefreshButton
} from '@/components/ui';

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
  } = useRankingManagerCode();

  // 表格列定义
  const columns: ColumnsType<RankingItem> = [
    {
      title: (
        <div className='flex items-center gap-2 text-purple-400 font-bold'>
          <span>排名</span>
        </div>
      ),
      key: 'rank',
      width: 80,
      render: (_, record) => (
        <div className='flex items-center justify-center'>
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
            <span className='text-slate-400 font-medium'>{record.rank}</span>
          )}
        </div>
      )
    },
    {
      title: (
        <div className='flex items-center gap-2 text-blue-400 font-bold'>
          <span>名称</span>
        </div>
      ),
      key: 'name',
      width: 200,
      render: (_, record) => (
        <div>
          <div className='font-bold text-white'>{record.name}</div>
          {record.extra?.名号 && (
            <div className='text-xs text-slate-400'>道号: {record.extra.名号}</div>
          )}
          {record.extra?.宗主 && (
            <div className='text-xs text-slate-400'>宗主: {record.extra.宗主}</div>
          )}
        </div>
      )
    },
    {
      title: (
        <div className='flex items-center gap-2 text-green-400 font-bold'>
          <span>{selectedRankingType === 'PLAYER_LEVEL' ? '境界' : '数值'}</span>
        </div>
      ),
      key: 'value',
      width: 120,
      render: (_, record) => {
        // 如果选择了境界。value是境界等级
        if (selectedRankingType === 'PLAYER_LEVEL') {
          return (
            <div className='text-sm font-medium text-blue-400'>{levelNames[record.value]}</div>
          );
        }
        return (
          <div className='text-sm font-bold text-green-400'>{record.value.toLocaleString()}</div>
        );
      }
    },
    {
      title: (
        <div className='flex items-center gap-2 text-yellow-400 font-bold'>
          <span>类型</span>
        </div>
      ),
      key: 'type',
      width: 100,
      render: (_, record) => (
        <div className='text-sm text-slate-400'>
          {record.extra?.type === 'player' ? '玩家' : '宗门'}
        </div>
      )
    }
  ];

  return (
    <XiuxianPageWrapper>
      {/* 页面标题和操作按钮 */}
      <XiuxianPageTitle
        icon={<TrophyOutlined />}
        title='排行榜管理'
        subtitle='管理修仙界各种排行榜数据'
        actions={
          <div className='flex gap-2'>
            <button
              className='px-2 py-1 rounded-md bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2'
              onClick={handleTriggerCalculation}
            >
              <TrophyOutlined />
              重新计算排名
            </button>
            <XiuxianRefreshButton
              loading={loading}
              onClick={() => {
                fetchRankingStats();
                fetchRankingData(selectedRankingType, rankingLimit);
              }}
            />
          </div>
        }
      />

      {/* 统计信息 */}
      {rankingStats && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <XiuxianStatCard
            title='总排行榜数'
            value={rankingStats.associationCount + rankingStats.playerCount}
            icon={<TrophyOutlined />}
            gradient='purple'
          />
          <XiuxianStatCard
            title='玩家排行榜'
            value={rankingStats.playerCount}
            icon={<CrownOutlined />}
            gradient='blue'
          />
          <XiuxianStatCard
            title='宗门排行榜'
            value={rankingStats.associationCount}
            icon={<TeamOutlined />}
            gradient='green'
          />
        </div>
      )}

      {/* 排名类型选择 */}
      <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg mb-6'>
        <h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
          <TrophyOutlined className='text-purple-400' />
          排名类型
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4'>
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
              <div className='flex items-center gap-2'>
                {type.icon}
                <span className='text-sm'>{type.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 排名数量选择 */}
      <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg mb-6'>
        <h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
          <StarOutlined className='text-yellow-400' />
          显示数量
        </h3>
        <div className='flex gap-4'>
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
      <XiuxianTableContainer
        title={`${getRankingTypeLabel(selectedRankingType)} - 前${rankingLimit}名`}
        icon={<TrophyOutlined />}
      >
        <Table
          columns={columns}
          dataSource={rankingData}
          rowKey='id'
          loading={loading}
          pagination={false}
          scroll={{ x: 800 }}
          rowClassName={() => {
            return ' bg-slate-700 hover:bg-slate-600';
          }}
          className='bg-transparent xiuxian-table'
        />
      </XiuxianTableContainer>
    </XiuxianPageWrapper>
  );
}
