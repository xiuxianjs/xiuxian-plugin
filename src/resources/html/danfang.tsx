import React from 'react';
import HTML from './HTML';
import danfangURL from '@src/resources/img/fairyrealm.jpg';

interface Material {
  name: string;
  amount: number | string;
}
interface DanfangItem {
  name: string;
  type?: string;
  rate: number;
  level_limit: number | string;
  exp?: number[];
  exp2?: number | string;
  materials: Material[];
}

const Danfang = ({ danfang_list }: { danfang_list?: DanfangItem[] }) => {
  const renderItemInfo = (item: DanfangItem) => {
    if (item.type === '修为' || item.type === '血气') {
      return item.exp2 ?? (item.exp ? item.exp.join(' / ') : '');
    }
    if (item.exp) {
      return item.exp.join(' / ');
    }

    return '';
  };

  return (
    <HTML className=' w-full text-center p-4 md:p-8 bg-top bg-cover relative' style={{ backgroundImage: `url(${danfangURL})` }}>
      {/* 背景渐变遮罩 */}
      <div className='absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent backdrop-blur-sm pointer-events-none' />

      <main className='relative max-w-6xl mx-auto space-y-10'>
        <header className='space-y-3'>
          <h1
            className='inline-block px-8 py-2 rounded-2xl bg-white/30 backdrop-blur-md
            text-2xl md:text-3xl font-bold tracking-widest shadow-lg border border-white/40
            text-blue-900 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]'
          >
            丹方
          </h1>
          <p className='text-blue-900/80 text-sm md:text-base font-medium'>炼制指令：#炼制+丹药名</p>
          <p className='text-blue-900/70 text-xs md:text-sm'>炼制成功率 = 丹方成功率 + 玩家职业等级成功率</p>
        </header>

        <section className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {danfang_list?.map((item, index) => {
            const ratePercent = Math.floor(item.rate * 100);

            return (
              <article
                key={index}
                className='group rounded-2xl bg-white/40 backdrop-blur-md border border-white/50
                shadow-lg p-4 flex flex-col gap-3 transition-transform transform hover:scale-[1.02] hover:shadow-xl hover:border-blue-200'
              >
                <header className='space-y-1'>
                  <h2 className='text-lg font-semibold tracking-wide text-blue-900'>
                    {item.type ? <span className=''>【{item.type}】</span> : null}
                    {item.name}
                  </h2>
                  <div className='flex items-center gap-3 text-sm text-blue-900/80'>
                    <span className='px-2 py-0.5 rounded-full bg-blue-500/20 font-medium shadow-sm border border-blue-300/50'>{ratePercent}%</span>
                    <span className='px-2 py-0.5 rounded-full bg-blue-200/40 font-medium shadow-sm border border-blue-300/50'>lv.{item.level_limit}</span>
                  </div>
                </header>
                <div className='text-sm text-blue-900/90 font-medium leading-relaxed'>
                  {item.type ? `${item.type}：` : '效果：'}
                  <span className='font-semibold'>{renderItemInfo(item)}</span>
                </div>
                <div className='mt-auto space-y-2'>
                  <h3 className='text-sm font-semibold text-blue-900/80 tracking-wide'>配方</h3>
                  <ul className='space-y-1 max-h-40 overflow-auto pr-1 scrollbar-thin scrollbar-thumb-blue-300/40 scrollbar-track-transparent'>
                    {item.materials.map((m, mi) => (
                      <li
                        key={mi}
                        className='flex justify-between gap-4 text-xs md:text-sm text-blue-900/80 bg-white/50 border border-white/40 rounded px-2 py-1'
                      >
                        <span className='truncate' title={m.name}>
                          {m.name}
                        </span>
                        <span className='font-semibold'>×{m.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          }) || <p className='col-span-full text-blue-900/60'>暂无丹方</p>}
        </section>
      </main>
    </HTML>
  );
};

export default Danfang;
