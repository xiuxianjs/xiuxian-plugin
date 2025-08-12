import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from './tailwindcss.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import ningmenghomeURL from '@src/resources/img/fairyrealm.jpg'

interface Commodity {
  type: string
  name: string
  class: string
  出售价: number
  atk?: number
  def?: number
  HP?: number
  bao?: number
  exp?: string | number
  xueqi?: string | number
  修炼加成?: number
  desc?: string
}

const Ningmenghome = ({
  commodities_list
}: {
  commodities_list?: Commodity[]
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
        className="min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover"
        style={{ backgroundImage: `url(${ningmenghomeURL})` }}
      >
        <main className="max-w-5xl mx-auto space-y-8">
          <header className="space-y-4 flex flex-col items-center">
            <h1 className="inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow">
              柠檬堂
            </h1>
            <div className="text-white/70 text-sm md:text-base space-y-1">
              <div>购买指令：#购买+物品名</div>
              <div>筛选指令：#柠檬堂+物品类型</div>
            </div>
          </header>

          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {commodities_list?.length ? (
              commodities_list.map((item, index) => (
                <article
                  key={index}
                  className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 flex flex-col gap-2 shadow-card hover:ring-brand-accent hover:bg-white/10 transition"
                >
                  <h2 className="text-lg font-semibold text-brand-accent tracking-wide mb-1">
                    【{item.type}】{item.name}
                  </h2>
                  <div className="text-sm text-white/80">
                    价格：
                    <span className="font-semibold text-brand-accent">
                      {(item.出售价 * 1.2).toFixed(0)}灵石
                    </span>
                  </div>
                  {item.class === '装备' && (
                    <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
                      <div>
                        攻：
                        <span className="text-brand-accent font-semibold">
                          {item.atk}
                        </span>
                      </div>
                      <div>
                        防：
                        <span className="text-brand-accent font-semibold">
                          {item.def}
                        </span>
                      </div>
                      <div>
                        血：
                        <span className="text-brand-accent font-semibold">
                          {item.HP}
                        </span>
                      </div>
                      <div>
                        暴：
                        <span className="text-brand-accent font-semibold">
                          {item.bao ? item.bao * 100 : 0}%
                        </span>
                      </div>
                    </div>
                  )}
                  {item.class === '丹药' && (
                    <div className="text-xs text-white/80">
                      效果：
                      <span className="text-brand-accent font-semibold">
                        {item.HP ? item.HP / 1000 : 0}%{item.exp}
                        {item.xueqi}
                      </span>
                    </div>
                  )}
                  {item.class === '功法' && (
                    <div className="text-xs text-white/80">
                      修炼加成：
                      <span className="text-brand-accent font-semibold">
                        {item.修炼加成 ? (item.修炼加成 * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  )}
                  {(item.class === '道具' || item.class === '草药') && (
                    <div className="text-xs text-white/80">
                      描述：
                      <span className="text-brand-accent font-semibold">
                        {item.desc}
                      </span>
                    </div>
                  )}
                </article>
              ))
            ) : (
              <p className="col-span-full text-white/60">暂无商品</p>
            )}
          </section>
        </main>
      </body>
    </html>
  )
}

export default Ningmenghome
