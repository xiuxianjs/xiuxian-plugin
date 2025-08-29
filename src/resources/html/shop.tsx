import React from 'react';
import HTML from './HTML';
import playerURL from '@src/resources/img/player.jpg';
import playerFooterURL from '@src/resources/img/player_footer.png';

interface ShopItem {
  name: string;
  数量: number;
}

interface ShopProps {
  name: string;
  level: string | number;
  state: string;
  thing?: ShopItem[];
}

const Shop: React.FC<ShopProps> = ({ name, level, state, thing = [] }) => {
  return (
    <HTML
      className='w-full text-center p-4 md:p-8 bg-top bg-no-repeat min-h-screen'
      style={{
        backgroundImage: `url(${playerURL}), url(${playerFooterURL})`,
        backgroundRepeat: 'no-repeat, repeat',
        backgroundSize: '100%, auto'
      }}
    >
      <main className='max-w-4xl mx-auto space-y-8'>
        {/* 商店标题区域 */}
        <header className='relative'>
          <div className='absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-3xl blur-2xl' />
          <div className='relative rounded-3xl bg-white/8 backdrop-blur-xl ring-2 ring-amber-400/30 p-8 shadow-2xl border border-amber-300/20'>
            <div className='flex items-center justify-center space-x-4 mb-6'>
              <div className='w-10 h-10 bg-amber-400/30 rounded-full flex items-center justify-center'>
                <span className='text-amber-300 text-xl'>🏪</span>
              </div>
              <h1 className='text-2xl md:text-3xl font-bold tracking-wider text-amber-200 drop-shadow-lg'>【{name}】</h1>
              <div className='w-10 h-10 bg-amber-400/30 rounded-full flex items-center justify-center'>
                <span className='text-amber-300 text-xl'>🏪</span>
              </div>
            </div>

            {/* 商店信息 */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-900/40 to-orange-900/40 border border-amber-400/30'>
                <span className='text-amber-200 font-bold text-lg'>{level}</span>
              </div>

              <div className='flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-400/30'>
                <span className='text-emerald-200 font-bold text-lg'>{state}</span>
              </div>
            </div>
          </div>
        </header>

        {/* 商品列表 */}
        {thing.length > 0 && (
          <section className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl blur-2xl' />
            <div className='relative rounded-3xl bg-white/8 backdrop-blur-xl ring-2 ring-blue-400/30 p-6 md:p-8 shadow-2xl border border-blue-300/20'>
              <div className='space-y-4'>
                {thing.map((item, index) => (
                  <article
                    key={index}
                    className='relative rounded-2xl bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-5 shadow-xl border border-blue-400/30 backdrop-blur-md hover:border-blue-300/50 transition-all duration-300'
                  >
                    <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-t-2xl' />
                    <div className='absolute top-2 right-2 w-3 h-3 bg-blue-400/50 rounded-full' />

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-4'>
                        <div className='w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center'>
                          <span className='text-blue-300 text-xl'>📦</span>
                        </div>
                        <div>
                          <h3 className='text-lg font-bold tracking-wide text-blue-100 drop-shadow'>{item.name}</h3>
                          <p className='text-blue-200/80 text-sm'>编号: {index + 1}</p>
                        </div>
                      </div>

                      <div className='flex items-center space-x-3'>
                        <div className='text-center'>
                          <div className='text-2xl font-bold text-amber-300'>{item.数量}</div>
                        </div>
                        <div className='w-8 h-8 bg-amber-400/20 rounded-full flex items-center justify-center'>
                          <span className='text-amber-300 text-sm'>📊</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 空状态 */}
        {thing.length === 0 && (
          <section className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-gray-600/10 to-slate-600/10 rounded-3xl blur-2xl' />
            <div className='relative rounded-3xl bg-white/8 backdrop-blur-xl ring-2 ring-gray-400/30 p-8 shadow-2xl border border-gray-300/20'>
              <div className='flex flex-col items-center space-y-4'>
                <div className='w-16 h-16 bg-gray-400/20 rounded-full flex items-center justify-center'>
                  <span className='text-gray-300 text-3xl'>📭</span>
                </div>
                <h3 className='text-xl font-bold text-gray-200'>暂无</h3>
              </div>
            </div>
          </section>
        )}
      </main>
    </HTML>
  );
};

export default Shop;
