import React from 'react'
import HTML from './HTML'
import playerURL from '@src/resources/img/player.jpg'
import playerFooterURL from '@src/resources/img/player_footer.png'
import user_stateURL from '@src/resources/img/user_state.png'

interface DaojuItem {
  name: string
  desc: string
  出售价: number
}

const Daoju = ({
  nickname,
  daoju_have = [],
  daoju_need = []
}: {
  nickname: string
  daoju_have?: DaojuItem[]
  daoju_need?: DaojuItem[]
}) => {
  return (
    <HTML
      className="min-h-screen w-full text-center p-4 md:p-8 bg-top bg-no-repeat bg-[length:100%]"
      style={{
        backgroundImage: `url(${playerURL}), url(${playerFooterURL})`,
        backgroundRepeat: 'no-repeat, repeat',
        backgroundSize: '100%, auto'
      }}
    >
      <main className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4 flex flex-col items-center">
          <div
            className="w-40 h-40 rounded-full bg-cover bg-center ring-4 ring-white/30 shadow-card"
            style={{ backgroundImage: `url(${user_stateURL})` }}
          />
          <h1 className="inline-block px-6 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow">
            {nickname}的道具
          </h1>
        </header>

        {daoju_have.length > 0 && (
          <section className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 md:p-6 shadow-card space-y-4">
            <h2 className="text-lg md:text-xl font-semibold text-brand-accent tracking-wide mb-2">
              【已拥有】
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {daoju_have.map((item, index) => (
                <article
                  key={index}
                  className="rounded-xl bg-white/10 p-4 flex flex-col gap-2 shadow hover:bg-brand-accent/10 transition"
                >
                  <h3 className="text-base font-bold text-white tracking-wide mb-1">
                    {item.name}
                  </h3>
                  <div className="text-sm text-white/80">
                    类型：
                    <span className="font-semibold text-brand-accent">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    描述：
                    <span className="font-semibold text-brand-accent">
                      {item.desc}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    价格：
                    <span className="font-semibold text-brand-accent">
                      {item.出售价.toFixed(0)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {daoju_need.length > 0 && (
          <section className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 md:p-6 shadow-card space-y-4">
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-wide mb-2">
              【未拥有】
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {daoju_need.map((item, index) => (
                <article
                  key={index}
                  className="rounded-xl bg-white/10 p-4 flex flex-col gap-2 shadow"
                >
                  <h3 className="text-base font-bold text-white tracking-wide mb-1">
                    {item.name}
                  </h3>
                  <div className="text-sm text-white/80">
                    类型：
                    <span className="font-semibold text-brand-accent">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    描述：
                    <span className="font-semibold text-brand-accent">
                      {item.desc}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    价格：
                    <span className="font-semibold text-brand-accent">
                      {item.出售价.toFixed(0)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </HTML>
  )
}

export default Daoju
