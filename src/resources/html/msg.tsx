import React from 'react';
import HTML from './HTML';
import supermarketURL from '@src/resources/img/fairyrealm.jpg';

interface MsgItem {
  名号: string;
  赏金: number | string;
}

const Msg = ({ type, msg }: { type: number; msg?: MsgItem[] }) => {
  return (
    <HTML className=' w-full text-center p-4 md:p-8 bg-top bg-cover' style={{ backgroundImage: `url(${supermarketURL})` }}>
      <main className='max-w-3xl mx-auto space-y-8'>
        <header className='space-y-4 flex flex-col items-center'>
          {type === 0 && (
            <>
              <h1 className='inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest  shadow'>悬赏目标</h1>
              <div className='/70 text-sm md:text-base'>指令：#讨伐目标+数字</div>
            </>
          )}
          {type === 1 && (
            <>
              <h1 className='inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest  shadow'>悬赏榜</h1>
              <div className='/70 text-sm md:text-base'>指令：#刺杀目标+数字</div>
            </>
          )}
        </header>

        <section className='grid gap-6'>
          {msg?.length ? (
            msg.map((item, index) => (
              <article
                key={index}
                className='rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 flex flex-col gap-2 shadow-inner-card hover:ring-brand-accent hover:bg-white/30 transition'
              >
                <div className='text-lg font-semibold  tracking-wide mb-1'>名号：{item.名号}</div>
                <div className='text-sm /80'>
                  编号：
                  <span className='font-semibold '>No.{index + 1}</span>
                </div>
                <div className='text-sm /80'>
                  赏金：
                  <span className='font-semibold '>{item.赏金}</span>
                </div>
              </article>
            ))
          ) : (
            <p className='col-span-full /60'>暂无悬赏</p>
          )}
        </section>
      </main>
    </HTML>
  );
};

export default Msg;
