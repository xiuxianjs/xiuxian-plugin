import React from 'react'

interface XiuxianPageTitleProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

const XiuxianPageTitle: React.FC<XiuxianPageTitleProps> = ({
  icon,
  title,
  subtitle,
  actions,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row gap-2 justify-between items-center mb-6 ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
          <div className="text-white text-xl">{icon}</div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  )
}

export default XiuxianPageTitle
