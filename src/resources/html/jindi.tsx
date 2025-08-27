import React from 'react';
import HTML from './HTML';
import secretPlaceURL from '@src/resources/img/fairyrealm.jpg';
import cardURL from '@src/resources/img/road.jpg';

interface JindiItem {
  Grade: string | number;
  name: string;
  Best: string[];
  Price: number | string;
  experience: number | string;
}

const SecretPlace = ({ didian_list }: { didian_list?: JindiItem[] }) => {
  return (
    <HTML>
      <div
        className='min-h-screen relative overflow-hidden'
        style={{
          backgroundImage: `url(${secretPlaceURL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* 背景遮罩 */}
        <div className='absolute inset-0 bg-gradient-to-br from-black/60 via-gray-900/50 to-black/70' />

        {/* 背景装饰元素 */}
        <div className='absolute inset-0 opacity-30'>
          <div className='absolute top-10 left-10 w-32 h-32 border border-red-400 rounded-full' />
          <div className='absolute top-32 right-20 w-24 h-24 border border-orange-400 rounded-full' />
          <div className='absolute bottom-20 left-1/4 w-16 h-16 border border-yellow-400 rounded-full' />
          <div className='absolute bottom-40 right-1/3 w-20 h-20 border border-red-400 rounded-full' />
        </div>

        <div className='relative z-10 container mx-auto px-4 py-8'>
          {/* 主标题区域 */}
          <div className='text-center mb-8'>
            <div className='inline-block relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur-lg opacity-50' />
              <div className='relative bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl px-8 py-4 border border-red-400/30 backdrop-blur-sm'>
                <h1 className='text-3xl font-bold text-white tracking-wider'>⚠️ 禁地 ⚠️</h1>
              </div>
            </div>
            <div className='mt-4 text-red-200 text-sm'>🔥 修仙界危险禁地，生死与机缘并存 🔥</div>
          </div>

          {/* 主信息区域 */}
          <div className='max-w-6xl mx-auto'>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-xl' />
              <div className='relative backdrop-blur-sm bg-black/40 rounded-3xl border border-red-400/30 p-8 shadow-xl'>
                {/* 禁地列表 */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {didian_list?.length ? (
                    didian_list.map((item, index) => (
                      <div key={index} className='relative group'>
                        <div className='absolute inset-0 bg-gradient-to-br from-red-400/20 to-orange-600/20 rounded-2xl blur-sm' />
                        <div
                          className='relative backdrop-blur-md bg-black/60 rounded-2xl border border-red-400/40 p-6 shadow-lg'
                          style={{
                            backgroundImage: `url(${cardURL})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          {/* 禁地标题和等级 */}
                          <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center gap-3'>
                              <div className='w-10 h-10 bg-gradient-to-br from-red-400 to-orange-600 rounded-lg flex items-center justify-center border border-red-300/50 shadow-md'>
                                <span className='text-sm'>
                                  {typeof item.Grade === 'number' && item.Grade <= 10 && '🌱'}
                                  {typeof item.Grade === 'number' &&
                                    item.Grade > 10 &&
                                    item.Grade <= 20 &&
                                    '🌿'}
                                  {typeof item.Grade === 'number' &&
                                    item.Grade > 20 &&
                                    item.Grade <= 30 &&
                                    '🌳'}
                                  {typeof item.Grade === 'number' &&
                                    item.Grade > 30 &&
                                    item.Grade <= 40 &&
                                    '🌲'}
                                  {typeof item.Grade === 'number' &&
                                    item.Grade > 40 &&
                                    item.Grade <= 50 &&
                                    '🌟'}
                                  {typeof item.Grade === 'number' && item.Grade > 50 && '💎'}
                                  {typeof item.Grade === 'string' &&
                                    item.Grade.includes('初级') &&
                                    '🌱'}
                                  {typeof item.Grade === 'string' &&
                                    item.Grade.includes('中级') &&
                                    '🌿'}
                                  {typeof item.Grade === 'string' &&
                                    item.Grade.includes('高级') &&
                                    '🌳'}
                                  {typeof item.Grade === 'string' &&
                                    item.Grade.includes('顶级') &&
                                    '🌲'}
                                  {typeof item.Grade === 'string' &&
                                    item.Grade.includes('传说') &&
                                    '🌟'}
                                  {typeof item.Grade === 'string' &&
                                    item.Grade.includes('神话') &&
                                    '💎'}
                                  {!['🌱', '🌿', '🌳', '🌲', '🌟', '💎'].includes(
                                    item.Grade as string
                                  ) && '⚠️'}
                                </span>
                              </div>
                              <div>
                                <h3 className='text-lg font-bold text-red-200'>{item.name}</h3>
                                <span className='text-xs text-gray-400'>等级: {item.Grade}</span>
                              </div>
                            </div>
                            <div className='text-right'>
                              <div className='text-lg font-bold text-yellow-300'>#{index + 1}</div>
                              <div className='text-xs text-yellow-400'>禁地</div>
                            </div>
                          </div>

                          {/* 禁地信息 */}
                          <div className='space-y-4'>
                            {/* 极品奖励 */}
                            <div className='bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/20'>
                              <div className='flex items-center gap-2 mb-2'>
                                <div className='w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center'>
                                  <span className='text-xs'>💎</span>
                                </div>
                                <span className='text-sm font-medium text-purple-200'>
                                  极品奖励
                                </span>
                              </div>
                              <div className='flex flex-wrap gap-2'>
                                {item.Best.map((best, idx) => (
                                  <span
                                    key={idx}
                                    className='inline-block bg-purple-200 text-purple-900 rounded-lg px-3 py-1 text-xs font-semibold border border-purple-300/50'
                                  >
                                    {best}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* 进入条件 */}
                            <div className='grid grid-cols-1 gap-3'>
                              <div className='flex items-center gap-2'>
                                <div className='w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center'>
                                  <span className='text-xs'>💰</span>
                                </div>
                                <span className='text-sm text-blue-200'>所需灵石：</span>
                                <span className='text-sm font-bold text-blue-100'>
                                  {item.Price}
                                </span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <div className='w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center'>
                                  <span className='text-xs'>⭐</span>
                                </div>
                                <span className='text-sm text-green-200'>所需修为：</span>
                                <span className='text-sm font-bold text-green-100'>
                                  {item.experience}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 危险等级指示器 */}
                          <div className='mt-4'>
                            <div className='flex items-center gap-3 mb-2'>
                              <div className='w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center'>
                                <span className='text-xs'>🔥</span>
                              </div>
                              <span className='text-sm font-medium text-red-200'>危险等级</span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <div className='flex-1 bg-gray-700/30 rounded-full h-3'>
                                <div
                                  className='bg-gradient-to-r from-red-400 to-orange-600 h-3 rounded-full'
                                  style={{
                                    width: `${Math.min((index + 1) * 15, 100)}%`
                                  }}
                                />
                              </div>
                              <span className='text-xs text-gray-300'>
                                {Math.min((index + 1) * 15, 100)}%
                              </span>
                            </div>
                          </div>

                          {/* 禁地描述 */}
                          <div className='mt-4 text-center'>
                            <div className='inline-block px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full border border-red-400/30 backdrop-blur-sm'>
                              <span className='text-red-200 text-sm font-medium'>
                                {index === 0 && '⚠️ 初级禁地，新手慎入'}
                                {index === 1 && '🔥 中级禁地，挑战与机遇'}
                                {index === 2 && '⚡ 高级禁地，强者云集'}
                                {index >= 3 && index < 6 && '💀 顶级禁地，生死一线'}
                                {index >= 6 && index < 9 && '👹 传说禁地，恶魔横行'}
                                {index >= 9 && '💀 神话禁地，九死一生'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='col-span-full text-center'>
                      <div className='bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-xl p-8 border border-gray-400/30 backdrop-blur-sm'>
                        <div className='w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                          <span className='text-2xl'>⚠️</span>
                        </div>
                        <p className='text-gray-300 text-lg font-medium'>暂无禁地</p>
                        <p className='text-gray-400 text-sm mt-2'>等待新的禁地出现</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 底部统计信息 */}
                <div className='mt-8 pt-6 border-t border-red-400/20'>
                  <div className='flex items-center justify-center gap-6'>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center'>
                        <span className='text-xs'>📊</span>
                      </div>
                      <span className='text-sm text-red-200'>
                        共 {didian_list?.length || 0} 个禁地
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center'>
                        <span className='text-xs'>💀</span>
                      </div>
                      <span className='text-sm text-yellow-200'>
                        最高危险等级：{didian_list?.length || 0}
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
              <span className='text-red-200 text-sm'>⚠️ 禁地深处藏杀机，修仙路上需谨慎 ⚠️</span>
            </div>
          </div>
        </div>
      </div>
    </HTML>
  );
};

export default SecretPlace;
