import React from 'react'
import classNames from 'classnames'

interface TabItem {
  key: string
  label: string
  icon?: React.ReactNode
}

interface XiuxianTabNavigationProps {
  tabs: TabItem[]
  selectedTab: string
  onTabChange: (tab: string) => void
  title?: string
  titleIcon?: React.ReactNode
  className?: string
}

const XiuxianTabNavigation: React.FC<XiuxianTabNavigationProps> = ({
  tabs,
  selectedTab,
  onTabChange,
  title,
  titleIcon,
  className
}) => {
  return (
    <div
      className={classNames(
        'bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg mb-6',
        className
      )}
    >
      {title && (
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          {titleIcon && <span className="text-purple-400">{titleIcon}</span>}
          {title}
        </h3>
      )}
      <div className="flex gap-4">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={classNames(
              'px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2',
              selectedTab === tab.key
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600'
            )}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default XiuxianTabNavigation
