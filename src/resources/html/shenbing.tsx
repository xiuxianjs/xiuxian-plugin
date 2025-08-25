import React from 'react';
import HTML from './HTML';

const Shenbing = ({ newwupin }) => {
  return (
    <HTML>
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 relative overflow-hidden'>
        {/* 背景装饰元素 */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-10 left-10 w-32 h-32 border border-red-400 rounded-full'></div>
          <div className='absolute top-32 right-20 w-24 h-24 border border-orange-400 rounded-full'></div>
          <div className='absolute bottom-20 left-1/4 w-16 h-16 border border-yellow-400 rounded-full'></div>
          <div className='absolute bottom-40 right-1/3 w-20 h-20 border border-amber-400 rounded-full'></div>
        </div>

        <div className='relative z-10 container mx-auto px-4 py-8'>
          {/* 主标题区域 */}
          <div className='text-center mb-8'>
            <div className='inline-block relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur-lg opacity-50'></div>
              <div className='relative bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl px-8 py-4 border border-red-400/30'>
                <h1 className='text-3xl font-bold text-white tracking-wider'>⚔️ 神兵榜 ⚔️</h1>
              </div>
            </div>
            <div className='mt-4 text-red-200 text-sm'>🔥 修仙界最强神兵排行榜 🔥</div>
          </div>

          {/* 主信息区域 */}
          <div className='max-w-4xl mx-auto'>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-xl'></div>
              <div className='relative backdrop-blur-sm bg-white/10 rounded-3xl border border-red-400/30 p-8'>
                {/* 头部信息 */}
                <div className='text-center mb-8'>
                  <div className='flex items-center justify-center gap-4 mb-4'>
                    <div className='w-12 h-12 bg-gradient-to-br from-red-400 to-orange-600 rounded-xl flex items-center justify-center border border-red-300/50'>
                      <span className='text-2xl'>⚔️</span>
                    </div>
                    <h2 className='text-2xl font-bold text-red-300'>神兵榜</h2>
                  </div>
                  <div className='text-sm text-gray-300'>修仙界最强神兵，每一件都是传奇</div>
                </div>

                {/* 神兵列表 */}
                <div className='space-y-6'>
                  {newwupin?.map((item, index) => (
                    <div key={index} className='relative group'>
                      <div className='absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-600/20 rounded-2xl blur-sm'></div>
                      <div className='relative backdrop-blur-md bg-white/5 rounded-2xl border border-red-400/40 p-6'>
                        {/* 排名和标题 */}
                        <div className='flex items-center justify-between mb-6'>
                          <div className='flex items-center gap-4'>
                            <div className='relative'>
                              <div className='absolute inset-0 bg-gradient-to-br from-red-400 to-orange-600 rounded-full blur-sm'></div>
                              <div className='relative w-16 h-16 bg-gradient-to-br from-red-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-red-300/50'>
                                <span className='text-xl font-bold text-white'>
                                  {index === 0 && '🥇'}
                                  {index === 1 && '🥈'}
                                  {index === 2 && '🥉'}
                                  {index >= 3 && `#${index + 1}`}
                                </span>
                              </div>
                            </div>
                            <div>
                              <h3 className='text-2xl font-bold text-red-200 mb-1'>{item.name}</h3>
                              <span className='text-sm text-gray-400'>{item.type}</span>
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className='text-3xl font-bold text-yellow-300'>{item.评分}</div>
                            <div className='text-sm text-yellow-400'>灵韵值</div>
                          </div>
                        </div>

                        {/* 神兵信息 */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                          {/* 缔造者信息 */}
                          <div className='bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-400/20'>
                            <div className='flex items-center gap-2 mb-2'>
                              <div className='w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center'>
                                <span className='text-xs'>🔨</span>
                              </div>
                              <span className='text-sm font-medium text-blue-200'>缔造者</span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <div className='w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center'>
                                <span className='text-xs'>👨‍🔧</span>
                              </div>
                              <span className='text-lg font-bold text-blue-100'>{item.制作者}</span>
                            </div>
                          </div>

                          {/* 持兵者信息 */}
                          <div className='bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-400/20'>
                            <div className='flex items-center gap-2 mb-2'>
                              <div className='w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center'>
                                <span className='text-xs'>⚔️</span>
                              </div>
                              <span className='text-sm font-medium text-green-200'>持兵者</span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <div className='w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center'>
                                <span className='text-xs'>👤</span>
                              </div>
                              <span className='text-lg font-bold text-green-100'>
                                {item.使用者}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 神兵等级指示器 */}
                        <div className='mt-6'>
                          <div className='flex items-center gap-3 mb-2'>
                            <div className='w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center'>
                              <span className='text-xs'>⭐</span>
                            </div>
                            <span className='text-sm font-medium text-yellow-200'>神兵等级</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <div className='flex-1 bg-gray-700/30 rounded-full h-3'>
                              <div
                                className='bg-gradient-to-r from-yellow-400 to-orange-600 h-3 rounded-full'
                                style={{
                                  width: `${Math.min((item.评分 / 100) * 100, 100)}%`
                                }}
                              ></div>
                            </div>
                            <span className='text-xs text-gray-300'>
                              {Math.min((item.评分 / 100) * 100, 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        {/* 神兵描述 */}
                        <div className='mt-4 text-center'>
                          <div className='inline-block px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full border border-red-400/30 backdrop-blur-sm'>
                            <span className='text-red-200 text-sm font-medium'>
                              {index === 0 && '🏆 至尊神兵，威震修仙界'}
                              {index === 1 && '🥈 绝世神兵，锋芒毕露'}
                              {index === 2 && '🥉 传奇神兵，名震四方'}
                              {index >= 3 && index < 10 && '⚔️ 顶级神兵，威力无穷'}
                              {index >= 10 && '🗡️ 精品神兵，品质上乘'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 底部统计信息 */}
                <div className='mt-8 pt-6 border-t border-red-400/20'>
                  <div className='flex items-center justify-center gap-6'>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center'>
                        <span className='text-xs'>📊</span>
                      </div>
                      <span className='text-sm text-red-200'>
                        共 {newwupin?.length || 0} 件神兵
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center'>
                        <span className='text-xs'>🏆</span>
                      </div>
                      <span className='text-sm text-yellow-200'>
                        最高灵韵值：{newwupin?.[0]?.评分 || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部装饰 */}
          <div className='text-center mt-12'>
            <div className='inline-block px-6 py-3 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-full border border-red-400/30 backdrop-blur-sm'>
              <span className='text-red-200 text-sm'>⚔️ 神兵在手，天下我有 ⚔️</span>
            </div>
          </div>
        </div>
      </div>
    </HTML>
  );
};

export default Shenbing;
