import React from 'react'
import classNames from 'classnames'

interface XiuxianPageLayoutProps {
  children: React.ReactNode
  className?: string
}

const XiuxianPageLayout: React.FC<XiuxianPageLayoutProps> = ({
  children,
  className
}) => {
  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div
        className={classNames(
          'relative z-10 p-2 md:p-6 h-full overflow-y-auto',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default XiuxianPageLayout
