import React from 'react';
import { Button, ButtonProps } from 'antd';
import classNames from 'classnames';

interface XiuxianButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
}

const XiuxianButton: React.FC<XiuxianButtonProps> = ({ className, variant = 'primary', ...props }) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    secondary: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
  };

  return (
    <Button
      className={classNames('text-white border-0 transition-all duration-200 shadow-lg hover:shadow-xl', variantClasses[variant], className)}
      {...props}
    />
  );
};

export default XiuxianButton;
