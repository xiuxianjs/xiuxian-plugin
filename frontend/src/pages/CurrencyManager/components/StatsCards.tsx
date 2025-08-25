import React from 'react';
import { BarChartOutlined } from '@ant-design/icons';
import type { GlobalStats } from '@/types/CurrencyManager';

// 导入UI组件库
import { XiuxianStatCard } from '@/components/ui';

interface StatsCardsProps {
  stats: GlobalStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
      <XiuxianStatCard
        title='总充值金额'
        value={`¥${stats.total_amount.toLocaleString()}`}
        icon={<BarChartOutlined />}
        gradient='green'
      />
      <XiuxianStatCard
        title='总充值次数'
        value={stats.total_count.toLocaleString()}
        icon={<BarChartOutlined />}
        gradient='blue'
      />
      <XiuxianStatCard
        title='首充用户数'
        value={stats.first_recharge_users.toLocaleString()}
        icon={<BarChartOutlined />}
        gradient='purple'
      />
      <XiuxianStatCard
        title='今日充值'
        value={`¥${stats.today_amount.toLocaleString()}`}
        icon={<BarChartOutlined />}
        gradient='orange'
      />
    </div>
  );
}
