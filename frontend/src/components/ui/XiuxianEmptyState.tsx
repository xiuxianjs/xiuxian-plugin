import React from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'

interface XiuxianEmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  className?: string
}

const XiuxianEmptyState: React.FC<XiuxianEmptyStateProps> = ({
  icon = <ExclamationCircleOutlined className="text-6xl text-slate-400" />,
  title = '暂无数据',
  description = '请点击刷新按钮获取最新数据',
  className = ''
}) => {
  return (
    <div
      className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 shadow-lg text-center ${className}`}
    >
      <div className="mb-4">{icon}</div>
      <p className="text-slate-400 text-lg">{title}</p>
      <p className="text-slate-500 text-sm mt-2">{description}</p>
    </div>
  )
}

export default XiuxianEmptyState
