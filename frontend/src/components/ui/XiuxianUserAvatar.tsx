import React from 'react';
import { Avatar } from 'antd';

interface XiuxianUserAvatarProps {
  src?: string;
  size?: number;
  name?: string;
  online?: boolean;
  className?: string;
}

const XiuxianUserAvatar: React.FC<XiuxianUserAvatarProps> = ({
  src,
  size = 48,
  name,
  online = false,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <Avatar src={src} size={size} className='border-2 border-purple-500/50'>
        {name?.charAt(0) || '用'}
      </Avatar>
      {online && (
        <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center'>
          <div className='w-2 h-2 bg-white rounded-full'></div>
        </div>
      )}
    </div>
  );
};

export default XiuxianUserAvatar;
