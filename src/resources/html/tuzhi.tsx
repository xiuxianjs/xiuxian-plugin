import React from 'react';
import classNames from 'classnames';
import tuzhiURL from '@src/resources/img/fairyrealm.jpg';
import HTML from './HTML';

const Tuzhi = ({ tuzhi_list }) => {
  const getWeaponTypeIcon = name => {
    if (name.includes('剑')) return '⚔️';
    if (name.includes('刀')) return '🗡️';
    if (name.includes('枪')) return '🔱';
    if (name.includes('弓')) return '🏹';
    if (name.includes('盾')) return '🛡️';
    if (name.includes('甲')) return '🥋';
    if (name.includes('袍')) return '👘';
    if (name.includes('靴')) return '👢';
    if (name.includes('冠')) return '👑';
    if (name.includes('戒')) return '💍';
    if (name.includes('链')) return '📿';
    return '🔨';
  };

  const getSuccessRateColor = rate => {
    const percentage = rate * 100;
    if (percentage >= 80) return 'text-blue-700';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-blue-500';
    return 'text-blue-400';
  };

  const getSuccessRateBg = rate => {
    const percentage = rate * 100;
    if (percentage >= 80) return 'bg-gradient-to-r from-blue-100/80 to-blue-200/60';
    if (percentage >= 60) return 'bg-gradient-to-r from-blue-100/70 to-blue-200/50';
    if (percentage >= 40) return 'bg-gradient-to-r from-blue-100/60 to-blue-200/40';
    return 'bg-gradient-to-r from-blue-100/50 to-blue-200/30';
  };

  return (
    <HTML
      className=' bg-cover bg-center flex flex-col items-center justify-center p-4 font-serif relative overflow-hidden'
      style={{
        backgroundImage: `url(${tuzhiURL})`,
        backgroundSize: 'cover'
      }}
    >
      {/* 背景装饰层 */}
      <div className='absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-blue-800/30 pointer-events-none'></div>

      {/* 静态装饰元素 */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute top-20 left-10 w-2 h-2 bg-blue-400/40 rounded-full'></div>
        <div className='absolute top-40 right-20 w-1 h-1 bg-blue-300/50 rounded-full'></div>
        <div className='absolute bottom-40 left-20 w-1.5 h-1.5 bg-blue-400/30 rounded-full'></div>
        <div className='absolute bottom-20 right-10 w-1 h-1 bg-blue-300/40 rounded-full'></div>
        <div className='absolute top-1/3 left-1/4 w-1 h-1 bg-blue-400/30 rounded-full'></div>
        <div className='absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-blue-300/40 rounded-full'></div>
      </div>

      <div className='h-8 w-full'></div>

      {/* 标题区域 - 炼器图纸牌匾 */}
      <div className='relative z-10 w-full max-w-xl flex flex-col items-center px-5 mb-8'>
        <div className='relative w-full'>
          {/* 牌匾装饰 */}
          <div className='absolute -top-2 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg'></div>
          <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full shadow-md'></div>

          <div className='border-2 border-gradient-to-r  rounded-2xl w-full flex flex-col justify-center bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl shadow-2xl py-8 relative overflow-hidden'>
            {/* 背景装饰 */}
            <div className='absolute inset-0 bg-gradient-to-r from-blue-400/5 via-transparent to-blue-600/5'></div>
            <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent'></div>
            <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600/20 to-transparent'></div>

            {/* 牌匾装饰元素 */}
            <div className='absolute top-2 left-4 w-1 h-1 bg-blue-400/60 rounded-full'></div>
            <div className='absolute top-2 right-4 w-1 h-1 bg-blue-600/60 rounded-full'></div>
            <div className='absolute bottom-2 left-4 w-1 h-1 bg-blue-300/60 rounded-full'></div>
            <div className='absolute bottom-2 right-4 w-1 h-1 bg-blue-500/60 rounded-full'></div>

            <div className='flex flex-col items-center gap-4 relative z-10'>
              <span
                className='text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 tracking-widest'
                style={{
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
                }}
              >
                🔨 炼器图纸 🔨
              </span>

              {/* 指令说明 */}
              <div className='flex flex-col md:flex-row gap-4 text-center'>
                <div className='px-4 py-2 bg-gradient-to-r from-blue-100/80 to-blue-200/60 rounded-lg border border-blue-300/50 backdrop-blur-sm'>
                  <div className='text-blue-700 font-medium'>炼制指令</div>
                  <div className='text-blue-600 text-sm'>#打造+武器名</div>
                </div>
                <div className='px-4 py-2 bg-gradient-to-r from-blue-100/70 to-blue-200/50 rounded-lg border border-blue-300/50 backdrop-blur-sm'>
                  <div className='text-blue-700 font-medium'>成功率计算</div>
                  <div className='text-blue-600 text-sm'>基础成功率 + 职业等级加成</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 图纸列表 */}
      <div className='relative z-10 w-full max-w-5xl min-w-xl flex flex-col items-center px-5 gap-6'>
        {tuzhi_list?.map((item, index) => (
          <div
            key={index}
            className='relative min-w-[34rem] backdrop-blur-xl shadow-xl border-2 p-6 rounded-2xl border-blue-400/40 bg-gradient-to-r from-white/80 to-white/60 shadow-blue-500/20'
          >
            {/* 装饰边框 */}
            <div className='absolute top-0 left-0 w-6 h-1 bg-gradient-to-r from-blue-400/40 to-transparent'></div>
            <div className='absolute top-0 right-0 w-6 h-1 bg-gradient-to-l from-blue-600/40 to-transparent'></div>
            <div className='absolute bottom-0 left-0 w-6 h-1 bg-gradient-to-r from-blue-300/40 to-transparent'></div>
            <div className='absolute bottom-0 right-0 w-6 h-1 bg-gradient-to-l from-blue-500/40 to-transparent'></div>

            {/* 角落装饰 */}
            <div className='absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-60'></div>
            <div className='absolute bottom-2 left-2 w-1.5 h-1.5 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full opacity-40'></div>

            {/* 头部信息 */}
            <div className='flex items-center justify-between w-full mb-6 relative'>
              <div className='flex items-center gap-3'>
                <div className='text-3xl'>{getWeaponTypeIcon(item.name)}</div>
                <div className='flex flex-col'>
                  <span className='font-bold text-2xl text-blue-700 tracking-wide'>
                    {item.name}
                  </span>
                  <div className='text-sm text-blue-600/70 mt-1'>炼器图纸 · 神兵利器</div>
                </div>
              </div>
              <div className='flex flex-col items-end'>
                <div
                  className={classNames(
                    'px-3 py-1 rounded-lg border border-blue-300/50 backdrop-blur-sm',
                    getSuccessRateBg(item.rate)
                  )}
                >
                  <span className={classNames('text-lg font-bold', getSuccessRateColor(item.rate))}>
                    {~~(item.rate * 100)}%
                  </span>
                </div>
                <div className='text-xs text-blue-600/70 mt-1'>基础成功率</div>
              </div>
            </div>

            {/* 材料区域 */}
            {item.materials && item.materials.length > 0 && (
              <div className='w-full'>
                <div className='flex items-center gap-2 mb-4'>
                  <span className='text-lg'>📦</span>
                  <span className='font-semibold text-blue-700'>炼制材料</span>
                </div>
                <div className='flex flex-wrap gap-3'>
                  {item.materials.map((material, idx) => (
                    <div key={idx} className='relative'>
                      <span className='inline-block bg-gradient-to-r from-blue-100/80 to-blue-200/60 text-blue-700 rounded-lg px-4 py-2 text-sm font-medium border border-blue-300/50 backdrop-blur-sm'>
                        {material.name} × {material.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 炼制提示 */}
            <div className='mt-6 p-4 bg-gradient-to-r from-blue-100/60 to-blue-200/40 rounded-xl border border-blue-300/30 backdrop-blur-sm'>
              <div className='flex items-center gap-2 text-blue-700/80 text-sm'>
                <span>💡</span>
                <span>提示：职业等级越高，炼制成功率加成越大</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='h-8 w-full'></div>
    </HTML>
  );
};

export default Tuzhi;
