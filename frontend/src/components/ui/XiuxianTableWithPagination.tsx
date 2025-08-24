import React from 'react'
import { Table, TableProps } from 'antd'
import { XiuxianPagination } from './index'

interface XiuxianTableWithPaginationProps extends Omit<TableProps<any>, 'pagination'> {
  pagination?: {
    current: number
    pageSize: number
    total: number
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    showTotal?: (total: number, range: [number, number]) => string
    pageSizeOptions?: string[]
  }
  onPaginationChange?: (page: number, pageSize: number) => void
  onShowSizeChange?: (current: number, size: number) => void
  className?: string
}

const XiuxianTableWithPagination: React.FC<XiuxianTableWithPaginationProps> = ({
  pagination,
  onPaginationChange,
  onShowSizeChange,
  className = '',
  ...tableProps
}) => {
  const handlePaginationChange = (page: number, pageSize: number) => {
    if (onPaginationChange) {
      onPaginationChange(page, pageSize)
    }
  }

  const handleShowSizeChange = (current: number, size: number) => {
    if (onShowSizeChange) {
      onShowSizeChange(current, size)
    }
  }

  return (
    <div className={className}>
      <Table
        {...tableProps}
        pagination={false}
        className="xiuxian-table"
      />
      
      {pagination && (
        <div className="mt-4">
          <XiuxianPagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            showSizeChanger={pagination.showSizeChanger}
            showQuickJumper={pagination.showQuickJumper}
            showTotal={pagination.showTotal}
            pageSizeOptions={pagination.pageSizeOptions}
            onChange={handlePaginationChange}
            onShowSizeChange={handleShowSizeChange}
          />
        </div>
      )}
    </div>
  )
}

export default XiuxianTableWithPagination
