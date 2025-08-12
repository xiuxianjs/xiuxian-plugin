import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from './tailwindcss.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import playerURL from '@src/resources/img/player.jpg'
import playerFooterURL from '@src/resources/img/player_footer.png'

interface GongfaItem {
  name: string
  修炼加成: number
  出售价: number
}

const Gongfa = ({
  nickname,
  gongfa_need = [],
  gongfa_have = []
}: {
  nickname: string
  gongfa_need?: GongfaItem[]
  gongfa_have?: GongfaItem[]
}) => {
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
            <h1 className="inline-block px-6 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow">
              {nickname}的功法
            </h1>
          </header>

          {gongfa_need.length > 0 && (
            <section className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 md:p-6 shadow-card space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-white tracking-wide mb-2">
                【未学习】
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {gongfa_need.map((item, index) => (
                  <article
                    key={index}
                    className="rounded-xl bg-white/10 p-4 flex flex-col gap-2 shadow"
                  >
                    <h3 className="text-base font-bold text-white tracking-wide mb-1">
                      {item.name}
                    </h3>
                    <div className="text-sm text-white/80">
                      修炼加成：
                      <span className="font-semibold text-brand-accent">
                        {(item.修炼加成 * 100).toFixed(0)}%
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

          {gongfa_have.length > 0 && (
            <section className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 md:p-6 shadow-card space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-brand-accent tracking-wide mb-2">
                【已学习】
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {gongfa_have.map((item, index) => (
                  <article
                    key={index}
                    className="rounded-xl bg-white/10 p-4 flex flex-col gap-2 shadow hover:bg-brand-accent/10 transition"
                  >
                    <h3 className="text-base font-bold text-white tracking-wide mb-1">
                      {item.name}
                    </h3>
                    <div className="text-sm text-white/80">
                      修炼加成：
                      <span className="font-semibold text-brand-accent">
                        {(item.修炼加成 * 100).toFixed(0)}%
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

export default Gongfa
