import React from 'react';
import HTML from './HTML';
import supermarketURL from '@src/resources/img/fairyrealm.jpg';
import { ForumItem } from '@src/types/forum';
import { BackgroundImage } from 'jsxp';

const Forum = ({ Forum: forumData }: { Forum?: ForumItem[] }) => {
  return (
    <HTML>
      <BackgroundImage src={supermarketURL} className=' w-full text-center p-4 md:p-8 bg-top bg-cover min-h-screen relative overflow-hidden'>
        {/* 星空粒子层 */}
        <div
          className='absolute inset-0 pointer-events-none
        bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)]
        bg-[length:18px_18px]'
        />

        {/* 轻微渐变遮罩提升对比度 */}
        <div className='absolute inset-0 bg-gradient-to-b from-blue-900/30 via-blue-800/15 to-transparent' />

        <main className='relative z-10 max-w-6xl mx-auto space-y-12'>
          {/* 标题 */}
          <header className='flex justify-center'>
            <div className='flex flex-col md:flex-row items-center gap-6'>
              {/* 聚宝堂标题 */}
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-3xl blur-xl' />
                <h1
                  className='relative inline-block px-8 py-3 rounded-2xl
                bg-gradient-to-r from-blue-500/20 to-cyan-500/20
                backdrop-blur-sm border border-blue-300/30
                text-3xl md:text-4xl font-bold tracking-wide shadow-lg'
                >
                  <span className='text-white'>聚宝堂</span>
                </h1>
              </div>

              {/* 指令说明 */}
              <div className=' flex gap-2'>
                <div className='relative px-6 py-3 rounded-2xl bg-gradient-to-r from-white/35 via-blue-50/25 to-cyan-50/30 backdrop-blur-md border border-blue-200/30 space-y-2 drop-shadow'>
                  <div className='flex items-center justify-center space-x-2'>
                    <span className='text-blue-700'>📜</span>
                    <span className='text-blue-900 font-medium'>发布指令：#发布+物品名*价格*数量</span>
                  </div>
                  <div className='flex items-center justify-center space-x-2'>
                    <span className='text-blue-700'>🤝</span>
                    <span className='text-blue-900 font-medium'>接取指令：#接取+ID*数量</span>
                  </div>
                  <div className='flex items-center justify-center space-x-2'>
                    <span className='text-blue-700'>❌</span>
                    <span className='text-blue-900 font-medium'>取消指令：#取消+ID</span>
                  </div>
                </div>
                <div className='relative px-6 py-3 rounded-2xl bg-gradient-to-r from-white/35 via-blue-50/25 to-cyan-50/30 backdrop-blur-md border border-blue-200/30 space-y-2 drop-shadow'>
                  <div className='flex items-center justify-center space-x-2'>
                    <span className='text-blue-700'>📜</span>
                    <span className='text-blue-900 font-medium'>发布条件：最低10w灵石</span>
                  </div>
                  <div className='flex items-center justify-center space-x-2'>
                    <span className='text-blue-700'>🤝</span>
                    <span className='text-blue-900 font-medium'>需交付：低于100w按3%收取，每超100w增收3%，最高可达15%</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* 卡片区 */}
          <section className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-sky-600/5 to-cyan-600/5 rounded-3xl blur-2xl' />
            <div className='relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
              {forumData?.length ? (
                forumData.map((item, index) => (
                  <article
                    key={index}
                    className='relative rounded-2xl p-6 flex flex-col gap-3
                    bg-gradient-to-br from-white/40 via-blue-50/30 to-cyan-50/35 backdrop-blur-xl border border-blue-200/40
                    shadow-xl overflow-hidden'
                  >
                    {/* 顶部光带 */}
                    <div
                      className='absolute top-0 left-0 w-full h-1
                    bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 shadow-md'
                    />

                    {/* 右上角装饰 */}
                    <div className='absolute top-3 right-3 w-3 h-3 bg-blue-400/50 rounded-full' />

                    <div className='space-y-3'>
                      <div className='flex items-center space-x-2'>
                        <span className='text-blue-600 text-lg'>🏪</span>
                        <h2 className='text-lg font-bold tracking-wide text-blue-800 drop-shadow'>
                          【{item.class}】{item.name}
                        </h2>
                      </div>

                      <div className='space-y-2'>
                        <div className='flex items-center space-x-2'>
                          <span className='text-blue-700'>🆔</span>
                          <span className='text-blue-900 font-medium'>编号：</span>
                          <span className='font-semibold text-blue-900'>{item.id || `No.${index + 1}`}</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='text-amber-700'>💰</span>
                          <span className='text-blue-900 font-medium'>单价：</span>
                          <span className='font-semibold text-amber-800'>{item.price}</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='text-emerald-700'>📦</span>
                          <span className='text-blue-900 font-medium'>数量：</span>
                          <span className='font-semibold text-emerald-800'>{item.aconut}</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='text-orange-700'>🪙</span>
                          <span className='text-blue-900 font-medium'>总价：</span>
                          <span className='font-semibold text-orange-800'>{item.whole}</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='text-cyan-700'>✉</span>
                          <span className='text-blue-900 font-medium'>账号：</span>
                          <span className='font-semibold text-cyan-800'>{item.qq}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className='col-span-full relative'>
                  <div className='absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-2xl blur-xl' />
                  <div
                    className='relative px-8 py-6 rounded-2xl
                  border border-blue-200/40 bg-gradient-to-r from-white/35 via-blue-50/25 to-cyan-50/30
                  text-blue-800 backdrop-blur-xl'
                  >
                    <div className='flex items-center justify-center space-x-3'>
                      <span className='text-blue-700 text-xl'>📭</span>
                      <span className='text-lg font-semibold text-blue-900'>暂无发布</span>
                      <span className='text-blue-700 text-xl'>📭</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 底部装饰 */}
          <div className='flex justify-center space-x-4 pt-8'>
            <div className='w-16 h-1 bg-gradient-to-r from-blue-400/50 to-transparent rounded-full' />
            <div className='w-8 h-8 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full flex items-center justify-center'>
              <span className='text-white/70'>💎</span>
            </div>
            <div className='w-16 h-1 bg-gradient-to-l from-cyan-400/50 to-transparent rounded-full' />
          </div>
        </main>
      </BackgroundImage>
    </HTML>
  );
};

export default Forum;
