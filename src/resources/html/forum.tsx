import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from '@src/resources/styles/tw.scss'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import supermarketURL from '@src/resources/img/fairyrealm.jpg'

interface ForumItem {
  class: string
  name: string
  num: number | string
  price: number | string
  aconut: number | string
  whole: number | string
  qq: string | number
}

const Forum = ({ Forum: forumData }: { Forum?: ForumItem[] }) => {
  return (
    <html>
      <head>
        <LinkStyleSheet src={cssURL} />
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
        <main className="max-w-4xl mx-auto space-y-8">
          <header className="space-y-4 flex flex-col items-center">
            <h1 className="inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow">
              聚宝堂
            </h1>
            <div className="text-white/70 text-sm md:text-base space-y-1">
              <div>发布指令：#发布+物品名*价格*数量</div>
              <div>接取指令：#接取+编号*数量</div>
              <div>取消指令：#取消+编号</div>
            </div>
          </header>

          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {forumData?.length ? (
              forumData.map((item, index) => (
                <article
                  key={index}
                  className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 flex flex-col gap-2 shadow-card hover:ring-brand-accent hover:bg-white/10 transition"
                >
                  <h2 className="text-lg font-semibold text-brand-accent tracking-wide mb-1">
                    【{item.class}】{item.name}
                  </h2>
                  <div className="text-sm text-white/80">
                    编号：
                    <span className="font-semibold text-brand-accent">
                      No.{item.num}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    单价：
                    <span className="font-semibold text-brand-accent">
                      {item.price}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    数量：
                    <span className="font-semibold text-brand-accent">
                      {item.aconut}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    总价：
                    <span className="font-semibold text-brand-accent">
                      {item.whole}
                    </span>
                  </div>
                  <div className="text-sm text-white/80">
                    QQ：
                    <span className="font-semibold text-brand-accent">
                      {item.qq}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="col-span-full text-white/60">暂无发布</p>
            )}
          </section>
        </main>
      </body>
    </html>
  )
}

export default Forum
