import React from 'react';
import classNames from 'classnames';

interface TabItem {
  name: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface XiuxianTabGroupProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabName: string) => void;
  className?: string;
}

const XiuxianTabGroup: React.FC<XiuxianTabGroupProps> = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg ${className}`}>
      {/* 标签页导航 */}
      <div className='flex flex-wrap gap-2 mb-6'>
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => onTabChange(tab.name)}
            className={classNames(
              'px-4 py-2 rounded-lg transition-all duration-200',
              activeTab === tab.name
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            )}
          >
            {tab.icon && <span className='mr-2'>{tab.icon}</span>}
            {tab.name}
          </button>
        ))}
      </div>

      {/* 标签页内容 */}
      <div className='space-y-6'>
        {tabs
          .filter(tab => tab.name === activeTab)
          .map(tab => (
            <div key={tab.name}>{tab.content}</div>
          ))}
      </div>
    </div>
  );
};

export default XiuxianTabGroup;
