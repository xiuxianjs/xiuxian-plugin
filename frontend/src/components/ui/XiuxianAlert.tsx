import React from 'react'

interface XiuxianAlertProps {
  type: 'error' | 'warning' | 'info' | 'success'
  title: string
  message: string
  className?: string
}

const XiuxianAlert: React.FC<XiuxianAlertProps> = ({
  type,
  title,
  message,
  className = ''
}) => {
  const typeStyles = {
    error: 'from-red-500/10 to-pink-500/10 border-red-500/30 text-red-400',
    warning: 'from-yellow-500/10 to-orange-500/10 border-yellow-500/30 text-yellow-400',
    info: 'from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-blue-400',
    success: 'from-green-500/10 to-emerald-500/10 border-green-500/30 text-green-400'
  }

  const dotColors = {
    error: 'bg-red-400',
    warning: 'bg-yellow-400',
    info: 'bg-blue-400',
    success: 'bg-green-400'
  }

  return (
    <div className={`mb-6 bg-gradient-to-r ${typeStyles[type]} border rounded-xl p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className={`w-3 h-3 ${dotColors[type]} rounded-full flex-shrink-0 mt-1`}></div>
        <div className="min-w-0 flex-1">
          <h3 className={`font-semibold text-sm sm:text-base ${typeStyles[type].split(' ')[3]}`}>
            {title}
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

export default XiuxianAlert
