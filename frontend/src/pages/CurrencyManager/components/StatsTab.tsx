import React from 'react';
import { Row, Col } from 'antd';
import { DollarOutlined, BarChartOutlined, UserOutlined, HistoryOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { GlobalStats } from '@/types/CurrencyManager';

interface StatsTabProps {
  stats: GlobalStats | null;
}

export default function StatsTab({ stats }: StatsTabProps) {
  if (!stats) return <div>暂无数据</div>;

  return (
    <div className='space-y-6'>
      <Row gutter={16}>
        <Col span={12}>
          <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg'>
            <h4 className='text-lg font-bold text-white mb-4 flex items-center gap-2'>
              <DollarOutlined className='text-green-400' />
              充值金额统计
            </h4>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-slate-400'>总充值金额</span>
                <span className='text-2xl font-bold text-green-400'>¥{stats.total_amount.toLocaleString()}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-slate-400'>本月充值金额</span>
                <span className='text-xl font-bold text-blue-400'>¥{stats.month_amount.toLocaleString()}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-slate-400'>今日充值金额</span>
                <span className='text-lg font-bold text-orange-400'>¥{stats.today_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg'>
            <h4 className='text-lg font-bold text-white mb-4 flex items-center gap-2'>
              <BarChartOutlined className='text-blue-400' />
              充值次数统计
            </h4>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-slate-400'>总充值次数</span>
                <span className='text-2xl font-bold text-blue-400'>{stats.total_count.toLocaleString()}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-slate-400'>本月充值次数</span>
                <span className='text-xl font-bold text-purple-400'>{stats.month_count.toLocaleString()}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-slate-400'>今日充值次数</span>
                <span className='text-lg font-bold text-cyan-400'>{stats.today_count.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg'>
            <h4 className='text-lg font-bold text-white mb-4 flex items-center gap-2'>
              <UserOutlined className='text-yellow-400' />
              用户统计
            </h4>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-slate-400'>首充用户数</span>
                <span className='text-2xl font-bold text-yellow-400'>{stats.first_recharge_users.toLocaleString()}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-slate-400'>平均充值金额</span>
                <span className='text-xl font-bold text-green-400'>
                  ¥{stats.total_count > 0 ? (stats.total_amount / stats.total_count).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg'>
            <h4 className='text-lg font-bold text-white mb-4 flex items-center gap-2'>
              <HistoryOutlined className='text-purple-400' />
              系统信息
            </h4>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-slate-400'>最后更新</span>
                <span className='text-sm text-slate-300'>{dayjs(stats.updated_at).format('YYYY-MM-DD HH:mm:ss')}</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
