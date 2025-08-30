import React from 'react';
import HTML from './HTML';

const Supermarket = ({ Exchange_list }) => {
  return (
    <HTML>
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 relative overflow-hidden'>
        {/* 背景装饰元素 */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-10 left-10 w-32 h-32 border border-cyan-400 rounded-full' />
          <div className='absolute top-32 right-20 w-24 h-24 border border-blue-400 rounded-full' />
          <div className='absolute bottom-20 left-1/4 w-16 h-16 border border-teal-400 rounded-full' />
          <div className='absolute bottom-40 right-1/3 w-20 h-20 border border-indigo-400 rounded-full' />
        </div>

        <div className='relative z-10 container mx-auto px-4 py-8'>
          {/* 主标题区域 */}
          <div className='text-center mb-8'>
            <div className='inline-block relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur-lg opacity-50' />
              <div className='relative bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl px-8 py-4 border border-cyan-400/30'>
                <h1 className='text-3xl font-bold text-white tracking-wider'>🏪 冲水堂 🏪</h1>
              </div>
            </div>
            <div className='mt-4 text-cyan-200 text-sm'>💰 修仙界交易集市 💰</div>
          </div>

          {/* 主信息区域 */}
          <div className='max-w-6xl mx-auto'>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl' />
              <div className='relative backdrop-blur-sm bg-white/10 rounded-3xl border border-cyan-400/30 p-8'>
                {/* 头部信息 */}
                <div className='text-center mb-8'>
                  <div className='flex items-center justify-center gap-4 mb-4'>
                    <div className='w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center border border-cyan-300/50'>
                      <span className='text-2xl'>🏪</span>
                    </div>
                    <h2 className='text-2xl font-bold text-cyan-300'>冲水堂</h2>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                    <div className='bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-3 border border-green-400/30 backdrop-blur-sm'>
                      <div className='text-sm text-green-200 font-medium'>上架指令</div>
                      <div className='text-xs text-gray-300'>#上架+物品名*价格*数量</div>
                      <div className='text-xs text-orange-300 mt-1'>💰 税收：低于100w收3%税，每多100w多收3%</div>
                    </div>
                    <div className='bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl p-3 border border-blue-400/30 backdrop-blur-sm'>
                      <div className='text-sm text-blue-200 font-medium'>选购指令</div>
                      <div className='text-xs text-gray-300'>#选购+编号*数量</div>
                    </div>
                    <div className='bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl p-3 border border-red-400/30 backdrop-blur-sm'>
                      <div className='text-sm text-red-200 font-medium'>下架指令</div>
                      <div className='text-xs text-gray-300'>#下架+编号</div>
                    </div>
                  </div>
                </div>

                {/* 商品列表 */}
                <div className='grid grid-cols-2 gap-6'>
                  {Exchange_list?.map((item, index) => (
                    <div key={index} className='relative group'>
                      <div className='absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-2xl blur-sm' />
                      <div className='relative backdrop-blur-md bg-white/5 rounded-2xl border border-cyan-400/40 p-6'>
                        {/* 商品标题和编号 */}
                        <div className='flex items-center justify-between mb-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center'>
                              <span className='text-sm'>
                                {item.name.class === '装备' && '⚔️'}
                                {item.name.class === '丹药' && '🧪'}
                                {item.name.class === '功法' && '📚'}
                                {item.name.class === '道具' && '🎒'}
                                {item.name.class === '仙宠' && '🐉'}
                                {item.name.class === '草药' && '🌿'}
                              </span>
                            </div>
                            <div>
                              <h3 className='text-lg font-bold text-cyan-200'>
                                {item.name.class === '装备'
                                  ? `【${item.name.class}】${item.name.name}【${item.pinji}】`
                                  : `【${item.name.class}】${item.name.name}`}
                              </h3>
                              <span className='text-xs text-gray-400'>{item.name.class}</span>
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className='text-lg font-bold text-yellow-300'>No.{item.num}</div>
                            <div className='text-xs text-yellow-400'>编号</div>
                          </div>
                        </div>

                        {/* 商品属性 */}
                        {item.name.class === '装备' && (
                          <div className='grid grid-cols-2 gap-3 mb-4'>
                            {item.name.atk > 10 || item.name.def > 10 || item.name.HP > 10 ? (
                              <>
                                <div className='flex items-center gap-2'>
                                  <div className='w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center'>
                                    <span className='text-xs'>⚡</span>
                                  </div>
                                  <span className='text-sm text-gray-200'>属性: 无</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                  <div className='w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center'>
                                    <span className='text-xs'>⚔️</span>
                                  </div>
                                  <span className='text-sm text-red-200'>攻击：{item.name.atk.toFixed(0)}</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                  <div className='w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center'>
                                    <span className='text-xs'>🛡️</span>
                                  </div>
                                  <span className='text-sm text-blue-200'>防御：{item.name.def.toFixed(0)}</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                  <div className='w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center'>
                                    <span className='text-xs'>❤️</span>
                                  </div>
                                  <span className='text-sm text-green-200'>血量：{item.name.HP.toFixed(0)}</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className='flex items-center gap-2'>
                                  <div className='w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center'>
                                    <span className='text-xs'>🌟</span>
                                  </div>
                                  <span className='text-sm text-yellow-200'>属性: {['金', '木', '土', '水', '火'][item.name.id - 1]}</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                  <div className='w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center'>
                                    <span className='text-xs'>⚔️</span>
                                  </div>
                                  <span className='text-sm text-red-200'>攻击：{(item.name.atk * 100).toFixed(0)}%</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                  <div className='w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center'>
                                    <span className='text-xs'>🛡️</span>
                                  </div>
                                  <span className='text-sm text-blue-200'>防御：{(item.name.def * 100).toFixed(0)}%</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                  <div className='w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center'>
                                    <span className='text-xs'>❤️</span>
                                  </div>
                                  <span className='text-sm text-green-200'>血量：{(item.name.HP * 100).toFixed(0)}%</span>
                                </div>
                              </>
                            )}
                            <div className='flex items-center gap-2'>
                              <div className='w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center'>
                                <span className='text-xs'>💥</span>
                              </div>
                              <span className='text-sm text-purple-200'>暴击：{(item.name.bao * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        )}

                        {item.name.class === '仙宠' && (
                          <div className='bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-400/20 mb-4'>
                            <div className='flex items-center gap-2'>
                              <div className='w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center'>
                                <span className='text-xs'>🐉</span>
                              </div>
                              <span className='text-sm font-medium text-purple-200'>等级：{item.name.等级.toFixed(0)}</span>
                            </div>
                          </div>
                        )}

                        {/* 交易信息 */}
                        <div className='grid grid-cols-2 gap-3 mb-4'>
                          <div className='flex items-center gap-2'>
                            <div className='w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center'>
                              <span className='text-xs'>💰</span>
                            </div>
                            <span className='text-sm text-blue-200'>单价：{item.price}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <div className='w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center'>
                              <span className='text-xs'>📦</span>
                            </div>
                            <span className='text-sm text-green-200'>数量：{item.amount}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <div className='w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center'>
                              <span className='text-xs'>💎</span>
                            </div>
                            <span className='text-sm text-yellow-200'>总价：{item.price * item.amount}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <div className='w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center'>
                              <span className='text-xs'>👤</span>
                            </div>
                            <span className='text-sm text-gray-200'>账号：{item.qq}</span>
                          </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className='flex justify-center gap-3'>
                          <div className='inline-block px-3 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30 backdrop-blur-sm'>
                            <span className='text-green-200 text-sm font-medium'>🛒 购买</span>
                          </div>
                          <div className='inline-block px-3 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full border border-red-400/30 backdrop-blur-sm'>
                            <span className='text-red-200 text-sm font-medium'>❌ 下架</span>
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
            <div className='inline-block px-6 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full border border-cyan-400/30 backdrop-blur-sm'>
              <span className='text-cyan-200 text-sm'>💰 冲水堂中交易忙，修仙路上共成长 💰</span>
            </div>
          </div>
        </div>
      </div>
    </HTML>
  );
};

export default Supermarket;
