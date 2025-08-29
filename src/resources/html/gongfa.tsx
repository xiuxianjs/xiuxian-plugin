import React from 'react';
import HTML from './HTML';
import playerURL from '@src/resources/img/player.jpg';
import playerFooterURL from '@src/resources/img/player_footer.png';

interface GongfaItem {
  name: string;
  修炼加成: number;
  出售价: number;
}

const Gongfa = ({ nickname, gongfa_need = [], gongfa_have = [] }: { nickname: string; gongfa_need?: GongfaItem[]; gongfa_have?: GongfaItem[] }) => {
  return (
    <HTML
      className=' w-full text-center p-4 md:p-8 bg-top bg-no-repeat'
      style={{
        backgroundImage: `url(${playerURL}), url(${playerFooterURL})`,
        backgroundRepeat: 'no-repeat, repeat',
        backgroundSize: '100%, auto'
      }}
    >
      <main className='max-w-5xl mx-auto space-y-10'>
        {/* 标题 */}
        <header className='flex flex-col items-center space-y-4'>
          <h1 className='px-8 py-3 rounded-2xl bg-gradient-to-r from-green-900/70 to-yellow-900/70 text-3xl md:text-4xl font-extrabold tracking-widest shadow-lg border-2 border-yellow-400/60 text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'>
            {nickname}的功法
          </h1>
        </header>

        {/* 未学习 */}
        {gongfa_need.length > 0 && (
          <section className='rounded-2xl bg-black/30 backdrop-blur-lg border border-yellow-500/30 p-6 shadow-2xl space-y-4'>
            <h2 className='text-lg md:text-xl font-bold tracking-wide text-yellow-200 drop-shadow'>【未学习】</h2>
            <div className='grid gap-6 sm:grid-cols-2'>
              {gongfa_need.map((item, index) => (
                <article
                  key={index}
                  className='rounded-xl bg-gradient-to-b from-green-800/40 to-green-900/40 p-4 border border-yellow-500/30 shadow-inner transition transform hover:-translate-y-1 hover:shadow-yellow-500/40'
                >
                  <h3 className='text-lg font-bold text-yellow-300 drop-shadow mb-2'>{item.name}</h3>
                  <p className='text-sm text-green-100/90'>
                    修炼加成：
                    <span className='font-semibold text-yellow-200'>{(item.修炼加成 * 100).toFixed(0)}%</span>
                  </p>
                  <p className='text-sm text-green-100/90'>
                    价格：
                    <span className='font-semibold text-yellow-200'>{item.出售价.toFixed(0)}</span>
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 已学习 */}
        {gongfa_have.length > 0 && (
          <section className='rounded-2xl bg-black/30 backdrop-blur-lg border border-green-400/30 p-6 shadow-2xl space-y-4'>
            <h2 className='text-lg md:text-xl font-bold tracking-wide text-green-200 drop-shadow'>【已学习】</h2>
            <div className='grid gap-6 sm:grid-cols-2'>
              {gongfa_have.map((item, index) => (
                <article
                  key={index}
                  className='rounded-xl bg-gradient-to-b from-green-700/40 to-green-900/50 p-4 border border-green-400/30 shadow-inner transition transform hover:-translate-y-1 hover:shadow-green-400/40'
                >
                  <h3 className='text-lg font-bold text-green-200 drop-shadow mb-2'>{item.name}</h3>
                  <p className='text-sm text-green-100/90'>
                    修炼加成：
                    <span className='font-semibold text-green-300'>{(item.修炼加成 * 100).toFixed(0)}%</span>
                  </p>
                  <p className='text-sm text-green-100/90'>
                    价格：
                    <span className='font-semibold text-green-300'>{item.出售价.toFixed(0)}</span>
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </HTML>
  );
};

export default Gongfa;
