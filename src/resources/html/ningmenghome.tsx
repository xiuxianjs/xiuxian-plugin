import React from 'react';
import ningmenghomeURL from '@src/resources/img/fairyrealm.jpg';
import HTML from './HTML';

const Ningmenghome = ({ commodities_list }) => {
  return (
    <HTML>
      <div
        className=' w-full flex flex-col items-center justify-start p-6 md:p-12 bg-center bg-cover relative'
        style={{
          backgroundImage: `url(${ningmenghomeURL})`
        }}
      >
        {/* 白色居中渐变叠加 */}
        <div className='absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-blue-300/90 pointer-events-none' />

        {/* 内容容器 */}
        <div className='relative max-w-4xl w-full bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 text-blue-900 z-10'>
          <header className='mb-8 text-center'>
            <h1 className='text-4xl font-extrabold tracking-widest mb-2 drop-shadow-lg'>柠檬堂</h1>
            <p className='text-sm md:text-base text-blue-800/80'>
              购买指令：<span className='font-semibold'>#购买+物品名</span> &nbsp;&nbsp; 筛选指令：
              <span className='font-semibold'>#柠檬堂+物品类型</span>
            </p>
          </header>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {commodities_list?.map((item, idx) => (
              <div
                key={idx}
                className='bg-white/50 rounded-xl p-4 shadow-md border border-white/40 flex flex-col gap-2 hover:scale-[1.02] transition-transform duration-200'
              >
                <div className='flex justify-between items-center font-semibold text-lg'>
                  <span>
                    【{item.type}】{item.name}
                  </span>
                  <span className='text-blue-700 font-bold'>
                    {(item.出售价 * 1.2).toFixed(0)} 灵石
                  </span>
                </div>

                {item.class === '装备' && (
                  <div className='grid grid-cols-2 gap-2 text-blue-800 font-medium'>
                    <div>攻：{item.atk}</div>
                    <div>防：{item.def}</div>
                    <div>血：{item.HP}</div>
                    <div>暴：{(item.bao * 100).toFixed(1)}%</div>
                  </div>
                )}

                {item.class === '丹药' && (
                  <div className='text-blue-800 font-medium'>
                    效果：{(item.HP / 1000).toFixed(1)}% {item.exp} {item.xueqi}
                  </div>
                )}

                {item.class === '功法' && (
                  <div className='text-blue-800 font-medium'>
                    修炼加成：{(item.修炼加成 * 100).toFixed(0)}%
                  </div>
                )}

                {(item.class === '道具' || item.class === '草药') && (
                  <div className='text-blue-800 font-medium'>描述：{item.desc}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </HTML>
  );
};

export default Ningmenghome;
