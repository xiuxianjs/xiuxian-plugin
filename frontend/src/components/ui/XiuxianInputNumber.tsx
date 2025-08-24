import React from 'react'
import { InputNumber, InputNumberProps } from 'antd'
import classNames from 'classnames'

interface XiuxianInputNumberProps extends InputNumberProps {
  className?: string
}

const XiuxianInputNumber: React.FC<XiuxianInputNumberProps> = ({
  className,
  ...props
}) => {
  return (
    <InputNumber
      className={classNames(
        'bg-slate-700/50 border-slate-600 text-white',
        'hover:border-slate-500 focus:border-purple-500 focus:shadow-purple-500/20',
        'transition-all duration-200',
        '[&_.ant-input-number-input]:text-white',
        '[&_.ant-input-number-handler-wrap]:bg-slate-600 [&_.ant-input-number-handler-wrap]:border-slate-500',
        '[&_.ant-input-number-handler]:text-slate-300 [&_.ant-input-number-handler:hover]:text-white [&_.ant-input-number-handler:hover]:bg-slate-500',
        className
      )}
      {...props}
    />
  )
}

export default XiuxianInputNumber
