import React from 'react';
import { Input } from 'antd';
import classNames from 'classnames';

const { Search } = Input;

interface XiuxianSearchProps {
  className?: string;
}

const XiuxianSearch: React.FC<XiuxianSearchProps> = ({ className, ...props }) => {
  return (
    <Search
      className={classNames(
        'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400',
        'hover:border-slate-500 focus:border-purple-500 focus:shadow-purple-500/20',
        'transition-all duration-200',
        '[&_.ant-input-search-button]:bg-slate-600 [&_.ant-input-search-button]:border-slate-500 [&_.ant-input-search-button]:text-white',
        '[&_.ant-input-search-button:hover]:bg-slate-500 [&_.ant-input-search-button:hover]:border-slate-400',
        className
      )}
      {...props}
    />
  );
};

export default XiuxianSearch;
