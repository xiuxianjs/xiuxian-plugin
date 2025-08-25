import React from 'react'

interface XiuxianLoginCardProps {
  children: React.ReactNode
  className?: string
}

const XiuxianLoginCard: React.FC<XiuxianLoginCardProps> = ({
  children,
  className = ''
}) => {
  return (
    <div
      className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl ${className}`}
    >
      {children}
    </div>
  )
}

export default XiuxianLoginCard
