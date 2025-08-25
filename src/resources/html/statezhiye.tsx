import React from 'react';
import HTML from './HTML';

const Statezhiye = ({ Level_list }) => {
  return (
    <HTML>
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 relative overflow-hidden'>
        {/* 背景装饰元素 */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-10 left-10 w-32 h-32 border border-violet-400 rounded-full' />
          <div className='absolute top-32 right-20 w-24 h-24 border border-purple-400 rounded-full' />
          <div className='absolute bottom-20 left-1/4 w-16 h-16 border border-indigo-400 rounded-full' />
          <div className='absolute bottom-40 right-1/3 w-20 h-20 border border-pink-400 rounded-full' />
        </div>

        <div className='relative z-10 container mx-auto px-4 py-8'>
          {/* 主标题区域 */}
          <div className='text-center mb-8'>
            <div className='inline-block relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur-lg opacity-50' />
              <div className='relative bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl px-8 py-4 border border-violet-400/30'>
                <h1 className='text-3xl font-bold text-white tracking-wider'>🎯 职业等级图鉴 🎯</h1>
              </div>
            </div>
            <div className='mt-4 text-violet-200 text-sm'>⭐ 修仙路上，职业进阶之路 ⭐</div>
          </div>

          {/* 主信息区域 */}
          <div className='max-w-4xl mx-auto'>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-3xl blur-xl' />
              <div className='relative backdrop-blur-sm bg-white/10 rounded-3xl border border-violet-400/30 p-8'>
                {/* 头部信息 */}
                <div className='text-center mb-8'>
                  <div className='flex items-center justify-center gap-4 mb-4'>
                    <div className='w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl flex items-center justify-center border border-violet-300/50'>
                      <span className='text-2xl'>🎯</span>
                    </div>
                    <h2 className='text-2xl font-bold text-violet-300'>职业等级</h2>
                  </div>
                  <div className='text-sm text-gray-300'>
                    从初学者到大师，每一步都是修仙路上的重要里程碑
                  </div>
                </div>

                {/* 等级列表 */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {Level_list?.map((item, index) => (
                    <div key={index} className='relative group'>
                      <div className='absolute inset-0 bg-gradient-to-br from-violet-400/20 to-purple-600/20 rounded-2xl blur-sm' />
                      <div className='relative backdrop-blur-md bg-white/5 rounded-2xl border border-violet-400/40 p-6'>
                        {/* 等级标题 */}
                        <div className='flex items-center justify-between mb-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-600 rounded-lg flex items-center justify-center'>
                              <span className='text-sm'>
                                {index === 0 && '🌱'}
                                {index === 1 && '🌿'}
                                {index === 2 && '🌳'}
                                {index === 3 && '🌲'}
                                {index === 4 && '🌺'}
                                {index === 5 && '🌸'}
                                {index === 6 && '🌹'}
                                {index === 7 && '🌻'}
                                {index === 8 && '🌼'}
                                {index === 9 && '💐'}
                                {index >= 10 && '🏆'}
                              </span>
                            </div>
                            <div>
                              <h3 className='text-lg font-bold text-violet-200'>
                                等级 {item.name}
                              </h3>
                              <span className='text-xs text-gray-400'>
                                {index === 0 && '初学者'}
                                {index === 1 && '学徒'}
                                {index === 2 && '熟练工'}
                                {index === 3 && '技师'}
                                {index === 4 && '专家'}
                                {index === 5 && '大师'}
                                {index === 6 && '宗师'}
                                {index === 7 && '传奇'}
                                {index === 8 && '神话'}
                                {index === 9 && '传说'}
                                {index >= 10 && '至尊'}
                              </span>
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className='text-lg font-bold text-yellow-300'>#{index + 1}</div>
                            <div className='text-xs text-yellow-400'>等级</div>
                          </div>
                        </div>

                        {/* 熟练度要求 */}
                        <div className='bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl p-4 border border-violet-400/20 mb-4'>
                          <div className='flex items-center gap-2 mb-2'>
                            <div className='w-6 h-6 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full flex items-center justify-center'>
                              <span className='text-xs'>📊</span>
                            </div>
                            <span className='text-sm font-medium text-violet-200'>熟练度要求</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <div className='w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center'>
                              <span className='text-xs'>⭐</span>
                            </div>
                            <span className='text-lg font-bold text-yellow-200'>
                              {item.experience}
                            </span>
                          </div>
                        </div>

                        {/* 进度指示器 */}
                        <div className='flex items-center gap-2'>
                          <div className='flex-1 bg-gray-700/30 rounded-full h-2'>
                            <div
                              className='bg-gradient-to-r from-violet-400 to-purple-600 h-2 rounded-full'
                              style={{
                                width: `${Math.min((index + 1) * 10, 100)}%`
                              }}
                            />
                          </div>
                          <span className='text-xs text-gray-300'>
                            {Math.min((index + 1) * 10, 100)}%
                          </span>
                        </div>

                        {/* 等级描述 */}
                        <div className='mt-4 text-center'>
                          <div className='inline-block px-3 py-1 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full border border-violet-400/30 backdrop-blur-sm'>
                            <span className='text-violet-200 text-xs font-medium'>
                              {index === 0 && '初入修仙路'}
                              {index === 1 && '掌握基础技能'}
                              {index === 2 && '技艺日渐纯熟'}
                              {index === 3 && '成为技术专家'}
                              {index === 4 && '技艺炉火纯青'}
                              {index === 5 && '达到大师境界'}
                              {index === 6 && '技艺登峰造极'}
                              {index === 7 && '成为传奇人物'}
                              {index === 8 && '技艺超越凡俗'}
                              {index === 9 && '达到传说境界'}
                              {index >= 10 && '修仙界至尊'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 底部统计信息 */}
                <div className='mt-8 pt-6 border-t border-violet-400/20'>
                  <div className='flex items-center justify-center gap-6'>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full flex items-center justify-center'>
                        <span className='text-xs'>📈</span>
                      </div>
                      <span className='text-sm text-violet-200'>
                        共 {Level_list?.length || 0} 个等级
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center'>
                        <span className='text-xs'>⭐</span>
                      </div>
                      <span className='text-sm text-yellow-200'>
                        最高熟练度：
                        {Level_list?.[Level_list.length - 1]?.experience || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部装饰 */}
          <div className='text-center mt-12'>
            <div className='inline-block px-6 py-3 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-full border border-violet-400/30 backdrop-blur-sm'>
              <span className='text-violet-200 text-sm'>🎯 修仙路上，职业等级见证成长 🎯</span>
            </div>
          </div>
        </div>
      </div>
    </HTML>
  );
};

export default Statezhiye;
