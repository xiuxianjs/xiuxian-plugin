import React from 'react';

interface XiuxianStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  gradient?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'orange';
  className?: string;
}

const XiuxianStatCard: React.FC<XiuxianStatCardProps> = ({ title, value, icon, subtitle, gradient = 'blue', className = '' }) => {
  const gradientClasses = {
    blue: 'from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-blue-400',
    green: 'from-green-500/10 to-emerald-500/10 border-green-500/30 text-green-400',
    purple: 'from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-400',
    yellow: 'from-yellow-500/10 to-orange-500/10 border-yellow-500/30 text-yellow-400',
    red: 'from-red-500/10 to-pink-500/10 border-red-500/30 text-red-400',
    orange: 'from-orange-500/10 to-red-500/10 border-orange-500/30 text-orange-400'
  };

  const iconGradientClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    yellow: 'from-yellow-500 to-orange-500',
    red: 'from-red-500 to-pink-500',
    orange: 'from-orange-500 to-red-500'
  };

  return (
    <div className={`bg-gradient-to-br ${gradientClasses[gradient]} backdrop-blur-xl border rounded-2xl p-6 shadow-lg ${className}`}>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-slate-400 text-sm font-medium'>{title}</p>
          <p className='text-white text-3xl font-bold mt-2'>{typeof value === 'number' ? value.toLocaleString() : value}</p>
          {subtitle && <p className='text-slate-400 text-xs mt-1'>{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${iconGradientClasses[gradient]} rounded-xl flex items-center justify-center shadow-lg`}>
          <div className='text-white text-xl'>{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default XiuxianStatCard;
