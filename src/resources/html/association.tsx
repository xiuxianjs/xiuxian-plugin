import React from 'react';
import playerURL from '@src/resources/img/player.jpg';
import playerFooterURL from '@src/resources/img/player_footer.png';
import HTML from './HTML';
import { Avatar } from './Avatar';
import { getAvatar } from '@src/model/utils/utilsx.js';
import { BackgroundImage } from 'jsxp';

interface AssociationData {
  宗门名称?: string;
  宗门等级?: number | string;
  灵石池?: number | string;
  所有成员?: string[];
  大阵血量?: number | string;
  宗门建设等级?: number | string;
  宗门神兽?: string;
  创立时间?: [string, ...string[]] | string[];
}

interface AssociationProps {
  user_id: string | number;
  ass: AssociationData;
  mainname: string;
  mainqq: string | number;
  weizhi: string;
  state: string;
  xiulian: number | string;
  level: number | string;
  fuzong?: string[];
  zhanglao?: string[];
  neimen?: string[];
  waimen?: string[];
}

const BadgeList = ({ title, items }: { title: string; items?: string[] }) => (
  <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg'>
    <div className='flex items-center gap-2 mb-3'>
      <div className='w-6 h-6 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center'>
        <span className='text-sm'>👥</span>
      </div>
      <h3 className='text-xl font-bold text-gray-900 drop-shadow-sm'>{title}</h3>
    </div>
    <div className='flex flex-wrap gap-2'>
      {items?.length ? (
        items.map((it, i) => (
          <span key={i} className='px-3 py-1.5 rounded-lg bg-white/30 text-sm font-semibold text-gray-900 drop-shadow-sm border border-white/20'>
            {it}
          </span>
        ))
      ) : (
        <span className='text-sm font-medium text-gray-700'>暂无</span>
      )}
    </div>
  </div>
);

const Association: React.FC<AssociationProps> = ({ user_id, ass, mainname, mainqq, weizhi, state, xiulian, level, fuzong, zhanglao, neimen, waimen }) => {
  return (
    <HTML>
      <BackgroundImage
        src={[playerURL, playerFooterURL]}
        style={{
          backgroundRepeat: 'no-repeat, repeat',
          backgroundSize: '100%, auto'
        }}
        className='p-0 m-0 w-full text-center'
      >
        <div className='h-3' />
        <div>
          {/* 顶部区域 - 宗门基本信息 */}
          <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px] pb-4'>
            {/* 左 - 头像和账号 */}
            <div className='text-center mt-5 ml-4 w-80'>
              <div className='flex justify-center'>
                <Avatar src={getAvatar(user_id)} rootClassName='w-64 h-64' className='w-44 h-44' />
              </div>
              {/* 账号卡片 */}
              <div className='mt-3 mx-2 relative'>
                <div className='bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl px-3 py-2 shadow-xl border-2 border-blue-300 backdrop-blur-sm'>
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center'>
                      <span className='text-white text-sm'>👤</span>
                    </div>
                    <div className='text-center'>
                      <div className='text-white text-xs font-semibold opacity-90 drop-shadow-sm'>账号</div>
                      <div className='text-white text-lg font-bold drop-shadow-lg'>{user_id}</div>
                    </div>
                  </div>
                  {/* 装饰性光效 */}
                  <div className='absolute -top-1 -right-1 w-3 h-3 bg-blue-300 rounded-full opacity-60 animate-pulse' />
                  <div className='absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full opacity-40' />
                </div>
              </div>
            </div>
            {/* 右 - 宗门信息 */}
            <div className='float-right text-left mr-4 mt-4 rounded-3xl flex-1 text-slate-600'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                  <span className='text-base'>🏛️</span>
                  <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>宗门：{ass?.宗门名称 || '-'}</span>
                </div>
                <div className='flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                  <span className='text-base'>👑</span>
                  <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>宗主：{mainname}</span>
                </div>
                <div className='flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                  <span className='text-base'>💬</span>
                  <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>QQ：{mainqq}</span>
                </div>
                <div className='flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                  <span className='text-base'>⭐</span>
                  <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>等级：{ass?.宗门等级 ?? '-'}</span>
                </div>
                <div className='flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                  <span className='text-base'>💰</span>
                  <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>灵石池：{ass?.灵石池 ?? 0}</span>
                </div>
                <div className='flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                  <span className='text-base'>📍</span>
                  <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>位置：{weizhi || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 中部区域 - 宗门详细信息 */}
          <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px]'>
            <div className='m-4 w-[780px]'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-6 h-6 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center'>
                  <span className='text-sm'>📊</span>
                </div>
                <h2 className='text-xl font-bold text-gray-900 drop-shadow-sm'>【宗门信息】</h2>
              </div>
              <div className='space-y-3'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                  <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>门派状态</span>
                        <span className='font-bold text-gray-900 text-lg'>{state}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>天赋加强</span>
                        <span className='font-bold text-gray-900 text-lg'>{xiulian}%</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>入宗门槛</span>
                        <span className='font-bold text-gray-900 text-lg'>{level}</span>
                      </div>
                    </div>
                  </div>
                  <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>大阵强度</span>
                        <span className='font-bold text-gray-900 text-lg'>{ass?.大阵血量 ?? 0}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>建设等级</span>
                        <span className='font-bold text-gray-900 text-lg'>{ass?.宗门建设等级 ?? '-'}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>成员数量</span>
                        <span className='font-bold text-gray-900 text-lg'>{ass?.所有成员?.length ?? 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>镇宗神兽</span>
                        <span className='font-bold text-gray-900 text-lg'>{ass?.宗门神兽 ?? '-'}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>创立时间</span>
                        <span className='font-bold text-gray-900 text-lg'>{ass?.创立时间?.[0] || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 成员管理区域 */}
          <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px]'>
            <div className='m-4 w-[780px]'>
              <div className='space-y-3'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <BadgeList title='副宗主' items={fuzong} />
                  <BadgeList title='长老' items={zhanglao} />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <BadgeList title='内门弟子' items={neimen} />
                  <BadgeList title='外门弟子' items={waimen} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='h-3' />
      </BackgroundImage>
    </HTML>
  );
};

export default Association;
