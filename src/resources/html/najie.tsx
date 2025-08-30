import React from 'react';
import playerURL from '@src/resources/img/player.jpg';
import playerFooterURL from '@src/resources/img/player_footer.png';
import HTML from './HTML';
import { Avatar } from './Avatar';
import { getAvatar } from '@src/model/utils/utilsx.js';

type NajieProps = {
  user_id: string | number;
  player?: {
    名号?: string;
    当前血量?: number;
    血量上限?: number;
  };
  strand_hp?: {
    style?: React.CSSProperties;
  };
  najie?: {
    等级?: number;
    灵石?: number;
    灵石上限?: number;
    道具?: Array<{
      type: string;
      name: string;
      desc: string;
      数量: number;
      出售价: number;
    }>;
    装备?: Array<{
      type: string;
      name: string;
      pinji: number;
      islockd: number;
      atk: number;
      def: number;
      HP: number;
      bao: number;
      数量: number;
      出售价: number;
    }>;
    丹药?: Array<{
      name: string;
      islockd: number;
      HPp?: number;
      exp?: number;
      xingyun?: number;
      数量: number;
      出售价: number;
    }>;
    草药?: Array<{
      name: string;
      islockd: number;
      type: string;
      desc: string;
      数量: number;
      出售价: number;
    }>;
    材料?: Array<{
      name: string;
      islockd: number;
      type: string;
      desc: string;
      数量: number;
      出售价: number;
    }>;
    仙宠?: Array<{
      name: string;
      islockd: number;
      type: string;
      desc: string;
      数量: number;
      出售价: number;
      品级: string;
    }>;
    仙宠口粮?: Array<{
      name: string;
      islockd: number;
      数量: number;
      出售价: number;
    }>;
  };
  strand_lingshi?: {
    style?: React.CSSProperties;
  };
};

const Najie = ({ user_id, player = {}, strand_hp = {}, najie = {}, strand_lingshi = {} }: NajieProps) => {
  const qualities = ['劣', '普', '优', '精', '极', '绝', '顶'];
  const lockStatus = ['未锁定', '已锁定'];
  const elements = ['金', '木', '土', '水', '火'];

  const renderEquipmentStats = item => {
    const isAbsolute = item.atk > 10 || item.def > 10 || item.HP > 10;

    return {
      attribute: isAbsolute ? '无' : elements[item.id - 1],
      atk: isAbsolute ? item.atk.toFixed(0) : (item.atk * 100).toFixed(0) + '%',
      def: isAbsolute ? item.def.toFixed(0) : (item.def * 100).toFixed(0) + '%',
      HP: isAbsolute ? item.HP.toFixed(0) : (item.HP * 100).toFixed(0) + '%'
    };
  };

  const ItemCard = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg'>
      <div className='flex items-center gap-2 mb-3'>
        <div className='w-6 h-6 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center'>
          <span className='text-sm'>{icon}</span>
        </div>
        <h3 className='text-base font-bold text-gray-900 drop-shadow-sm'>{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <HTML
      className='p-0 m-0 w-full text-center'
      dangerouslySetInnerHTML={{
        __html: `
          body {
            background-image: url(${playerURL}), url(${playerFooterURL});
            background-repeat: no-repeat, repeat;
            background-size: 100%, auto;
          }
        `
      }}
    >
      <div className='h-3' />
      <div>
        {/* 顶部区域 - 玩家基本信息 */}
        <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px] pb-4'>
          {/* 左 - 头像和账号 */}
          <div className='text-center mt-5 ml-4 w-80'>
            <div className='flex justify-center'>
              <Avatar src={getAvatar(user_id)} rootClassName='w-64 h-64' className='w-44 h-44' />
            </div>
            {/* 账号卡片 */}
            <div className='mt-3 mx-2 relative'>
              <div className='bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl px-3 py-2 shadow-xl border-2 border-purple-300 backdrop-blur-sm'>
                <div className='flex items-center gap-2'>
                  <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center'>
                    <span className='text-white text-sm'>💎</span>
                  </div>
                  <div className='text-center'>
                    <div className='text-white text-xs font-semibold opacity-90 drop-shadow-sm'>纳戒</div>
                    <div className='text-white text-lg font-bold drop-shadow-lg'>Lv.{najie.等级 || 0}</div>
                  </div>
                </div>
                {/* 装饰性光效 */}
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-purple-300 rounded-full opacity-60 animate-pulse' />
                <div className='absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full opacity-40' />
              </div>
            </div>
          </div>
          {/* 右 - 玩家信息 */}
          <div className='float-right text-left mr-4 mt-4 rounded-3xl flex-1 text-slate-600'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                <span className='text-base'>👤</span>
                <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>道号：{player.名号 || '无名'}</span>
              </div>
              <div className='flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                <span className='text-base'>💬</span>
                <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>账号：{user_id}</span>
              </div>
              {/* 生命值 */}
              <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-base'>❤️</span>
                  <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>生命</span>
                </div>
                {/* 血条 */}
                <div className='relative w-64 text-white h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg overflow-hidden border border-gray-600/50'>
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent' />
                  <div
                    className='h-full bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-lg transition-all duration-300 ease-out shadow-lg relative overflow-hidden'
                    style={strand_hp.style}
                  >
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent' />
                    <div className='absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent' />
                    <div className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-black/20 to-transparent' />
                  </div>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <span className='font-bold text-sm drop-shadow-lg'>
                      {player.当前血量 || 0}/{player.血量上限 || 0}
                    </span>
                  </div>
                </div>
              </div>
              {/* 灵石储量 */}
              <div className='bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-base'>💰</span>
                  <span className='text-base font-semibold text-gray-900 drop-shadow-sm'>灵石储量</span>
                </div>
                {/* 灵石条 */}
                <div className='relative w-64 text-white h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg overflow-hidden border border-gray-600/50'>
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent' />
                  <div
                    className='h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-lg transition-all duration-300 ease-out shadow-lg relative overflow-hidden'
                    style={strand_lingshi.style}
                  >
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent' />
                    <div className='absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent' />
                    <div className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-black/20 to-transparent' />
                  </div>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <span className='font-bold text-sm drop-shadow-lg'>
                      {najie.灵石 || 0}/{najie.灵石上限 || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 道具区域 */}
        {najie.道具 && najie.道具.length > 0 && (
          <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px]'>
            <div className='m-4 w-[780px]'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-6 h-6 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center'>
                  <span className='text-sm'>🎒</span>
                </div>
                <h2 className='text-xl font-bold text-gray-900 drop-shadow-sm'>【道具】</h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {najie.道具.map((item, index) => (
                  <ItemCard key={index} title={`【${item.type}】${item.name}`} icon='📦'>
                    <div className='space-y-1.5 text-sm'>
                      <div className='text-gray-700 '>{item.desc}</div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>数量</span>
                        <span className='font-bold text-gray-900 text-base'>{item.数量}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>出售价</span>
                        <span className='font-bold text-gray-900 text-base'>{item.出售价}灵石</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>代号</span>
                        <span className='font-bold text-gray-900 text-base'>{index + 101}</span>
                      </div>
                    </div>
                  </ItemCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 装备区域 */}
        {najie.装备 && najie.装备.length > 0 && (
          <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px]'>
            <div className='m-4 w-[780px]'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-6 h-6 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center'>
                  <span className='text-sm'>⚔️</span>
                </div>
                <h2 className='text-xl font-bold text-gray-900 drop-shadow-sm'>【装备】</h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {najie.装备.map((item, index) => {
                  const stats = renderEquipmentStats(item);

                  return (
                    <ItemCard key={index} title={`【${item.type}】${item.name}(${qualities[item.pinji]})(${lockStatus[item.islockd]})`} icon='🗡️'>
                      <div className='space-y-1.5 text-sm'>
                        <div className='grid grid-cols-2 gap-2'>
                          <div className='flex items-center justify-between'>
                            <span className='font-semibold text-gray-800'>属性</span>
                            <span className='font-bold text-gray-900 text-base'>{stats.attribute}</span>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='font-semibold text-gray-800'>攻击</span>
                            <span className='font-bold text-gray-900 text-base'>{stats.atk}</span>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='font-semibold text-gray-800'>防御</span>
                            <span className='font-bold text-gray-900 text-base'>{stats.def}</span>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='font-semibold text-gray-800'>血量</span>
                            <span className='font-bold text-gray-900 text-base'>{stats.HP}</span>
                          </div>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='font-semibold text-gray-800'>暴击</span>
                          <span className='font-bold text-gray-900 text-base'>{(item.bao * 100).toFixed(0)}%</span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='font-semibold text-gray-800'>数量</span>
                          <span className='font-bold text-gray-900 text-base'>{item.数量}</span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='font-semibold text-gray-800'>出售价</span>
                          <span className='font-bold text-gray-900 text-base'>{item.出售价}灵石</span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='font-semibold text-gray-800'>代号</span>
                          <span className='font-bold text-gray-900 text-base'>{index + 101}</span>
                        </div>
                      </div>
                    </ItemCard>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 丹药区域 */}
        {najie.丹药 && najie.丹药.length > 0 && (
          <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px]'>
            <div className='m-4 w-[780px]'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-6 h-6 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center'>
                  <span className='text-sm'>🧪</span>
                </div>
                <h2 className='text-xl font-bold text-gray-900 drop-shadow-sm'>【丹药】</h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {najie.丹药.map((item, index) => (
                  <ItemCard key={index} title={`${item.name}(${lockStatus[item.islockd]})`} icon='💊'>
                    <div className='space-y-1.5 text-sm'>
                      {item.HPp > 0 && (
                        <div className='flex items-center justify-between'>
                          <span className='font-semibold text-gray-800'>恢复百分比</span>
                          <span className='font-bold text-gray-900 text-base'>{item.HPp * 100}%</span>
                        </div>
                      )}
                      {item.exp > 0 && (
                        <div className='flex items-center justify-between'>
                          <span className='font-semibold text-gray-800'>增加修为</span>
                          <span className='font-bold text-gray-900 text-base'>{item.exp}</span>
                        </div>
                      )}
                      {item.xingyun > 0 && (
                        <div className='flex items-center justify-between'>
                          <span className='font-semibold text-gray-800'>幸运值</span>
                          <span className='font-bold text-gray-900 text-base'>{(item.xingyun * 100).toFixed(1)}%</span>
                        </div>
                      )}
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>数量</span>
                        <span className='font-bold text-gray-900 text-base'>{item.数量}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>出售价</span>
                        <span className='font-bold text-gray-900 text-base'>{item.出售价}灵石</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>代号</span>
                        <span className='font-bold text-gray-900 text-base'>{index + 201}</span>
                      </div>
                    </div>
                  </ItemCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 草药区域 */}
        {najie.草药?.length > 0 && (
          <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px]'>
            <div className='m-4 w-[780px]'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-6 h-6 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center'>
                  <span className='text-sm'>🌿</span>
                </div>
                <h2 className='text-xl font-bold text-gray-900 drop-shadow-sm'>【草药】</h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {najie.草药.map((item, index) => (
                  <ItemCard key={index} title={`${item.name}(${lockStatus[item.islockd]})`} icon='🌱'>
                    <div className='space-y-1.5 text-sm'>
                      <div className='text-gray-700 '>{item.type}</div>
                      <div className='text-gray-700 '>{item.desc}</div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>数量</span>
                        <span className='font-bold text-gray-900 text-base'>{item.数量}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>出售价</span>
                        <span className='font-bold text-gray-900 text-base'>{item.出售价}灵石</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>代号</span>
                        <span className='font-bold text-gray-900 text-base'>{index + 301}</span>
                      </div>
                    </div>
                  </ItemCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 材料区域 */}
        {najie.材料?.length > 0 && (
          <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px]'>
            <div className='m-4 w-[780px]'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-6 h-6 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center'>
                  <span className='text-sm'>🔧</span>
                </div>
                <h2 className='text-xl font-bold text-gray-900 drop-shadow-sm'>【材料】</h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {najie.材料.map((item, index) => (
                  <ItemCard key={index} title={`${item.name}(${lockStatus[item.islockd]})`} icon='⚒️'>
                    <div className='space-y-1.5 text-sm'>
                      <div className='text-gray-700 '>{item.type}</div>
                      <div className='text-gray-700 '>{item.desc}</div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>数量</span>
                        <span className='font-bold text-gray-900 text-base'>{item.数量}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>出售价</span>
                        <span className='font-bold text-gray-900 text-base'>{item.出售价}灵石</span>
                      </div>
                    </div>
                  </ItemCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 仙宠区域 */}
        {najie.仙宠?.length > 0 && (
          <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px]'>
            <div className='m-4 w-[780px]'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-6 h-6 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center'>
                  <span className='text-sm'>🐉</span>
                </div>
                <h2 className='text-xl font-bold text-gray-900 drop-shadow-sm'>【仙宠】</h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {najie.仙宠.map((item, index) => (
                  <ItemCard key={index} title={`${item.name}(${lockStatus[item.islockd]})`} icon='🐾'>
                    <div className='space-y-1.5 text-sm'>
                      <div className='text-gray-700 '>{item.type}</div>
                      <div className='text-gray-700 '>{item.desc}</div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>数量</span>
                        <span className='font-bold text-gray-900 text-base'>{item.数量}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>出售价</span>
                        <span className='font-bold text-gray-900 text-base'>{item.出售价}灵石</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>品级</span>
                        <span className='font-bold text-gray-900 text-base'>{item.品级}</span>
                      </div>
                    </div>
                  </ItemCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 仙宠口粮区域 */}
        {najie.仙宠口粮?.length > 0 && (
          <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px]'>
            <div className='m-4 w-[780px]'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-6 h-6 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center'>
                  <span className='text-sm'>🥘</span>
                </div>
                <h2 className='text-xl font-bold text-gray-900 drop-shadow-sm'>【仙宠口粮】</h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {najie.仙宠口粮.map((item, index) => (
                  <ItemCard key={index} title={`${item.name}(${lockStatus[item.islockd]})`} icon='🥘'>
                    <div className='space-y-1.5 text-sm'>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>数量</span>
                        <span className='font-bold text-gray-900 text-base'>{item.数量}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-gray-800'>出售价</span>
                        <span className='font-bold text-gray-900 text-base'>{item.出售价}灵石</span>
                      </div>
                    </div>
                  </ItemCard>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='h-3' />
    </HTML>
  );
};

export default Najie;
