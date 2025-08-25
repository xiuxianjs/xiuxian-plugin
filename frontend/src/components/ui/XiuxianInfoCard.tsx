import React from 'react';

interface XiuxianInfoCardProps {
  label: string;
  value: React.ReactNode;
  gradient?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'orange' | 'pink' | 'indigo';
  className?: string;
  fullWidth?: boolean;
}

const XiuxianInfoCard: React.FC<XiuxianInfoCardProps> = ({
  label,
  value,
  gradient = 'blue',
  className = '',
  fullWidth = false
}) => {
  const gradientClasses = {
    blue: 'from-blue-500/10 to-cyan-500/10 border-blue-500/30',
    green: 'from-green-500/10 to-emerald-500/10 border-green-500/30',
    purple: 'from-purple-500/10 to-pink-500/10 border-purple-500/30',
    yellow: 'from-yellow-500/10 to-orange-500/10 border-yellow-500/30',
    red: 'from-red-500/10 to-pink-500/10 border-red-500/30',
    orange: 'from-orange-500/10 to-red-500/10 border-orange-500/30',
    pink: 'from-pink-500/10 to-rose-500/10 border-pink-500/30',
    indigo: 'from-indigo-500/10 to-purple-500/10 border-indigo-500/30'
  };

  return (
    <div
      className={`bg-gradient-to-br ${gradientClasses[gradient]} backdrop-blur-xl border rounded-xl p-4 shadow-lg ${fullWidth ? 'col-span-2' : ''} ${className}`}
    >
      <label className='text-sm text-slate-400'>{label}</label>
      <div className='font-medium text-white mt-1'>{value}</div>
    </div>
  );
};

export default XiuxianInfoCard;
