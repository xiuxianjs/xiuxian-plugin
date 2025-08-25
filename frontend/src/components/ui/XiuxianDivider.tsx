import React from 'react';

interface XiuxianDividerProps {
  text?: string;
  className?: string;
}

const XiuxianDivider: React.FC<XiuxianDividerProps> = ({ text, className = '' }) => {
  return (
    <div className={`my-6 ${className}`}>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-slate-700/50'></div>
        </div>
        {text && (
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-slate-800/50 text-slate-400'>{text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default XiuxianDivider;
