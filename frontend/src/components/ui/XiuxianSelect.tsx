import React from 'react'
import { Select, SelectProps } from 'antd'
import classNames from 'classnames'

interface XiuxianSelectProps extends SelectProps {
  className?: string
}

const XiuxianSelect: React.FC<XiuxianSelectProps> = ({
  className,
  ...props
}) => {
  return (
    <Select
      className={classNames(
        '[&_.ant-select-selector]:bg-slate-700/50 [&_.ant-select-selector]:border-slate-600 [&_.ant-select-selector]:text-white',
        '[&_.ant-select-selection-item]:text-white',
        '[&_.ant-select-selection-placeholder]:text-slate-400',
        '[&_.ant-select-arrow]:text-slate-400',
        '[&.ant-select-focused_.ant-select-selector]:border-purple-500',
        'transition-all duration-200',
        className
      )}
      dropdownStyle={{
        backgroundColor: 'rgb(51, 65, 85)',
        border: '1px solid rgb(71, 85, 105)'
      }}
      {...props}
    />
  )
}

export default XiuxianSelect
