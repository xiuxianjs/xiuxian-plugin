import React from 'react';
import classNames from 'classnames';

interface XiuxianConfigItemProps {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  value: any;
  onChange: (value: any) => void;
  className?: string;
}

const XiuxianConfigItem: React.FC<XiuxianConfigItemProps> = ({ name, description, type, value, onChange, className = '' }) => {
  const typeColors = {
    string: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    number: 'bg-green-500/20 text-green-400 border-green-500/30',
    boolean: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    array: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };

  const renderInput = () => {
    switch (type) {
      case 'boolean':
        return (
          <div className='flex items-center'>
            <input
              type='checkbox'
              checked={!!value}
              onChange={e => onChange(e.target.checked)}
              className='w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2'
            />
            <span className='ml-2 text-slate-300 text-sm'>{value ? '启用' : '禁用'}</span>
          </div>
        );
      case 'array':
        return (
          <textarea
            value={JSON.stringify(value || [], null, 2)}
            onChange={e => {
              try {
                const parsedValue = JSON.parse(e.target.value);
                onChange(parsedValue);
              } catch (error) {
                console.error(error);
              }
            }}
            className='w-full p-2 xiuxian-input text-xs font-mono rounded-lg'
            rows={3}
            placeholder='请输入JSON数组格式'
          />
        );
      default:
        return (
          <input
            type={type === 'number' ? 'number' : 'text'}
            value={String(value || '')}
            onChange={e => {
              const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
              onChange(newValue);
            }}
            className='w-full p-2 xiuxian-input rounded-lg'
            placeholder={`请输入${name}`}
          />
        );
    }
  };

  return (
    <div className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-lg ${className}`}>
      <div className='flex items-center justify-between mb-2'>
        <label className='text-white font-medium text-sm'>{name}</label>
        <span className={classNames('inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border', typeColors[type])}>{type.toUpperCase()}</span>
      </div>

      <p className='text-slate-400 text-xs mb-3'>{description}</p>

      {renderInput()}
    </div>
  );
};

export default XiuxianConfigItem;
