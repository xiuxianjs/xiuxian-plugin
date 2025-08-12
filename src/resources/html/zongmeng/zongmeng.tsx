import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from './tailwindcss.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import ningmenghomeURL from '@src/resources/img/fairyrealm.jpg'

interface ZongMengItem {
  宗名: string
  人数: number | string
  宗门人数上限: number | string
  位置: string
  等级: string | number
  天赋加成: number | string
  宗门建设等级: string | number
  镇宗神兽: string
  宗门驻地: string
  最低加入境界: string
  宗主: string
}

const ZongMeng = ({ temp }: { temp?: ZongMengItem[] }) => {
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
        style={{ backgroundImage: `url(${ningmenghomeURL})` }}
      >
        <main className="max-w-5xl mx-auto space-y-8">
          <header className="space-y-4 flex flex-col items-center">
            <h1 className="inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow">
              宗门列表
            </h1>
          </header>

          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {temp?.length ? (
              temp.map((item, index) => (
                <article
                  key={index}
                  className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 flex flex-col gap-2 shadow-card hover:ring-brand-accent hover:bg-white/10 transition"
                >
                  <h2 className="text-lg font-semibold text-brand-accent tracking-wide mb-1">
                    {item.宗名}
                  </h2>
                  <div className="text-sm text-white/80">
                    人数：
                    <span className="font-semibold text-brand-accent">
                      {item.人数}/{item.宗门人数上限}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    类型：
                    <span className="font-semibold text-brand-accent">
                      {item.位置}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    等级：
                    <span className="font-semibold text-brand-accent">
                      {item.等级}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    天赋加成：
                    <span className="font-semibold text-brand-accent">
                      {item.天赋加成}%
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    建设等级：
                    <span className="font-semibold text-brand-accent">
                      {item.宗门建设等级}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    镇宗神兽：
                    <span className="font-semibold text-brand-accent">
                      {item.镇宗神兽}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    驻地：
                    <span className="font-semibold text-brand-accent">
                      {item.宗门驻地}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    加入门槛：
                    <span className="font-semibold text-brand-accent">
                      {item.最低加入境界}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    宗主QQ：
                    <span className="font-semibold text-brand-accent">
                      {item.宗主}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="col-span-full text-white/60">暂无宗门</p>
            )}
          </section>
        </main>
      </body>
    </html>
  )
}

export default ZongMeng
