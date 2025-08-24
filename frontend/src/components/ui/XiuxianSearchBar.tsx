import React from 'react'
import { SearchOutlined } from '@ant-design/icons'

interface XiuxianSearchBarProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  onKeyPress?: (e: React.KeyboardEvent) => void
  className?: string
  buttonText?: string
}

const XiuxianSearchBar: React.FC<XiuxianSearchBarProps> = ({
  placeholder = '搜索...',
  value,
  onChange,
  onSearch,
  onKeyPress,
  className = '',
  buttonText = '搜索'
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch()
    }
    onKeyPress?.(e)
  }

  return (
    <div
      className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg ${className}`}
    >
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <SearchOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg" />
          <input
            type="text"
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-3 xiuxian-input rounded-lg"
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          onClick={onSearch}
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default XiuxianSearchBar
