import React from 'react';
import { LeftOutlined, RightOutlined, DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';

interface XiuxianPaginationProps {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  pageSizeOptions?: string[];
  className?: string;
  size?: 'default' | 'small';
  disabled?: boolean;
}

const XiuxianPagination: React.FC<XiuxianPaginationProps> = ({
  current = 1,
  pageSize = 10,
  total = 0,
  showSizeChanger = true,
  showQuickJumper = true,
  showTotal,
  onChange,
  onShowSizeChange,
  pageSizeOptions = ['10', '20', '50', '100'],
  className = '',
  size = 'default',
  disabled = false
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);

  const handlePageChange = (page: number) => {
    if (onChange && !disabled) {
      onChange(page, pageSize);
    }
  };

  const handleSizeChange = (size: number) => {
    if (onShowSizeChange && !disabled) {
      onShowSizeChange(current, size);
    }
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (current >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const isSmall = size === 'small';
  const baseButtonClass = `flex items-center justify-center transition-all duration-200 font-medium ${isSmall ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base'}`;

  const normalButtonClass = `${baseButtonClass} bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg`;
  const activeButtonClass = `${baseButtonClass} bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg`;
  const disabledButtonClass = `${baseButtonClass} bg-slate-800/30 text-slate-500 border border-slate-700 cursor-not-allowed`;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-slate-700/50 rounded-xl ${className}`}
    >
      {/* 左侧信息 */}
      <div className='flex items-center gap-4 text-sm text-slate-300'>
        {showTotal && <span className='hidden sm:inline'>{showTotal(total, [startItem, endItem])}</span>}

        {showSizeChanger && (
          <div className='flex items-center gap-2'>
            <span>每页显示:</span>
            <select
              value={pageSize}
              onChange={e => handleSizeChange(Number(e.target.value))}
              disabled={disabled}
              className='bg-slate-700/50 border border-slate-600 text-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>条</span>
          </div>
        )}
      </div>

      {/* 分页按钮 */}
      <div className='flex items-center gap-2'>
        {/* 首页按钮 */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={current === 1 || disabled}
          className={current === 1 || disabled ? disabledButtonClass : normalButtonClass}
          title='首页'
        >
          <DoubleLeftOutlined />
        </button>

        {/* 上一页按钮 */}
        <button
          onClick={() => handlePageChange(current - 1)}
          disabled={current === 1 || disabled}
          className={current === 1 || disabled ? disabledButtonClass : normalButtonClass}
          title='上一页'
        >
          <LeftOutlined />
        </button>

        {/* 页码按钮 */}
        {renderPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className={`${baseButtonClass} text-slate-400`}>...</span>
            ) : (
              <button
                onClick={() => handlePageChange(page as number)}
                disabled={disabled}
                className={page === current ? activeButtonClass : disabled ? disabledButtonClass : normalButtonClass}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* 下一页按钮 */}
        <button
          onClick={() => handlePageChange(current + 1)}
          disabled={current === totalPages || disabled}
          className={current === totalPages || disabled ? disabledButtonClass : normalButtonClass}
          title='下一页'
        >
          <RightOutlined />
        </button>

        {/* 末页按钮 */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={current === totalPages || disabled}
          className={current === totalPages || disabled ? disabledButtonClass : normalButtonClass}
          title='末页'
        >
          <DoubleRightOutlined />
        </button>
      </div>

      {/* 快速跳转 */}
      {showQuickJumper && (
        <div className='flex items-center gap-2 text-sm text-slate-300'>
          <span>跳至</span>
          <input
            type='number'
            min={1}
            max={totalPages}
            className='w-16 bg-slate-700/50 border border-slate-600 text-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
            onKeyPress={e => {
              if (e.key === 'Enter') {
                const value = parseInt((e.target as HTMLInputElement).value);
                if (value >= 1 && value <= totalPages) {
                  handlePageChange(value);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
            disabled={disabled}
            placeholder={current.toString()}
          />
          <span>页</span>
        </div>
      )}
    </div>
  );
};

export default XiuxianPagination;
