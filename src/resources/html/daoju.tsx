import React from 'react'
import HTML from './HTML'
import playerURL from '@src/resources/img/player.jpg'
import playerFooterURL from '@src/resources/img/player_footer.png'
import { getAvatar } from './core'
import { Avatar } from './Avatar'

interface DaojuItem {
  name: string
  desc: string
  出售价: number
}

const Daoju = ({
  nickname,
  user_id,
  daoju_have = [],
  daoju_need = []
}: {
  nickname: string
  user_id: string
  daoju_have?: DaojuItem[]
  daoju_need?: DaojuItem[]
}) => {
  return (
    <HTML
      className=" w-full text-center p-4 md:p-8 bg-top bg-no-repeat"
      style={{
        backgroundImage: `url(${playerURL}), url(${playerFooterURL})`,
        backgroundRepeat: 'no-repeat, repeat',
        backgroundSize: '100%, auto'
      }}
    >
      <main className="max-w-4xl mx-auto space-y-10">
        {/* 玩家头像和标题 */}
        <header className="space-y-4 flex flex-col items-center">
          <Avatar src={getAvatar(user_id)} />
          <h1 className="inline-block px-6 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest shadow-lg text-white/90 drop-shadow-lg border border-white/20">
            {nickname}的道具
          </h1>
        </header>

        {/* 已拥有 */}
        {daoju_have.length > 0 && (
          <section className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-emerald-400/40 p-4 md:p-6 shadow-lg space-y-4">
            <h2 className="text-lg md:text-xl font-semibold tracking-wide text-emerald-300 drop-shadow mb-2">
              【已拥有】
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {daoju_have.map((item, index) => (
                <article
                  key={index}
                  className="rounded-xl bg-gradient-to-br from-emerald-800/30 to-emerald-500/20 p-4 flex flex-col gap-2 shadow-inner hover:shadow-emerald-400/30 hover:scale-[1.02] transition-all border border-emerald-400/20"
                >
                  <h3 className="text-base font-bold tracking-wide mb-1 text-emerald-200 drop-shadow">
                    {item.name}
                  </h3>
                  <div className="text-sm text-white/80">
                    类型：<span className="font-semibold">{item.name}</span>
                  </div>
                  <div className="text-sm text-white/80">
                    描述：<span className="font-semibold">{item.desc}</span>
                  </div>
                  <div className="text-sm text-white/80">
                    价格：
                    <span className="font-semibold text-amber-300">
                      {item.出售价.toFixed(0)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 未拥有 */}
        {daoju_need.length > 0 && (
          <section className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-red-400/40 p-4 md:p-6 shadow-lg space-y-4">
            <h2 className="text-lg md:text-xl font-semibold tracking-wide text-red-300 drop-shadow mb-2">
              【未拥有】
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {daoju_need.map((item, index) => (
                <article
                  key={index}
                  className="rounded-xl bg-gradient-to-br from-red-800/30 to-red-500/20 p-4 flex flex-col gap-2 shadow-inner hover:shadow-red-400/30 hover:scale-[1.02] transition-all border border-red-400/20"
                >
                  <h3 className="text-base font-bold tracking-wide mb-1 text-red-200 drop-shadow">
                    {item.name}
                  </h3>
                  <div className="text-sm text-white/80">
                    类型：<span className="font-semibold">{item.name}</span>
                  </div>
                  <div className="text-sm text-white/80">
                    描述：<span className="font-semibold">{item.desc}</span>
                  </div>
                  <div className="text-sm text-white/80">
                    价格：
                    <span className="font-semibold text-amber-300">
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
