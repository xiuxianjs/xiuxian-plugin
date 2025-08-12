import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from '@src/resources/styles/tw.scss'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import playerURL from '@src/resources/img/player.jpg'
import playerFooterURL from '@src/resources/img/player_footer.png'
import user_stateURL from '@src/resources/img/user_state.png'

interface DanyaoItem {
  name: string
  type: string
  HP?: number | string
  exp?: number | string
  xueqi?: number | string
  xingyun?: number
  出售价: number
}

const Danyao = ({
  nickname,
  danyao_have = [],
  danyao2_have = [],
  danyao_need = []
}: {
  nickname: string
  danyao_have?: DanyaoItem[]
  danyao2_have?: DanyaoItem[]
  danyao_need?: DanyaoItem[]
}) => {
  const renderEffect = (item: DanyaoItem) => {
    const effects = []
    if (item.HP) effects.push(item.HP)
    if (item.exp) effects.push(item.exp)
    if (item.xueqi) effects.push(item.xueqi)
    if (item.xingyun > 0) effects.push(`${(item.xingyun * 100).toFixed(1)}%`)
    return effects.join('')
  }

  return (
    <html>
      <head>
        <LinkStyleSheet src={cssURL} />
        <meta httpEquiv="content-type" content="text/html;charset=utf-8" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face { font-family: 'tttgbnumber'; src: url('${tttgbnumberURL}'); font-weight: normal; font-style: normal; }
              body { font-family: 'tttgbnumber', system-ui, sans-serif; }
            `
          }}
        />
      </head>
      <body
        className="min-h-screen w-full text-center p-4 md:p-8 bg-top bg-no-repeat bg-[length:100%]"
        style={{
          backgroundImage: `url(${playerURL}), url(${playerFooterURL})`
        }}
      >
        <main className="max-w-4xl mx-auto space-y-8">
          <header className="space-y-4 flex flex-col items-center">
            <div
              className="w-40 h-40 rounded-full bg-cover bg-center ring-4 ring-white/30 shadow-card"
              style={{ backgroundImage: `url(${user_stateURL})` }}
            />
            <h1 className="inline-block px-6 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow">
              {nickname}的丹药
            </h1>
          </header>

          {(danyao_have.length > 0 || danyao2_have.length > 0) && (
            <section className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 md:p-6 shadow-card space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-brand-accent tracking-wide mb-2">
                【已拥有】
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[...danyao_have, ...danyao2_have].map((item, index) => (
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
                        {item.type}
                      </span>
                    </div>
                    <div className="text-sm text-white/80">
                      效果：
                      <span className="font-semibold text-brand-accent">
                        {renderEffect(item)}
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

          {danyao_need.length > 0 && (
            <section className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 md:p-6 shadow-card space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-white tracking-wide mb-2">
                【未拥有】
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {danyao_need.map((item, index) => (
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
                        {item.type}
                      </span>
                    </div>
                    <div className="text-sm text-white/80">
                      效果：
                      <span className="font-semibold text-brand-accent">
                        {renderEffect(item)}
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
      </body>
    </html>
  )
}

export default Danyao
