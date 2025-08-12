import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from './tailwindcss.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import supermarketURL from '@src/resources/img/fairyrealm.jpg'

interface MsgItem {
  名号: string
  赏金: number | string
}

const Msg = ({ type, msg }: { type: number; msg?: MsgItem[] }) => {
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
        className="min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover"
        style={{ backgroundImage: `url(${supermarketURL})` }}
      >
        <main className="max-w-3xl mx-auto space-y-8">
          <header className="space-y-4 flex flex-col items-center">
            {type === 0 && (
              <>
                <h1 className="inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow">
                  悬赏目标
                </h1>
                <div className="text-white/70 text-sm md:text-base">
                  指令：#讨伐目标+数字
                </div>
              </>
            )}
            {type === 1 && (
              <>
                <h1 className="inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow">
                  悬赏榜
                </h1>
                <div className="text-white/70 text-sm md:text-base">
                  指令：#刺杀目标+数字
                </div>
              </>
            )}
          </header>

          <section className="grid gap-6">
            {msg?.length ? (
              msg.map((item, index) => (
                <article
                  key={index}
                  className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 flex flex-col gap-2 shadow-card hover:ring-brand-accent hover:bg-white/10 transition"
                >
                  <div className="text-lg font-semibold text-brand-accent tracking-wide mb-1">
                    名号：{item.名号}
                  </div>
                  <div className="text-sm text-white/80">
                    编号：
                    <span className="font-semibold text-brand-accent">
                      No.{index + 1}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    赏金：
                    <span className="font-semibold text-brand-accent">
                      {item.赏金}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="col-span-full text-white/60">暂无悬赏</p>
            )}
          </section>
        </main>
      </body>
    </html>
  )
}

export default Msg
