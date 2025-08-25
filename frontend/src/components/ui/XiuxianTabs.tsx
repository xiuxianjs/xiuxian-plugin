import React from 'react';
import { Tabs, TabsProps } from 'antd';
import classNames from 'classnames';

interface XiuxianTabsProps extends TabsProps {
  className?: string;
}

const XiuxianTabs: React.FC<XiuxianTabsProps> = ({ className, ...props }) => {
  return (
    <Tabs
      className={classNames(
        '[&_.ant-tabs-nav]:bg-slate-800 [&_.ant-tabs-nav]:border-b [&_.ant-tabs-nav]:border-slate-600',
        '[&_.ant-tabs-tab]:text-slate-300 [&_.ant-tabs-tab]:border-slate-600',
        '[&_.ant-tabs-tab:hover]:text-purple-300 [&_.ant-tabs-tab:hover]:border-purple-500',
        '[&_.ant-tabs-tab-active]:text-white [&_.ant-tabs-tab-active]:border-purple-500 [&_.ant-tabs-tab-active]:bg-slate-700',
        '[&_.ant-tabs-tab-btn]:text-slate-300',
        '[&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:text-white',
        '[&_.ant-tabs-content-holder]:bg-slate-800',
        '[&_.ant-tabs-tabpane]:bg-slate-800',
        'transition-all duration-200',
        className
      )}
      {...props}
    />
  );
};

export default XiuxianTabs;
