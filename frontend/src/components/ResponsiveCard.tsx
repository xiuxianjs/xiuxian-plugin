import React from 'react'
import { Card } from 'antd'
import classNames from 'classnames'

interface ResponsiveCardProps {
  title: string
  children: React.ReactNode
  className?: string
  extra?: React.ReactNode
  loading?: boolean
}

export default function ResponsiveCard({
  title,
  children,
  className = '',
  extra,
  loading = false
}: ResponsiveCardProps) {
  return (
    <Card
      title={
        <span className="text-sm sm:text-base lg:text-lg font-medium">
          {title}
        </span>
      }
      extra={extra}
      loading={loading}
      className={classNames('responsive-card', className)}
    >
      <div className="responsive-content">{children}</div>
    </Card>
  )
}

// 响应式统计卡片
interface ResponsiveStatCardProps {
  title: string
  value: string | number
  prefix?: React.ReactNode
  suffix?: string
  color?: string
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function ResponsiveStatCard({
  title,
  value,
  prefix,
  suffix,
  color = '#1890ff',
  description,
  trend
}: ResponsiveStatCardProps) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm text-gray-600 font-medium mb-2">
            {title}
          </h3>
          <div className="flex items-baseline space-x-2">
            {prefix && (
              <span className="text-lg sm:text-xl text-gray-400">{prefix}</span>
            )}
            <span
              className="text-lg sm:text-xl lg:text-2xl font-bold"
              style={{ color }}
            >
              {value}
            </span>
            {suffix && (
              <span className="text-xs sm:text-sm text-gray-500">{suffix}</span>
            )}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              {description}
            </p>
          )}
        </div>
        {trend && (
          <div
            className={classNames(
              'flex items-center space-x-1 px-2 py-1 rounded-full text-xs',
              {
                'bg-green-100 text-green-600': trend.isPositive,
                'bg-red-100 text-red-600': !trend.isPositive
              }
            )}
          >
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

// 响应式数据表格
interface ResponsiveDataTableProps {
  data: Array<{
    key: string
    [key: string]: unknown
  }>
  columns: Array<{
    title: string
    dataIndex: string
    key: string
    render?: (
      value: unknown,
      record: Record<string, unknown>,
      index: number
    ) => React.ReactNode
    responsive?: boolean // 是否在小屏幕上隐藏
  }>
  title?: string
  loading?: boolean
  pagination?: boolean | object
}

export function ResponsiveDataTable({
  data,
  columns,
  title,
  loading = false,
  pagination = false
}: ResponsiveDataTableProps) {
  // 过滤响应式列
  const getResponsiveColumns = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return columns.filter(col => col.responsive !== false)
    }
    return columns
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      {title && (
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900">
            {title}
          </h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {getResponsiveColumns().map(column => (
                <th
                  key={column.key}
                  className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={getResponsiveColumns().length}
                  className="px-3 sm:px-4 py-8 text-center text-sm text-gray-500"
                >
                  加载中...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={getResponsiveColumns().length}
                  className="px-3 sm:px-4 py-8 text-center text-sm text-gray-500"
                >
                  暂无数据
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr
                  key={record.key}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {getResponsiveColumns().map(column => (
                    <td
                      key={column.key}
                      className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(record[column.dataIndex], record, index)
                        : String(record[column.dataIndex] || '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 响应式按钮组
interface ResponsiveButtonGroupProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveButtonGroup({
  children,
  className = ''
}: ResponsiveButtonGroupProps) {
  return (
    <div className={classNames('flex flex-wrap gap-2 sm:gap-3', className)}>
      {children}
    </div>
  )
}

// 响应式布局容器
interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export function ResponsiveContainer({
  children,
  className = '',
  maxWidth = 'full'
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    'full': 'max-w-full'
  }

  return (
    <div
      className={classNames(
        `mx-auto px-4 sm:px-6 lg:px-8`,
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  )
}
