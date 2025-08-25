import React from 'react';
import { Card, CardProps } from 'antd';
import classNames from 'classnames';

interface XiuxianCardProps extends Omit<CardProps, 'variant'> {
  variant?: 'default' | 'gradient';
}

const XiuxianCard: React.FC<XiuxianCardProps> = ({ className, variant = 'default', ...props }) => {
  const variantClasses = {
    default:
      'bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50',
    gradient:
      'bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30'
  };

  return (
    <Card
      className={classNames(
        'rounded-2xl shadow-lg',
        '[&_.ant-card-head]:bg-transparent [&_.ant-card-head]:border-slate-700/50',
        '[&_.ant-card-head-title]:text-white',
        '[&_.ant-card-body]:bg-transparent [&_.ant-card-body]:text-white',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};

export default XiuxianCard;
