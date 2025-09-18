import React from 'react';
import HTML from './HTML';
import fairyrealm from '@src/resources/img/fairyrealm.jpg';
import { BackgroundImage } from 'jsxp';

interface GongfaItem {
  name: string;
  修炼加成: number;
  出售价: number;
}

const Gongfa = ({ gongfa_need = [], gongfa_have = [] }: { nickname: string; gongfa_need?: GongfaItem[]; gongfa_have?: GongfaItem[] }) => {
  return (
    <HTML>
      <BackgroundImage src={fairyrealm} className=' w-full text-center p-4 md:p-8 bg-top '>
        <main className='max-w-5xl mx-auto space-y-10'>
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
      </BackgroundImage>
    </HTML>
  );
};

export default Gongfa;
