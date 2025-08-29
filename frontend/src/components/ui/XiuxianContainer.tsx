import React from 'react';
import classNames from 'classnames';

interface XiuxianContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient';
  withHeader?: boolean;
  title?: string;
  icon?: React.ReactNode;
}

const XiuxianContainer: React.FC<XiuxianContainerProps> = ({ children, className, variant = 'default', withHeader = false, title, icon }) => {
  const variantClasses = {
    default: 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50',
    gradient: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30'
  };

  return (
    <div className={classNames('rounded-2xl shadow-lg overflow-hidden', variantClasses[variant], className)}>
      {withHeader && (
        <div className='p-6 border-b border-slate-700/50'>
          <h3 className='text-xl font-bold text-white flex items-center gap-2'>
            {icon && <span className='text-purple-400'>{icon}</span>}
            {title}
          </h3>
        </div>
      )}
      <div className='p-6'>{children}</div>
    </div>
  );
};

export default XiuxianContainer;
