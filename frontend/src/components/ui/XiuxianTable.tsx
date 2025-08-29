import React from 'react';
import { Table, TableProps } from 'antd';
import classNames from 'classnames';

interface XiuxianTableProps extends TableProps {
  className?: string;
}

const XiuxianTable: React.FC<XiuxianTableProps> = ({ className, rowClassName = () => 'bg-slate-700 hover:bg-slate-600', ...props }) => {
  return (
    <Table
      className={classNames(
        '[&_.ant-table-thead>tr>th]:bg-slate-700 [&_.ant-table-thead>tr>th]:border-slate-600 [&_.ant-table-thead>tr>th]:text-slate-200',
        '[&_.ant-table-tbody>tr>td]:border-slate-600 [&_.ant-table-tbody>tr>td]:text-slate-300',
        '[&_.ant-table-cell-row-hover]:bg-slate-600',
        '[&_.ant-pagination]:border-t [&_.ant-pagination]:border-slate-600 [&_.ant-pagination]:text-white',
        '[&_.ant-pagination-item]:text-slate-300',
        '[&_.ant-pagination-item-active]:text-white [&_.ant-pagination-item-active]:bg-slate-600',
        'transition-all duration-200',
        className
      )}
      rowClassName={rowClassName}
      {...props}
    />
  );
};

export default XiuxianTable;
