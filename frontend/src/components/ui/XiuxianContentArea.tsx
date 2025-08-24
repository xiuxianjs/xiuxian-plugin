import React from 'react'
import classNames from 'classnames'

interface XiuxianContentAreaProps {
  children: React.ReactNode
  title?: string
  icon?: React.ReactNode
  className?: string
}

const XiuxianContentArea: React.FC<XiuxianContentAreaProps> = ({
  children,
  title,
  icon,
  className
}) => {
  return (
    <div
      className={classNames(
        'bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden',
        className
      )}
    >
      {title && (
        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {icon && <span className="text-purple-400">{icon}</span>}
            {title}
          </h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

export default XiuxianContentArea
