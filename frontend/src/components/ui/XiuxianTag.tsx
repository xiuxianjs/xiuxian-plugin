import React from 'react';
import { Tag } from 'antd';

interface XiuxianTagProps {
  color: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const XiuxianTag: React.FC<XiuxianTagProps> = ({ color, children, icon, className = '' }) => {
  return (
    <Tag
      color={color}
      className={`text-sm font-bold px-3 py-1 border-0 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color}20, ${color}40)`,
        color: color,
        border: `1px solid ${color}30`
      }}
    >
      {icon && <span className='mr-1'>{icon}</span>}
      {children}
    </Tag>
  );
};

export default XiuxianTag;
