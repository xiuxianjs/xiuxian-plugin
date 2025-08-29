import React from 'react';

interface XiuxianInputWithIconProps {
  icon: string;
  type?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  className?: string;
}

const XiuxianInputWithIcon: React.FC<XiuxianInputWithIconProps> = ({ icon, type = 'text', name, placeholder, required = false, minLength, className = '' }) => {
  return (
    <div className={className}>
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <span className='text-slate-400 text-lg'>{icon}</span>
        </div>
        <input
          name={name}
          type={type}
          required={required}
          minLength={minLength}
          className='w-full pl-10 pr-4 py-3 sm:py-3 xiuxian-input rounded-xl text-sm sm:text-base'
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default XiuxianInputWithIcon;
