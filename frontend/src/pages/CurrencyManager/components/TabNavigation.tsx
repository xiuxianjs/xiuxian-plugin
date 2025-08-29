import React from 'react';
import { UserOutlined, HistoryOutlined, BarChartOutlined } from '@ant-design/icons';

// 导入UI组件库
import { XiuxianTabGroup } from '@/components/ui';

interface TabNavigationProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  onRecordsTabClick: () => void;
}

export default function TabNavigation({ selectedTab, onTabChange, onRecordsTabClick }: TabNavigationProps) {
  const tabs = [
    {
      name: 'users',
      icon: <UserOutlined />,
      content: null
    },
    {
      name: 'records',
      icon: <HistoryOutlined />,
      content: null
    },
    {
      name: 'stats',
      icon: <BarChartOutlined />,
      content: null
    }
  ];

  const handleTabChange = (tabName: string) => {
    if (tabName === 'records') {
      onRecordsTabClick();
    } else {
      onTabChange(tabName);
    }
  };

  return (
    <div className='mb-6'>
      <div className='flex gap-4'>
        {tabs.map(tab => (
          <button
            key={tab.name}
            className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
              selectedTab === tab.name
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600'
            }`}
            onClick={() => handleTabChange(tab.name)}
          >
            {tab.icon}
            {tab.name === 'users' && '用户货币'}
            {tab.name === 'records' && '充值记录'}
            {tab.name === 'stats' && '统计分析'}
          </button>
        ))}
      </div>
    </div>
  );
}
