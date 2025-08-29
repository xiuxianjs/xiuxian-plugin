import React from 'react';

interface XiuxianPageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const XiuxianPageWrapper: React.FC<XiuxianPageWrapperProps> = ({ children, className = '' }) => {
  return (
    <div className={`h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${className}`}>
      <div className='relative z-10 p-2 md:p-6 h-full overflow-y-auto'>{children}</div>
    </div>
  );
};

export default XiuxianPageWrapper;
