import React from 'react';
import HTML from './HTML';
import { Avatar } from './Avatar';
import supermarketURL from '@src/resources/img/fairyrealm.jpg';
import userStateURL from '@src/resources/img/user_state2.png';

interface MonthCardProps {
  isMonth: boolean;
  avatar: string;
  isNewbie?: boolean;
}

const features = [
  {
    title: '自定义快捷键',
    icon: '⚡',
    desc: '个性化操作体验'
  },
  {
    title: '支持打工本沉迷',
    icon: '💼',
    desc: '提升修炼效率'
  },
  {
    title: '签到奖励增加',
    icon: '💰',
    desc: '闪闪发光的石头-1，秘境之匙-10'
  },
  {
    title: '周签到奖励',
    icon: '🎁',
    desc: '修为丹-n，仙府通行证，道具盲盒'
  }
];

const Monthcard: React.FC<MonthCardProps> = ({ isMonth, avatar, isNewbie }) => {
  return (
    <HTML
      className='p-0 m-0 w-full text-center'
      dangerouslySetInnerHTML={{
        __html: `
          body {
            background-image: url(${supermarketURL});
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
        `
      }}
    >
      <div className='h-3' />
      <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-gradient-to-br from-white/60 via-blue-50/50 to-cyan-50/55 backdrop-blur-sm border border-blue-200/30 shadow-xl w-[780px] pb-4'>
        <div className='m-4 w-[780px]'>
          {/* 头部区域 */}
          <div className='flex items-center justify-center mb-6'>
            <div className='text-center'>
              <div className='flex justify-center mb-4'>
                <Avatar src={avatar} stateSrc={userStateURL} rootClassName='w-32 h-32' className='w-24 h-24' />
              </div>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg'>
                  <span className='text-white text-sm'>⭐</span>
                </div>
                <h2 className='text-2xl font-bold text-blue-800 drop-shadow-sm'>月卡权益</h2>
              </div>
            </div>
          </div>

          {/* 功能列表 */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-blue-500/10 via-cyan-500/8 to-blue-600/10 backdrop-blur-sm rounded-lg border border-blue-200/30 shadow-lg'>
              <div className='flex items-center gap-3'>
                <div className='w-6 h-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-200/30'>
                  <span className='text-blue-600 text-sm'>🎯</span>
                </div>
                <h3 className='text-xl font-bold text-blue-800 drop-shadow-sm'>专属功能</h3>
              </div>
              {isMonth ? (
                <div className='inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full shadow-lg'>
                  <span className='text-emerald-600 text-sm mr-1'>✅</span>
                  <span className='text-emerald-700 font-semibold text-sm'>已开通</span>
                </div>
              ) : (
                <div className='inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full shadow-lg'>
                  <span className='text-blue-600 text-sm mr-1'>🔒</span>
                  <span className='text-blue-700 font-semibold text-sm'>未开通</span>
                </div>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className='bg-gradient-to-br from-white/80 via-blue-50/70 to-cyan-50/75 backdrop-blur-xl rounded-xl p-4 border border-blue-200/40 shadow-xl relative overflow-hidden hover:shadow-2xl transition-all duration-300'
                >
                  {/* 装饰性光效 */}
                  <div className='absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/8 to-cyan-400/8 rounded-full blur-xl' />
                  <div className='absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-cyan-400/4 to-blue-400/4 rounded-full blur-lg' />

                  <div className='relative z-10 space-y-3'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg'>
                        <span className='text-white text-lg'>{feature.icon}</span>
                      </div>
                      <div className='flex-1'>
                        <h4 className='text-base font-bold text-blue-800 drop-shadow-sm'>{feature.title}</h4>
                        <p className='text-sm text-blue-600 mt-1'>{feature.desc}</p>
                      </div>
                    </div>

                    <div className='relative'>
                      {isMonth ? (
                        <div className='flex items-center justify-between'>
                          <span className='px-3 py-1 rounded-full text-sm font-medium shadow-lg bg-gradient-to-r from-emerald-500/15 to-green-500/15 text-emerald-700 border border-emerald-400/25'>
                            已解锁
                          </span>
                          <div className='flex items-center gap-1'>
                            <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse' />
                            <span className='text-xs text-emerald-600 font-medium'>激活中</span>
                          </div>
                        </div>
                      ) : (
                        <div className='relative'>
                          <div className='flex items-center justify-between'>
                            <div />
                            <div className='flex items-center gap-1'>
                              <div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse' />
                              <span className='text-xs text-blue-600 font-medium'>未激活</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isNewbie ? (
                <div className='bg-gradient-to-br from-white/80 via-blue-50/70 to-cyan-50/75 backdrop-blur-xl rounded-xl p-4 border border-blue-200/40 shadow-xl relative overflow-hidden hover:shadow-2xl transition-all duration-300'>
                  {/* 装饰性光效 */}
                  <div className='absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/8 to-cyan-400/8 rounded-full blur-xl' />
                  <div className='absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-cyan-400/4 to-blue-400/4 rounded-full blur-lg' />

                  <div className='relative z-10 space-y-3'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg'>
                        <span className='text-white text-lg'>💴</span>
                      </div>
                      <div className='flex-1'>
                        <h4 className='text-base font-bold text-blue-800 drop-shadow-sm'>双倍新手福利</h4>
                        <p className='text-sm text-blue-600 mt-1'>新手礼包奖励翻倍</p>
                      </div>
                    </div>

                    <div className='relative'>
                      {isMonth ? (
                        <div className='flex items-center justify-between'>
                          <span className='px-3 py-1 rounded-full text-sm font-medium shadow-lg bg-gradient-to-r from-emerald-500/15 to-green-500/15 text-emerald-700 border border-emerald-400/25'>
                            已解锁
                          </span>
                          <div className='flex items-center gap-1'>
                            <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse' />
                            <span className='text-xs text-emerald-600 font-medium'>激活中</span>
                          </div>
                        </div>
                      ) : (
                        <div className='relative'>
                          <div className='flex items-center justify-between'>
                            <div />
                            <div className='flex items-center gap-1'>
                              <div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse' />
                              <span className='text-xs text-blue-600 font-medium'>未激活</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>

          {/* 底部信息 */}
          <div className='mt-6 text-center'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-600/5 backdrop-blur-sm rounded-full border border-blue-300/30 shadow-lg'>
              <span className='text-blue-600 text-lg'>💎</span>
              <span className='text-blue-800 font-semibold'>月卡特权</span>
              <span className='text-blue-700 text-sm'>·</span>
              <span className='text-blue-700 text-sm'>{isMonth ? '享受专属权益，修炼之路更加顺畅！' : '解锁更多修仙法则！'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className='h-3' />
    </HTML>
  );
};

export default Monthcard;
