import React from 'react';
import HTML from './HTML';
import classNames from 'classnames';

const XianChong = ({ nickname, XianChong_have: xianChongHave, XianChong_need: xianChongNeed, Kouliang }) => {
  return (
    <HTML>
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden'>
        {/* 背景装饰元素 */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-10 left-10 w-32 h-32 border border-purple-400 rounded-full' />
          <div className='absolute top-32 right-20 w-24 h-24 border border-blue-400 rounded-full' />
          <div className='absolute bottom-20 left-1/4 w-16 h-16 border border-cyan-400 rounded-full' />
          <div className='absolute bottom-40 right-1/3 w-20 h-20 border border-pink-400 rounded-full' />
        </div>

        <div className='relative z-10 container mx-auto px-4 py-8'>
          {/* 主标题区域 */}
          <div className='text-center mb-8'>
            <div className='inline-block relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-50' />
              <div className='relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl px-8 py-4 border border-purple-400/30'>
                <h1 className='text-3xl font-bold text-white tracking-wider'>✨ {nickname}的仙宠图鉴 ✨</h1>
              </div>
            </div>
            <div className='mt-4 text-purple-200 text-sm'>🐉 修仙之路，仙宠相伴 🐉</div>
          </div>

          <div className='max-w-6xl mx-auto space-y-8'>
            {/* 已拥有仙宠 */}
            {xianChongHave && xianChongHave.length > 0 && (
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl' />
                <div className='relative backdrop-blur-sm bg-white/10 rounded-3xl border border-green-400/30 p-8'>
                  <div className='flex items-center mb-6'>
                    <div className='w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mr-4 border border-green-300/50'>
                      <span className='text-2xl'>🌟</span>
                    </div>
                    <h2 className='text-2xl font-bold text-green-300 tracking-wide'>【已拥有仙宠】</h2>
                  </div>
                  <div className='grid grid-cols-2 gap-6'>
                    {xianChongHave.map((item, index) => (
                      <div key={index} className='group relative'>
                        <div className='absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-2xl blur-sm' />
                        <div className='relative backdrop-blur-md bg-white/5 rounded-2xl border border-green-400/40 p-6 hover:border-green-300/60 transition-all duration-300'>
                          <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-xl font-bold text-green-200 group-hover:text-green-100 transition-colors'>{item.name}</h3>
                            <div className='w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center'>
                              <span className='text-sm'>🐾</span>
                            </div>
                          </div>

                          <div className='space-y-3'>
                            <div className='flex items-center text-sm'>
                              <span className='w-16 text-purple-200'>类型</span>
                              <span className='text-green-100 font-medium'>{item.type}</span>
                            </div>
                            <div className='flex items-center text-sm'>
                              <span className='w-16 text-purple-200'>初始加成</span>
                              <span className='text-green-100 font-medium'>{(item.初始加成 * 100).toFixed(1)}%</span>
                            </div>
                            <div className='flex items-center text-sm'>
                              <span className='w-16 text-purple-200'>每级增加</span>
                              <span className='text-green-100 font-medium'>{(item.每级增加 * 100).toFixed(1)}%</span>
                            </div>
                            <div className='flex items-center text-sm'>
                              <span className='w-16 text-purple-200'>当前加成</span>
                              <span className='text-green-100 font-medium'>{(item.加成 * 100).toFixed(1)}%</span>
                            </div>
                            <div className='flex items-center text-sm'>
                              <span className='w-16 text-purple-200'>灵魂绑定</span>
                              <span
                                className={classNames('font-medium', {
                                  'text-red-300': item.灵魂绑定 === 0,
                                  'text-green-300': item.灵魂绑定 === 1
                                })}
                              >
                                {item.灵魂绑定 === 0 ? '❌ 否' : '✅ 是'}
                              </span>
                            </div>
                            <div className='flex items-center text-sm'>
                              <span className='w-16 text-purple-200'>品级</span>
                              <span className='text-green-100 font-medium'>{item.品级}</span>
                            </div>
                            <div className='flex items-center text-sm'>
                              <span className='w-16 text-purple-200'>等级上限</span>
                              <span className='text-green-100 font-medium'>{item.等级上限}</span>
                            </div>
                            <div className='flex items-center text-sm'>
                              <span className='w-16 text-purple-200'>价格</span>
                              <span className='text-yellow-300 font-medium'>{item.出售价}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 未拥有仙宠 */}
            {xianChongNeed && xianChongNeed.length > 0 && (
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-3xl blur-xl' />
                <div className='relative backdrop-blur-sm bg-white/10 rounded-3xl border border-red-400/30 p-8'>
                  <div className='flex items-center mb-6'>
                    <div className='w-12 h-12 bg-gradient-to-br from-red-400 to-pink-600 rounded-xl flex items-center justify-center mr-4 border border-red-300/50'>
                      <span className='text-2xl'>🔮</span>
                    </div>
                    <h2 className='text-2xl font-bold text-red-300 tracking-wide'>【未拥有仙宠】</h2>
                  </div>
                  <div className='grid grid-cols-2 gap-6'>
                    {xianChongNeed.map((item, index) => (
                      <div key={index} className='group relative'>
                        <div className='absolute inset-0 bg-gradient-to-br from-red-400/20 to-pink-600/20 rounded-2xl blur-sm' />
                        <div className='relative backdrop-blur-md bg-white/5 rounded-2xl border border-red-400/40 p-6 hover:border-red-300/60 transition-all duration-300'>
                          <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-xl font-bold text-red-200 group-hover:text-red-100 transition-colors'>{item.name}</h3>
                            <div className='w-8 h-8 bg-gradient-to-br from-red-400 to-pink-600 rounded-lg flex items-center justify-center'>
                              <span className='text-sm'>🔒</span>
                            </div>
                          </div>

                          <div className='space-y-3'>
                            <div className='flex items-center text-sm'>
                              <span className='w-16 text-purple-200'>类型</span>
                              <span className='text-red-100 font-medium'>{item.type}</span>
                            </div>
                            <div className='flex items-center text-sm'>
                              <span className='w-16 text-purple-200'>初始加成</span>
                              <span className='text-red-100 font-medium'>{(item.初始加成 * 100).toFixed(1)}%</span>
                            </div>
                            <div className='flex items-center text-sm'>
                              <span className='w-16 text-purple-200'>每级增加</span>
                              <span className='text-red-100 font-medium'>{(item.每级增加 * 100).toFixed(1)}%</span>
                            </div>
                            <div className='flex items-center text-sm'>
                              <span className='w-16 text-purple-200'>当前加成</span>
                              <span className='text-red-100 font-medium'>{(item.加成 * 100).toFixed(1)}%</span>
                            </div>
                            <div className='flex items-center text-sm'>
                              <span className='w-16 text-purple-200'>灵魂绑定</span>
                              <span
                                className={classNames('font-medium', {
                                  'text-red-300': item.灵魂绑定 === 0,
                                  'text-green-300': item.灵魂绑定 === 1
                                })}
                              >
                                {item.灵魂绑定 === 0 ? '❌ 否' : '✅ 是'}
                              </span>
                            </div>
                            <div className='flex items-center text-sm'>
                              <span className='w-16 text-purple-200'>品级</span>
                              <span className='text-red-100 font-medium'>{item.品级}</span>
                            </div>
                            <div className='flex items-center text-sm'>
                              <span className='w-16 text-purple-200'>等级上限</span>
                              <span className='text-red-100 font-medium'>{item.等级上限}</span>
                            </div>
                            <div className='flex items-center text-sm'>
                              <span className='w-16 text-purple-200'>价格</span>
                              <span className='text-yellow-300 font-medium'>{item.出售价}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 口粮图鉴 */}
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl blur-xl' />
              <div className='relative backdrop-blur-sm bg-white/10 rounded-3xl border border-yellow-400/30 p-8'>
                <div className='flex items-center mb-6'>
                  <div className='w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center mr-4 border border-yellow-300/50'>
                    <span className='text-2xl'>🍖</span>
                  </div>
                  <h2 className='text-2xl font-bold text-yellow-300 tracking-wide'>【口粮图鉴】</h2>
                </div>
                <div className='grid grid-cols-2 gap-6'>
                  {Kouliang?.map((item, index) => (
                    <div key={index} className='group relative'>
                      <div className='absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-2xl blur-sm' />
                      <div className='relative backdrop-blur-md bg-white/5 rounded-2xl border border-yellow-400/40 p-6 hover:border-yellow-300/60 transition-all duration-300'>
                        <div className='flex items-center justify-between mb-4'>
                          <h3 className='text-xl font-bold text-yellow-200 group-hover:text-yellow-100 transition-colors'>{item.name}</h3>
                          <div className='w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-lg flex items-center justify-center'>
                            <span className='text-sm'>🥘</span>
                          </div>
                        </div>

                        <div className='space-y-3'>
                          <div className='flex items-center text-sm'>
                            <span className='w-16 text-purple-200'>等级</span>
                            <span className='text-yellow-100 font-medium'>{item.level}</span>
                          </div>
                          <div className='flex items-center text-sm'>
                            <span className='w-16 text-purple-200'>价格</span>
                            <span className='text-yellow-300 font-medium'>{item.出售价.toFixed(0)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 底部装饰 */}
          <div className='text-center mt-12'>
            <div className='inline-block px-6 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full border border-purple-400/30 backdrop-blur-sm'>
              <span className='text-purple-200 text-sm'>✨ 修仙之路漫漫，仙宠相伴前行 ✨</span>
            </div>
          </div>
        </div>
      </div>
    </HTML>
  );
};

export default XianChong;
