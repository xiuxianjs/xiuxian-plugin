import React from 'react'
import { Input, InputProps } from 'antd'
import classNames from 'classnames'

interface XiuxianInputProps extends InputProps {
  className?: string
}

const XiuxianInput: React.FC<XiuxianInputProps> = ({ className, ...props }) => {
  return (
    <Input
      className={classNames(
        'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400',
        'hover:border-slate-500 focus:border-purple-500 focus:shadow-purple-500/20',
        'transition-all duration-200',
        className
      )}
      {...props}
    />
  )
}

export default XiuxianInput
