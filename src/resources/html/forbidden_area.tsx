import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from '@src/resources/styles/tw.scss'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import forbiddenAreaBgURL from '@src/resources/img/fairyrealm.jpg'
import cardBgURL from '@src/resources/img/road.jpg'

interface RewardItem {
  name: string
}
interface ForbiddenAreaItem {
  Grade: string
  name: string
  Price: number | string
  experience: number | string
  one?: RewardItem[]
  two?: RewardItem[]
  three?: RewardItem[]
}

const ForbiddenArea = ({
  didian_list = []
}: {
  didian_list?: ForbiddenAreaItem[]
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
        style={{ backgroundImage: `url(${forbiddenAreaBgURL})` }}
      >
        <main className="max-w-5xl mx-auto space-y-8">
          <header className="space-y-4 flex flex-col items-center">
            <h1 className="inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow">
              禁地
            </h1>
            <span className="text-white/70 text-sm md:text-base">
              指令：#前往禁地+禁地名
            </span>
          </header>

          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {didian_list?.map((item, index) => (
              <article
                key={index}
                className="relative group rounded-2xl overflow-hidden bg-[length:100%_100%] bg-center shadow-card ring-1 ring-white/10 hover:ring-brand-accent transition-all duration-300"
                style={{ backgroundImage: `url(${cardBgURL})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50 group-hover:from-black/30 group-hover:to-black/60 transition-colors" />
                <div className="relative z-10 p-4 md:p-5 flex flex-col h-full justify-between">
                  <header className="space-y-1">
                    <h2 className="text-lg font-semibold text-white tracking-wide drop-shadow">
                      <span className="text-brand-accent">
                        【{item.Grade}】
                      </span>
                      {item.name}
                    </h2>
                    <div className="text-sm text-white/80 font-medium">
                      <span className="text-brand-accent font-bold">
                        {item.Price}
                      </span>{' '}
                      灵石 +{' '}
                      <span className="text-brand-accent font-bold">
                        {item.experience}
                      </span>{' '}
                      修为
                    </div>
                  </header>
                  <div className="mt-4 space-y-2 text-sm md:text-base text-white/90 font-medium text-left">
                    <div>
                      <span className="font-semibold text-brand-accent">
                        低级奖励：
                      </span>
                      <ul className="pl-4 space-y-1">
                        {item.one?.map((thing, thingIndex) => (
                          <li key={thingIndex} className="text-white/80">
                            {thing.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-semibold text-brand-accent">
                        中级奖励：
                      </span>
                      <ul className="pl-4 space-y-1">
                        {item.two?.map((thing, thingIndex) => (
                          <li key={thingIndex} className="text-white/80">
                            {thing.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-semibold text-brand-accent">
                        高级奖励：
                      </span>
                      <ul className="pl-4 space-y-1">
                        {item.three?.map((thing, thingIndex) => (
                          <li key={thingIndex} className="text-white/80">
                            {thing.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            )) || <p className="col-span-full text-white/60">暂无禁地</p>}
          </section>
        </main>
      </body>
    </html>
  )
}

export default ForbiddenArea
