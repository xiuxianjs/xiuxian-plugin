import React from 'react';
import HTML from './HTML';
import { Avatar } from './Avatar';
import { getAvatar } from '@src/model/utils/utilsx.js';
import playerURL from '@src/resources/img/player.jpg';
import playerFooterURL from '@src/resources/img/player_footer.png';
import { DataList } from '@src/model';
import { BackgroundImage } from 'jsxp';
import classNames from 'classnames';

type Props = {
  user_id: string;
  nickname: string;
  player_nowHP: number;
  player_maxHP: number;
  levelId: number;
  levelMax: number;
  xueqi: number;
  need_xueqi: number;
  lingshi: number;
  physiqueId: number;
  association: {
    宗门名称?: string;
    职位?: string;
  };
  gongfa: DataList['Gongfa'];
};

// 功法效率颜色配置
const GONGFA_COLORS = {
  // 蓝色 - 低效率 (0.03-0.06)
  blue: {
    from: 'from-blue-400/90',
    via: 'via-blue-300/90',
    to: 'to-blue-500/90',
    border: 'border-blue-300/60',
    text: 'text-blue-900',
    bg: 'bg-blue-500/20',
    icon: 'text-blue-500'
  },
  // 紫色 - 中低效率 (0.07-0.15)
  purple: {
    from: 'from-purple-400/90',
    via: 'via-purple-300/90',
    to: 'to-purple-500/90',
    border: 'border-purple-300/60',
    text: 'text-purple-900',
    bg: 'bg-purple-500/20',
    icon: 'text-purple-500'
  },
  // 红色 - 中效率 (0.16-0.25)
  red: {
    from: 'from-red-400/90',
    via: 'via-red-300/90',
    to: 'to-red-500/90',
    border: 'border-red-300/60',
    text: 'text-red-900',
    bg: 'bg-red-500/20',
    icon: 'text-red-500'
  },
  // 橙色 - 中高效率 (0.26-0.50)
  orange: {
    from: 'from-orange-400/90',
    via: 'via-orange-300/90',
    to: 'to-orange-500/90',
    border: 'border-orange-300/60',
    text: 'text-orange-900',
    bg: 'bg-orange-500/20',
    icon: 'text-orange-500'
  },
  // 金色 - 高效率 (0.51+)
  gold: {
    from: 'from-yellow-400/90',
    via: 'via-yellow-300/90',
    to: 'to-yellow-500/90',
    border: 'border-yellow-300/60',
    text: 'text-yellow-900',
    bg: 'bg-yellow-500/20',
    icon: 'text-yellow-500'
  }
};

// 根据修炼加成获取颜色配置
const getGongfaColor = (efficiency: number) => {
  if (efficiency >= 0.51) {
    return GONGFA_COLORS.gold;
  }
  if (efficiency >= 0.26) {
    return GONGFA_COLORS.orange;
  }
  if (efficiency >= 0.16) {
    return GONGFA_COLORS.red;
  }
  if (efficiency >= 0.07) {
    return GONGFA_COLORS.purple;
  }

  return GONGFA_COLORS.blue;
};

const UserBody = ({ user_id, nickname, player_nowHP, player_maxHP, levelId, levelMax, xueqi, need_xueqi, physiqueId, lingshi, association, gongfa }: Props) => {
  return (
    <HTML>
      <BackgroundImage
        className='bg-cover p-0 m-0 w-full text-center'
        src={[playerURL, playerFooterURL]}
        style={{
          backgroundRepeat: 'no-repeat, repeat',
          backgroundSize: '100%, auto'
        }}
      >
        <div className='h-3' />
        <div>
          {/* 主容器 */}
          <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px] pb-4'>
            {/* 左 */}
            <div className='text-center mt-5 ml-4 w-80'>
              <div className='flex justify-center'>
                <Avatar src={getAvatar(user_id)} rootClassName='w-64 h-64' className='w-44 h-44' />
              </div>
              {/* 道号卡片 */}
              <div className='mt-3 mx-2 relative'>
                <div className='bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl px-3 py-2 shadow-xl border-2 border-amber-300 backdrop-blur-sm'>
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center'>
                      <span className='text-white text-sm'>🏮</span>
                    </div>
                    <div className='text-center'>
                      <div className='text-white text-xs font-semibold opacity-90 drop-shadow-sm'>道号</div>
                      <div className='text-white text-lg font-bold drop-shadow-lg'>{nickname}</div>
                    </div>
                  </div>
                  {/* 装饰性光效 */}
                  <div className='absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full opacity-60 animate-pulse' />
                  <div className='absolute -bottom-1 -left-1 w-2 h-2 bg-orange-300 rounded-full opacity-40' />
                </div>
              </div>
            </div>
            {/* 右 */}
            <div className='float-right text-left mr-4 mt-4 rounded-3xl flex-1 text-slate-600'>
              <div className='space-y-2'>
                {/* QQ */}
                <div className='flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                  <span className='text-base'>💬</span>
                  <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>账号：{user_id}</span>
                </div>

                {/* 体境 */}
                <div className='flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                  <span className='text-base'>⚔️</span>
                  <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>体境：{levelMax}</span>
                </div>

                {/* 生命值 */}
                <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-base'>❤️</span>
                    <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>生命</span>
                  </div>
                  {/* 血条 */}
                  <div className='relative w-64 text-white h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg overflow-hidden border border-gray-600/50'>
                    {/* 背景装饰 */}
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent' />
                    <div
                      className='h-full bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-lg transition-all duration-300 ease-out shadow-lg relative overflow-hidden'
                      style={{ width: `${(player_nowHP / player_maxHP) * 100}%` }}
                    >
                      {/* 进度条内部装饰 */}
                      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent' />
                      <div className='absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent' />
                      <div className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-black/20 to-transparent' />
                    </div>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <span className='font-bold text-sm drop-shadow-lg'>
                        {player_nowHP?.toFixed(0)}/{player_maxHP?.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 灵石 */}
                <div className='flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                  <span className='text-base'>💰</span>
                  <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>灵石：{lingshi}</span>
                </div>

                {/* 宗门 */}
                <div className='flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                  <span className='text-base'>🏛️</span>
                  <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>
                    宗门：【{association?.宗门名称 || '无'}】{association?.宗门名称 !== '无' && `[${association?.职位}]`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 下 */}
          <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px]'>
            <div className='m-4 w-[780px]'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-6 h-6 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center'>
                  <span className='text-sm'>📊</span>
                </div>
                <h2 className='text-xl font-bold text-gray-900 drop-shadow-sm'>【基础信息】</h2>
              </div>
              <div className='space-y-3'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {/* 气血信息 */}
                  <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg relative overflow-hidden'>
                    {/* 装饰性光效 */}
                    <div className='absolute top-0 right-0 w-12 h-12 bg-blue-400/10 rounded-full blur-lg' />
                    <div className='absolute bottom-0 left-0 w-8 h-8 bg-blue-400/5 rounded-full blur-md' />
                    <div className='space-y-2 relative z-10'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-semibold text-gray-800 flex items-center gap-1.5'>
                          <span className='w-3 h-3 bg-blue-500/20 rounded-full flex items-center justify-center'>
                            <span className='text-blue-500 text-xs'>💙</span>
                          </span>
                          <span className='text-base font-bold text-gray-900'>气血</span>
                        </span>
                      </div>
                      {/* 气血进度条 */}
                      <div className='relative w-full h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg overflow-hidden border border-gray-600/50 shadow-inner'>
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent' />
                        <div
                          className='h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-lg transition-all duration-300 ease-out shadow-lg relative overflow-hidden'
                          style={{ width: `${(xueqi / need_xueqi) * 100}%` }}
                        >
                          {/* 进度条内部装饰 */}
                          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent' />
                          <div className='absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent' />
                          <div className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-black/20 to-transparent' />
                        </div>
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <span className='text-white font-bold text-base drop-shadow-lg'>{((xueqi / need_xueqi) * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className='text-center text-base font-semibold text-gray-800'>
                        {xueqi}/{need_xueqi}
                      </div>
                    </div>
                  </div>

                  {/* 等级信息 */}
                  <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>当前等级</span>
                        <span className='font-bold text-gray-900 text-lg'>{levelId}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>等级上限</span>
                        <span className='font-bold text-gray-900 text-lg'>{levelMax}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 功法区域 */}
          <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px]'>
            <div className='m-4 w-[780px]'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-6 h-6 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center'>
                  <span className='text-sm'>📚</span>
                </div>
                <h2 className='text-xl font-bold text-gray-900 drop-shadow-sm'>
                  已学功法 ({gongfa?.length ?? 0}/{levelId + physiqueId})
                </h2>
              </div>
              <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg'>
                {!gongfa || gongfa.length === 0 ? (
                  <div className='flex items-center justify-center gap-3 py-6'>
                    <span className='text-xl'>📖</span>
                    <span className='text-lg font-bold text-gray-700 tracking-wide opacity-70'>暂无功法</span>
                    <span className='text-xl'>📖</span>
                  </div>
                ) : (
                  <div className='grid grid-cols-3 gap-3'>
                    {gongfa.map((gongfaInfo, index) => {
                      const efficiency = gongfaInfo?.修炼加成 || 0;
                      const colorConfig = getGongfaColor(efficiency);

                      return (
                        <div
                          key={index}
                          className={classNames(
                            'rounded-lg shadow-lg font-bold border text-sm tracking-wide relative overflow-hidden p-2 hover:scale-105 transition-transform duration-200',
                            colorConfig.bg,
                            colorConfig.text,
                            colorConfig.border
                          )}
                        >
                          <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent' />
                          <div className='relative z-10'>
                            <div className='flex items-center justify-between mb-1'>
                              <span className='font-bold truncate'>《{gongfaInfo.name}》</span>
                              <span className={`text-xs ${colorConfig.icon} font-bold ml-1`}>{(efficiency * 100).toFixed(0)}%</span>
                            </div>
                            {gongfaInfo && (
                              <div className='text-xs opacity-80'>
                                <div className='truncate'>类型：{gongfaInfo.type}</div>
                                <div>加成：+{(efficiency * 100).toFixed(1)}%</div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='h-3' />
      </BackgroundImage>
    </HTML>
  );
};

export default UserBody;
