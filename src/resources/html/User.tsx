import React from 'react';
import playerURL from '@src/resources/img/player.jpg';
import playerFooterURL from '@src/resources/img/player_footer.png';
import HTML from './HTML';
import { Avatar } from './Avatar';
import { BackgroundImage } from 'jsxp';

interface PlayerProps {
  avatar: string;
  bg_url: string;
  PowerMini: number | string;
  player?: {
    名号?: string;
    sex?: number;
    当前血量?: number;
    血量上限?: number;
    宣言?: string;
    暴击伤害?: number;
    修为?: number;
    occupation?: string[];
    occupation_exp?: number;
    血气?: number;
    灵根?: {
      type?: string;
      name?: string;
      法球倍率?: number;
    };
    镇妖塔层数?: number;
    神魄段数?: number;
    幸运?: number;
    魔道值?: number;
    仙宠?:
      | {
          品级?: string;
          name?: string;
          等级?: number;
          type?: string;
          atk?: number;
          加成?: number;
          灵魂绑定?: number;
        }[]
      | {
          品级?: string;
          name?: string;
          等级?: number;
          type?: string;
          atk?: number;
          加成?: number;
          灵魂绑定?: number;
        };
  };
  user_id: string | number;
  strand_hp?: { style?: React.CSSProperties };
  lingshi: number | string;
  this_association?: {
    宗门名称?: string;
    职位?: string;
  };
  player_atk: number;
  player_atk2: number;
  player_def: number;
  player_def2: number;
  bao: number;
  攻击加成: number;
  攻击加成_t: number;
  防御加成: number;
  防御加成_t: number;
  生命加成: number;
  生命加成_t: number;
  talent: number;
  occupation: string;
  婚姻状况: string;
  rank_lianqi: string;
  expmax_lianqi: number;
  strand_lianqi?: { style?: React.CSSProperties; num?: number };
  rank_llianti: string;
  expmax_llianti: number;
  strand_llianti?: { style?: React.CSSProperties; num?: number };
  rank_liandan: string;
  expmax_liandan: number;
  strand_liandan?: { style?: React.CSSProperties; num?: number };
  neidan: string | number;
  player_action: string;
}

const Player = ({
  avatar,
  PowerMini,
  bg_url: bgURL,
  player = {},
  user_id,
  strand_hp = {},
  lingshi,
  this_association = {},
  player_atk,
  player_atk2,
  player_def,
  player_def2,
  bao,
  攻击加成,
  攻击加成_t,
  防御加成,
  防御加成_t,
  生命加成,
  生命加成_t,
  talent,
  occupation,
  婚姻状况,
  rank_lianqi,
  expmax_lianqi,
  strand_lianqi = {},
  rank_llianti,
  expmax_llianti,
  strand_llianti = {},
  rank_liandan,
  expmax_liandan,
  strand_liandan = {},
  neidan,
  player_action
}: PlayerProps) => {
  const genders = ['未知', '女', '男', '扶她'];

  const Pets = ({ value }) => {
    return (
      <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg'>
        <div className='space-y-2'>
          <div className='text-center'>
            <h3 className='text-base font-bold text-gray-900 drop-shadow-sm'>
              【{value.品级}】{value.name}
            </h3>
          </div>
          <div className='space-y-1.5 text-sm'>
            <div className='flex items-center justify-between'>
              <span className='font-semibold text-gray-800'>等级</span>
              <span className='font-bold text-gray-900 text-base'>{value.等级}</span>
            </div>
            {value.type === '战斗' ? (
              <div className='flex items-center justify-between'>
                <span className='font-semibold text-gray-800'>三维加成</span>
                <span className='font-bold text-gray-900 text-base'>{value.atk}</span>
              </div>
            ) : (
              <div className='flex items-center justify-between'>
                <span className='font-semibold text-gray-800'>{value.type}加成</span>
                <span className='font-bold text-gray-900 text-base'>{(value.加成 * 100).toFixed(1)}%</span>
              </div>
            )}
            <div className='flex items-center justify-between'>
              <span className='font-semibold text-gray-800'>绑定</span>
              <span className='font-bold text-gray-900 text-base'>{value.灵魂绑定 === 1 ? '有' : '无'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PetsReander = Array.isArray(player.仙宠) ? (
    player.仙宠.map((pet, index) => <Pets key={index} value={pet} />)
  ) : player?.仙宠?.name ? (
    <Pets value={player.仙宠} />
  ) : null;

  const curBGImage = bgURL ? [bgURL] : [playerURL, playerFooterURL];

  return (
    <HTML>
      <BackgroundImage
        className='bg-cover p-0 m-0 w-full text-center'
        src={curBGImage}
        style={{
          backgroundRepeat: 'no-repeat, repeat',
          backgroundSize: '100%, auto'
        }}
      >
        <div className='h-3' />
        <div>
          {/* 上 */}
          <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px] pb-4'>
            {/* 左 */}
            <div className='text-center mt-5 ml-4 w-80'>
              <div className='flex justify-center'>
                <Avatar src={avatar} rootClassName='w-64 h-64' className='w-44 h-44' />
              </div>
              {/* 战力卡片 - 使用Tailwind CSS */}
              <div className='mt-3 mx-2 relative'>
                <div className='bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl px-3 py-2 shadow-xl border-2 border-amber-300 backdrop-blur-sm'>
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center'>
                      <span className='text-white text-sm'>⚔️</span>
                    </div>
                    <div className='text-center'>
                      <div className='text-white text-xs font-semibold opacity-90 drop-shadow-sm'>战力</div>
                      <div className='text-white text-2xl font-bold drop-shadow-lg'>{PowerMini}</div>
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
                {/* 道号 */}
                <div className='flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                  <span className='text-base'>👤</span>
                  <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>道号：{player.名号}</span>
                </div>

                {/* QQ */}
                <div className='flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                  <span className='text-base'>💬</span>
                  <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>账号：{user_id}</span>
                </div>

                {/* 性别 */}
                <div className='flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                  <span className='text-base'>⚧</span>
                  <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>性别：({genders[player.sex || 0]})</span>
                </div>

                {/* 生命值 */}
                <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-base'>❤️</span>
                    <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>生命</span>
                  </div>
                  {/* 血条 - 使用Tailwind CSS */}
                  <div className='relative w-64 text-white h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg overflow-hidden border border-gray-600/50'>
                    {/* 背景装饰 */}
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent' />
                    <div
                      className='h-full bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-lg transition-all duration-300 ease-out shadow-lg relative overflow-hidden'
                      style={strand_hp.style}
                    >
                      {/* 进度条内部装饰 */}
                      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent' />
                      <div className='absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent' />
                      <div className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-black/20 to-transparent' />
                    </div>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <span className='font-bold text-sm drop-shadow-lg'>
                        {player.当前血量?.toFixed(0)}/{player.血量上限?.toFixed(0)}
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
                    宗门：【{this_association.宗门名称}】{this_association.宗门名称 !== '无' && `[${this_association.职位}]`}
                  </span>
                </div>

                {/* 道宣 */}
                <div className='flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                  <span className='text-base'>📜</span>
                  <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>道宣：{player.宣言}</span>
                </div>
              </div>
            </div>
          </div>
          {/* 下 */}
          <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px]'>
            <div className='m-4 w-[780px]'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-6 h-6 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center'>
                  <span className='text-sm'>👤</span>
                </div>
                <h2 className='text-xl font-bold text-gray-900 drop-shadow-sm'>【基础信息】</h2>
              </div>
              <div className='space-y-3'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                  <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>攻击</span>
                        <span className='font-bold text-gray-900 text-lg'>
                          {player_atk}
                          <sup className='text-sm text-gray-700 ml-1'>{player_atk2}</sup>
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>防御</span>
                        <span className='font-bold text-gray-900 text-lg'>
                          {player_def}
                          <sup className='text-sm text-gray-700 ml-1'>{player_def2}</sup>
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>暴击</span>
                        <span className='font-bold text-gray-900 text-lg'>{bao}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>暴伤</span>
                        <span className='font-bold text-gray-900 text-lg'>{((player.暴击伤害 || 0) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>攻击加成</span>
                        <span className='font-bold text-gray-900 text-lg'>
                          {攻击加成}
                          <sup className='text-sm text-gray-700 ml-1'>{攻击加成_t}</sup>
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>防御加成</span>
                        <span className='font-bold text-gray-900 text-lg'>
                          {防御加成}
                          <sup className='text-sm text-gray-700 ml-1'>{防御加成_t}</sup>
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>生命加成</span>
                        <span className='font-bold text-gray-900 text-lg'>
                          {生命加成}
                          <sup className='text-sm text-gray-700 ml-1'>{生命加成_t}</sup>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>修炼加成</span>
                        <span className='font-bold text-gray-900 text-lg'>{talent}%</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>职业</span>
                        <span className='font-bold text-gray-900 text-lg'>[{occupation}]</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-base font-semibold text-gray-800'>道侣</span>
                        <span className='font-bold text-gray-900 text-lg'>[{婚姻状况}]</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='space-y-3 mt-4'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                  <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg relative overflow-hidden'>
                    {/* 装饰性光效 */}
                    <div className='absolute top-0 right-0 w-12 h-12 bg-blue-400/10 rounded-full blur-lg' />
                    <div className='absolute bottom-0 left-0 w-8 h-8 bg-blue-400/5 rounded-full blur-md' />
                    <div className='space-y-2 relative z-10'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-semibold text-gray-800 flex items-center gap-1.5'>
                          <span className='w-3 h-3 bg-blue-500/20 rounded-full flex items-center justify-center'>
                            <span className='text-blue-500 text-xs'>⚡</span>
                          </span>
                          <span className='text-base font-bold text-gray-900'>{rank_lianqi}</span>
                          {player.修为 >= expmax_lianqi && <span className='text-green-600 text-sm font-bold'>[UP]</span>}
                        </span>
                      </div>
                      {/* 练气进度条 - 使用Tailwind CSS */}
                      <div className='relative w-full h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg overflow-hidden border border-gray-600/50 shadow-inner'>
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent' />
                        <div
                          className='h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-lg transition-all duration-300 ease-out shadow-lg relative overflow-hidden'
                          style={strand_lianqi.style}
                        >
                          {/* 进度条内部装饰 */}
                          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent' />
                          <div className='absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent' />
                          <div className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-black/20 to-transparent' />
                        </div>
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <span className='text-white font-bold text-base drop-shadow-lg'>{strand_lianqi.num}%</span>
                        </div>
                      </div>
                      <div className='text-center text-base font-semibold text-gray-800'>
                        {player.修为}/{expmax_lianqi}
                      </div>
                    </div>
                  </div>
                  <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg relative overflow-hidden'>
                    {/* 装饰性光效 */}
                    <div className='absolute top-0 right-0 w-12 h-12 bg-green-400/10 rounded-full blur-lg' />
                    <div className='absolute bottom-0 left-0 w-8 h-8 bg-green-400/5 rounded-full blur-md' />
                    <div className='space-y-2 relative z-10'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-semibold text-gray-800 flex items-center gap-1.5'>
                          <span className='w-3 h-3 bg-green-500/20 rounded-full flex items-center justify-center'>
                            <span className='text-green-500 text-xs'>💪</span>
                          </span>
                          <span className='text-base font-bold text-gray-900'>{rank_llianti}</span>
                          {player.血气 >= expmax_llianti && <span className='text-green-600 text-sm font-bold'>[UP]</span>}
                        </span>
                      </div>
                      {/* 炼体进度条 - 使用Tailwind CSS */}
                      <div className='relative w-full h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg overflow-hidden border border-gray-600/50 shadow-inner'>
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent' />
                        <div
                          className='h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-lg transition-all duration-300 ease-out shadow-lg relative overflow-hidden'
                          style={strand_llianti.style}
                        >
                          {/* 进度条内部装饰 */}
                          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent' />
                          <div className='absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent' />
                          <div className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-black/20 to-transparent' />
                        </div>
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <span className='text-white font-bold text-base drop-shadow-lg'>{strand_llianti.num}%</span>
                        </div>
                      </div>
                      <div className='text-center text-base font-semibold text-gray-800'>
                        {player.血气}/{expmax_llianti}
                      </div>
                    </div>
                  </div>
                  {player?.occupation.length === 0 ? (
                    <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg'>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-semibold text-gray-800'>职业</span>
                          <span className='font-bold text-gray-900 text-base'>无业游民</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg relative overflow-hidden'>
                      {/* 装饰性光效 */}
                      <div className='absolute top-0 right-0 w-12 h-12 bg-purple-400/10 rounded-full blur-lg' />
                      <div className='absolute bottom-0 left-0 w-8 h-8 bg-purple-400/5 rounded-full blur-md' />
                      <div className='space-y-2 relative z-10'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-semibold text-gray-800 flex items-center gap-1.5'>
                            <span className='w-3 h-3 bg-purple-500/20 rounded-full flex items-center justify-center'>
                              <span className='text-purple-500 text-xs'>🧪</span>
                            </span>
                            <span className='text-base font-bold text-gray-900'>{rank_liandan}</span>
                            {player?.occupation_exp >= expmax_liandan && <span className='text-green-600 text-sm font-bold'>[UP]</span>}
                          </span>
                        </div>
                        {/* 炼丹进度条 - 使用Tailwind CSS */}
                        <div className='relative w-full h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg overflow-hidden border border-gray-600/50 shadow-inner'>
                          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent' />
                          <div
                            className='h-full bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 rounded-lg transition-all duration-300 ease-out shadow-lg relative overflow-hidden'
                            style={strand_liandan.style}
                          >
                            {/* 进度条内部装饰 */}
                            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent' />
                            <div className='absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent' />
                            <div className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-black/20 to-transparent' />
                          </div>
                          <div className='absolute inset-0 flex items-center justify-center'>
                            <span className='text-white font-bold text-base drop-shadow-lg'>{strand_liandan.num}%</span>
                          </div>
                        </div>
                        <div className='text-center text-base font-semibold text-gray-800'>
                          {player.occupation_exp}/{expmax_liandan}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className='space-y-3 mt-4'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                  {/* 第一块：灵根信息 */}
                  <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg'>
                    <div className='space-y-2 text-sm'>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>灵根</span>
                        <span className='font-bold text-gray-900 text-base'>【{player.灵根?.type}】</span>
                      </div>
                      {player.灵根?.type !== '无' && (
                        <>
                          <div className='text-center text-gray-800 text-sm font-medium'>{player.灵根?.name}</div>
                          <div className='text-center text-gray-800 text-sm font-medium'>
                            被动：【额外增伤】攻击+
                            {(player.灵根?.法球倍率 * 100).toFixed(1)}%
                          </div>
                        </>
                      )}
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>镇妖</span>
                        <span className='font-bold text-gray-900 text-base'>【{player.镇妖塔层数}层】</span>
                      </div>
                    </div>
                  </div>

                  {/* 第二块：神魂和幸运 */}
                  <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg'>
                    <div className='space-y-2 text-sm'>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>神魂</span>
                        <span className='font-bold text-gray-900 text-base'>【{player.神魄段数}层】</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>幸运</span>
                        <span className='font-bold text-gray-900 text-base'>【{((player.幸运 || 0) * 100).toFixed(1)}%】</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>魔道值</span>
                        <span className='font-bold text-gray-900 text-base'>【{player.魔道值}】</span>
                      </div>
                    </div>
                  </div>

                  {/* 第三块：内丹和状态 */}
                  <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg'>
                    <div className='space-y-2 text-sm'>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>内丹</span>
                        <span className='font-bold text-gray-900 text-base'>【{neidan}】</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>状态</span>
                        <span className='font-bold text-gray-900 text-base'>【{player_action}】</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 仙宠 */}
          <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px]'>
            <div className='m-4 w-[780px]'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-6 h-6 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center'>
                  <span className='text-sm'>🐈‍⬛</span>
                </div>
                <h2 className='text-xl font-bold text-gray-900 drop-shadow-sm'>仙宠</h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>{PetsReander}</div>
            </div>
          </div>
        </div>
        <div className='h-3' />
      </BackgroundImage>
    </HTML>
  );
};

export default Player;
