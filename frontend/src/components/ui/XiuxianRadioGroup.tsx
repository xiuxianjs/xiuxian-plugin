import React from 'react';

interface XiuxianRadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface XiuxianRadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  options: XiuxianRadioOption[];
  className?: string;
  size?: 'small' | 'default' | 'large';
  variant?: 'button' | 'radio';
}

const XiuxianRadioGroup: React.FC<XiuxianRadioGroupProps> = ({ value, onChange, options, className = '', size = 'default', variant = 'button' }) => {
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const handleChange = (optionValue: string) => {
    if (onChange && !options.find(opt => opt.value === optionValue)?.disabled) {
      onChange(optionValue);
    }
  };

  if (variant === 'button') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {options.map(option => {
          const isSelected = value === option.value;
          const isDisabled = option.disabled;

          return (
            <button
              key={option.value}
              type='button'
              disabled={isDisabled}
              onClick={() => handleChange(option.value)}
              className={`
                ${sizeClasses[size]}
                rounded-lg font-medium transition-all duration-200
                ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : isDisabled
                      ? 'bg-slate-800/30 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-600/50 hover:text-white hover:border-slate-500'
                }
                focus:outline-none focus:ring-2 focus:ring-purple-500/50
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {options.map(option => {
        const isSelected = value === option.value;
        const isDisabled = option.disabled;

        return (
          <label
            key={option.value}
            className={`
              flex items-center gap-3 cursor-pointer transition-all duration-200
              ${isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:text-white'}
            `}
          >
            <div className='relative'>
              <input
                type='radio'
                value={option.value}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => handleChange(option.value)}
                className='sr-only'
              />
              <div
                className={`
                  w-4 h-4 border-2 rounded-full flex items-center justify-center
                  transition-all duration-200
                  ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500'
                      : isDisabled
                        ? 'border-slate-600 bg-slate-800'
                        : 'border-slate-500 bg-slate-700 hover:border-slate-400'
                  }
                `}
              >
                {isSelected && <div className='w-2 h-2 bg-white rounded-full'></div>}
              </div>
            </div>
            <span className={`text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
};

export default XiuxianRadioGroup;
