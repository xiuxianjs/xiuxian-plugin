import React from 'react';
import HTML from './HTML';
import secretPlaceURL from '@src/resources/img/fairyrealm.jpg';

const SecretPlace = ({ didian_list }) => {
  return (
    <HTML>
      <div
        className='min-h-screen relative overflow-hidden'
        style={{
          backgroundImage: `url(${secretPlaceURL})`,
          backgroundPosition: 'center'
        }}
      >
        {/* 背景装饰元素 */}
        <div className='absolute inset-0 opacity-20'>
          <div className='absolute top-10 left-10 w-32 h-32 border border-blue-400 rounded-full' />
          <div className='absolute top-32 right-20 w-24 h-24 border border-cyan-400 rounded-full' />
          <div className='absolute bottom-20 left-1/4 w-16 h-16 border border-indigo-400 rounded-full' />
          <div className='absolute bottom-40 right-1/3 w-20 h-20 border border-blue-400 rounded-full' />
        </div>

        <div className='relative z-10 container mx-auto px-4 py-8'>
          {/* 主标题区域 */}
          <div className='text-center mb-8'>
            <div className='inline-block relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-lg opacity-30' />
              <div className='relative bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl px-8 py-4 border border-blue-400/30 backdrop-blur-sm'>
                <h1 className='text-3xl font-bold text-white tracking-wider'>🏔️ 秘境 🏔️</h1>
              </div>
            </div>
            <div className='mt-4 text-blue-700 text-sm font-medium'>
              🌟 修仙界神秘秘境，机缘与挑战并存 🌟
            </div>
          </div>

          {/* 主信息区域 */}
          <div className='max-w-6xl mx-auto'>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl' />
              <div className='relative backdrop-blur-sm bg-white/80 rounded-3xl border border-blue-400/30 p-8 shadow-xl'>
                {/* 头部信息 */}
                <div className='text-center mb-8'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                    <div className='bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-3 border border-blue-400/30 backdrop-blur-sm'>
                      <div className='text-sm text-blue-700 font-medium'>降临指令</div>
                      <div className='text-xs text-gray-600'>#降临秘境+秘境名</div>
                    </div>
                    <div className='bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl p-3 border border-cyan-400/30 backdrop-blur-sm'>
                      <div className='text-sm text-cyan-700 font-medium'>筛选指令</div>
                      <div className='text-xs text-gray-600'>#秘境+类型（装备/丹药/草药/功法）</div>
                    </div>
                  </div>
                </div>

                {/* 秘境列表 */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  {didian_list?.map((item, index) => (
                    <div key={index} className='relative group'>
                      <div className='absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-600/10 rounded-2xl blur-sm' />
                      <div className='relative backdrop-blur-md  rounded-2xl border border-blue-400/40 p-6 shadow-lg'>
                        {/* 秘境标题和价格 */}
                        <div className='flex items-center justify-between mb-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-lg flex items-center justify-center border border-blue-300/50 shadow-md'>
                              <span className='text-sm'>
                                {item.Grade === '初级' && '🌱'}
                                {item.Grade === '中级' && '🌿'}
                                {item.Grade === '高级' && '🌳'}
                                {item.Grade === '顶级' && '🌲'}
                                {item.Grade === '传说' && '🌟'}
                                {item.Grade === '神话' && '💎'}
                                {!['初级', '中级', '高级', '顶级', '传说', '神话'].includes(
                                  item.Grade
                                ) && '🏔️'}
                              </span>
                            </div>
                            <div>
                              <h3 className='text-lg font-bold text-blue-800'>
                                【{item.Grade}】{item.name}
                              </h3>
                              <span className='text-xs text-gray-500'>{item.Grade}秘境</span>
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className='text-lg font-bold text-green-600'>{item.Price}</div>
                            <div className='text-xs text-green-500'>灵石</div>
                          </div>
                        </div>

                        {/* 奖励信息 */}
                        <div className='space-y-4'>
                          {/* 低级奖励 */}
                          {item.one && item.one.length > 0 && (
                            <div className='bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl p-4 border border-blue-400/20'>
                              <div className='flex items-center gap-2 mb-2'>
                                <div className='w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center'>
                                  <span className='text-xs'>🌱</span>
                                </div>
                                <span className='text-sm font-medium text-blue-700'>低级奖励</span>
                              </div>
                              <div className='flex flex-wrap gap-2'>
                                {item.one.map((thing, idx) => (
                                  <span
                                    key={idx}
                                    className='inline-block bg-blue-200 text-blue-900 rounded-lg px-3 py-1 text-xs font-semibold border border-blue-300/50'
                                  >
                                    {thing.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 中级奖励 */}
                          {item.two && item.two.length > 0 && (
                            <div className='bg-gradient-to-r from-green-500/10 to-emerald-600/10 rounded-xl p-4 border border-green-400/20'>
                              <div className='flex items-center gap-2 mb-2'>
                                <div className='w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center'>
                                  <span className='text-xs'>🌿</span>
                                </div>
                                <span className='text-sm font-medium text-green-700'>中级奖励</span>
                              </div>
                              <div className='flex flex-wrap gap-2'>
                                {item.two.map((thing, idx) => (
                                  <span
                                    key={idx}
                                    className='inline-block bg-green-200 text-green-900 rounded-lg px-3 py-1 text-xs font-semibold border border-green-300/50'
                                  >
                                    {thing.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 高级奖励 */}
                          {item.three && item.three.length > 0 && (
                            <div className='bg-gradient-to-r from-yellow-500/10 to-orange-600/10 rounded-xl p-4 border border-yellow-400/20'>
                              <div className='flex items-center gap-2 mb-2'>
                                <div className='w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center'>
                                  <span className='text-xs'>🌳</span>
                                </div>
                                <span className='text-sm font-medium text-yellow-700'>
                                  高级奖励
                                </span>
                              </div>
                              <div className='flex flex-wrap gap-2'>
                                {item.three.map((thing, idx) => (
                                  <span
                                    key={idx}
                                    className='inline-block bg-yellow-200 text-yellow-900 rounded-lg px-3 py-1 text-xs font-semibold border border-yellow-300/50'
                                  >
                                    {thing.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 秘境描述 */}
                        <div className='mt-4 text-center'>
                          <div className='inline-block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm'>
                            <span className='text-blue-700 text-sm font-medium'>
                              {item.Grade === '初级' && '🌱 新手秘境，适合初学者'}
                              {item.Grade === '中级' && '🌿 进阶秘境，挑战与机遇并存'}
                              {item.Grade === '高级' && '🌳 高级秘境，强者云集'}
                              {item.Grade === '顶级' && '🌲 顶级秘境，传说级奖励'}
                              {item.Grade === '传说' && '🌟 传说秘境，神话级宝物'}
                              {item.Grade === '神话' && '💎 神话秘境，至尊级机缘'}
                              {!['初级', '中级', '高级', '顶级', '传说', '神话'].includes(
                                item.Grade
                              ) && '🏔️ 神秘秘境，未知的挑战'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 底部统计信息 */}
                <div className='mt-8 pt-6 border-t border-blue-400/20'>
                  <div className='flex items-center justify-center gap-6'>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center'>
                        <span className='text-xs'>📊</span>
                      </div>
                      <span className='text-sm text-blue-700 font-medium'>
                        共 {didian_list?.length || 0} 个秘境
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center'>
                        <span className='text-xs'>💎</span>
                      </div>
                      <span className='text-sm text-green-700 font-medium'>
                        最高价格：
                        {Math.max(...(didian_list?.map(item => item.Price) || [0]))} 灵石
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部装饰 */}
          <div className='text-center mt-12'>
            <div className='inline-block px-6 py-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full border border-blue-400/30 backdrop-blur-sm'>
              <span className='text-blue-700 text-sm font-medium'>
                🏔️ 秘境深处藏机缘，修仙路上寻仙缘 🏔️
              </span>
            </div>
          </div>
        </div>
      </div>
    </HTML>
  );
};

export default SecretPlace;
