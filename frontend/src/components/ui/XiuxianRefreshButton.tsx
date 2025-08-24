import React from 'react'
import { ReloadOutlined } from '@ant-design/icons'
import classNames from 'classnames'

interface XiuxianRefreshButtonProps {
  loading: boolean
  onClick: () => void
  text?: string
  loadingText?: string
  className?: string
  disabled?: boolean
}

const XiuxianRefreshButton: React.FC<XiuxianRefreshButtonProps> = ({
  loading,
  onClick,
  text = '刷新数据',
  loadingText = '刷新中...',
  className = '',
  disabled = false
}) => {
  return (
    <button
      className={classNames(
        'px-2 py-1 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2',
        className
      )}
      onClick={onClick}
      disabled={loading || disabled}
    >
      <ReloadOutlined
        className={classNames('text-lg', { 'animate-spin': loading })}
      />
      {loading ? loadingText : text}
    </button>
  )
}

export default XiuxianRefreshButton
