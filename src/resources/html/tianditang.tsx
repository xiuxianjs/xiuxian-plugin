import React from 'react';
import HTML from './HTML';

const TianDiTang = ({ name, jifen, commodities_list }) => {
  return (
    <HTML>
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 relative overflow-hidden'>
        {/* 背景装饰元素 */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-10 left-10 w-32 h-32 border border-orange-400 rounded-full'></div>
          <div className='absolute top-32 right-20 w-24 h-24 border border-yellow-400 rounded-full'></div>
          <div className='absolute bottom-20 left-1/4 w-16 h-16 border border-red-400 rounded-full'></div>
          <div className='absolute bottom-40 right-1/3 w-20 h-20 border border-amber-400 rounded-full'></div>
        </div>

        <div className='relative z-10 container mx-auto px-4 py-8'>
          {/* 主标题区域 */}
          <div className='text-center mb-8'>
            <div className='inline-block relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl blur-lg opacity-50'></div>
              <div className='relative bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl px-8 py-4 border border-orange-400/30'>
                <h1 className='text-3xl font-bold text-white tracking-wider'>🏛️ 天地堂 🏛️</h1>
              </div>
            </div>
            <div className='mt-4 text-orange-200 text-sm'>💎 修仙界积分兑换圣地 💎</div>
          </div>

          {/* 主信息区域 */}
          <div className='max-w-6xl mx-auto'>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-3xl blur-xl'></div>
              <div className='relative backdrop-blur-sm bg-white/10 rounded-3xl border border-orange-400/30 p-8'>
                {/* 头部信息 */}
                <div className='text-center mb-8'>
                  <div className='flex items-center justify-center gap-4 mb-4'>
                    <div className='w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-600 rounded-xl flex items-center justify-center border border-orange-300/50'>
                      <span className='text-2xl'>🏛️</span>
                    </div>
                    <h2 className='text-2xl font-bold text-orange-300'>天地堂</h2>
                  </div>

                  <div className='space-y-2 mb-6'>
                    <div className='text-sm text-gray-300'>购买指令：#积分兑换+物品名</div>
                    <div className='text-sm text-gray-300'>每周日开放物品兑换</div>
                  </div>

                  <div className='inline-block px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30 backdrop-blur-sm'>
                    <span className='text-green-200 text-lg font-bold'>
                      {name}的积分：{jifen}
                    </span>
                  </div>
                </div>

                {/* 商品列表 */}
                <div className='grid grid-cols-2 gap-6'>
                  {commodities_list &&
                    commodities_list.map((item, index) => (
                      <div key={index} className='relative group'>
                        <div className='absolute inset-0 bg-gradient-to-br from-orange-400/20 to-yellow-600/20 rounded-2xl blur-sm'></div>
                        <div className='relative backdrop-blur-md bg-white/5 rounded-2xl border border-orange-400/40 p-6'>
                          {/* 商品标题和积分 */}
                          <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center gap-3'>
                              <div className='w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-600 rounded-lg flex items-center justify-center'>
                                <span className='text-sm'>
                                  {item.class === '装备' && '⚔️'}
                                  {item.class === '丹药' && '🧪'}
                                  {item.class === '功法' && '📚'}
                                  {item.class === '道具' && '🎒'}
                                  {item.class === '草药' && '🌿'}
                                </span>
                              </div>
                              <div>
                                <h3 className='text-lg font-bold text-orange-200'>
                                  【{item.type}】{item.name}
                                </h3>
                                <span className='text-xs text-gray-400'>{item.class}</span>
                              </div>
                            </div>
                            <div className='text-right'>
                              <div className='text-lg font-bold text-green-300'>{item.积分}</div>
                              <div className='text-xs text-green-400'>积分</div>
                            </div>
                          </div>

                          {/* 商品属性 */}
                          {item.class === '装备' && (
                            <div className='grid grid-cols-2 gap-3 mb-4'>
                              <div className='flex items-center gap-2'>
                                <div className='w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center'>
                                  <span className='text-xs'>⚔️</span>
                                </div>
                                <span className='text-sm text-red-200'>攻击：{item.atk}</span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <div className='w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center'>
                                  <span className='text-xs'>🛡️</span>
                                </div>
                                <span className='text-sm text-blue-200'>防御：{item.def}</span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <div className='w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center'>
                                  <span className='text-xs'>❤️</span>
                                </div>
                                <span className='text-sm text-green-200'>血量：{item.HP}</span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <div className='w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center'>
                                  <span className='text-xs'>💥</span>
                                </div>
                                <span className='text-sm text-purple-200'>
                                  暴击：{(item.bao * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          )}

                          {item.class === '丹药' && (
                            <div className='bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl p-4 border border-red-400/20 mb-4'>
                              <div className='flex items-center gap-2 mb-2'>
                                <div className='w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center'>
                                  <span className='text-xs'>💊</span>
                                </div>
                                <span className='text-sm font-medium text-red-200'>丹药效果</span>
                              </div>
                              <p className='text-sm text-gray-200'>
                                {item.exp}
                                {item.xueqi}
                              </p>
                            </div>
                          )}

                          {item.class === '功法' && (
                            <div className='bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl p-4 border border-purple-400/20 mb-4'>
                              <div className='flex items-center gap-2 mb-2'>
                                <div className='w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center'>
                                  <span className='text-xs'>📚</span>
                                </div>
                                <span className='text-sm font-medium text-purple-200'>
                                  修炼加成
                                </span>
                              </div>
                              <p className='text-sm text-gray-200'>
                                {(item.修炼加成 * 100).toFixed(0)}%
                              </p>
                            </div>
                          )}

                          {(item.class === '道具' || item.class === '草药') && (
                            <div className='bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-400/20 mb-4'>
                              <div className='flex items-center gap-2 mb-2'>
                                <div className='w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center'>
                                  <span className='text-xs'>📝</span>
                                </div>
                                <span className='text-sm font-medium text-green-200'>描述</span>
                              </div>
                              <p className='text-sm text-gray-200'>{item.desc}</p>
                            </div>
                          )}

                          {/* 兑换按钮 */}
                          <div className='flex justify-center'>
                            <div className='inline-block px-4 py-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full border border-orange-400/30 backdrop-blur-sm'>
                              <span className='text-orange-200 text-sm font-medium'>
                                💰 兑换此物品
                              </span>
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
            <div className='inline-block px-6 py-3 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 rounded-full border border-orange-400/30 backdrop-blur-sm'>
              <span className='text-orange-200 text-sm'>💎 天地堂中藏珍宝，积分兑换显神通 💎</span>
            </div>
          </div>
        </div>
      </div>
    </HTML>
  );
};

export default TianDiTang;
