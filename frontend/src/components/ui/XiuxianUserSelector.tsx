import React, { useState } from 'react';
import { Select, Tag, Divider } from 'antd';
import { CrownOutlined } from '@ant-design/icons';
import classNames from 'classnames';

// 导入UI组件库
import { XiuxianRadioGroup } from './index';

const { Option } = Select;

interface User {
  id: string;
  currency?: number;
  total_recharge_count?: number;
  is_first_recharge?: boolean;
}

interface XiuxianUserSelectorProps {
  users: User[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  showSearch?: boolean;
  disabled?: boolean;
  className?: string;
}

const XiuxianUserSelector: React.FC<XiuxianUserSelectorProps> = ({
  users,
  value,
  onChange,
  placeholder = '搜索并选择用户',
  showSearch = true,
  disabled = false,
  className
}) => {
  const [inputMode, setInputMode] = useState<'select' | 'manual'>('select');

  return (
    <div className='space-y-3'>
      <XiuxianRadioGroup
        value={inputMode}
        onChange={value => setInputMode(value as 'select' | 'manual')}
        options={[
          { value: 'select', label: '从列表选择' },
          { value: 'manual', label: '手动输入' }
        ]}
        variant='button'
        size='small'
        className='mb-3'
      />

      {inputMode === 'select' ? (
        <Select
          showSearch={showSearch}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          filterOption={(input, option) => {
            const children = option?.children as React.ReactNode;
            if (typeof children === 'string') {
              return children.toLowerCase().includes(input.toLowerCase());
            }
            return false;
          }}
          className={classNames(
            '[&_.ant-select-selector]:bg-slate-700/50 [&_.ant-select-selector]:border-slate-600 [&_.ant-select-selector]:text-white',
            '[&_.ant-select-selection-item]:text-white',
            '[&_.ant-select-selection-placeholder]:text-slate-400',
            '[&_.ant-select-arrow]:text-slate-400',
            '[&.ant-select-focused_.ant-select-selector]:border-purple-500',
            'transition-all duration-200',
            className
          )}
          dropdownStyle={{
            backgroundColor: 'rgb(51, 65, 85)',
            border: '1px solid rgb(71, 85, 105)'
          }}
          dropdownRender={menu => (
            <div>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <div className='px-3 py-2 text-xs text-slate-400'>共 {users.length} 个用户</div>
            </div>
          )}
        >
          {users.map(user => (
            <Option key={user.id} value={user.id}>
              <div className='flex items-center justify-between w-full'>
                <div className='flex items-center gap-2'>
                  <span className='font-mono text-sm'>{user.id}</span>
                  {user.is_first_recharge && (
                    <Tag color='gold'>
                      <CrownOutlined /> 首充
                    </Tag>
                  )}
                </div>
                <div className='text-xs text-slate-400'>
                  ¥{user.currency || 0} | {user.total_recharge_count || 0}次
                </div>
              </div>
            </Option>
          ))}
        </Select>
      ) : (
        <input
          type='text'
          placeholder='请输入用户ID'
          value={value}
          onChange={e => onChange?.(e.target.value)}
          disabled={disabled}
          className={classNames(
            'w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400',
            'hover:border-slate-500 focus:border-purple-500 focus:shadow-purple-500/20',
            'transition-all duration-200 rounded-md',
            'focus:outline-none',
            className
          )}
        />
      )}
    </div>
  );
};

export default XiuxianUserSelector;
