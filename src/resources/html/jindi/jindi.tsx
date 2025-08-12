import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from './tailwindcss.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import secretPlaceURL from '@src/resources/img/fairyrealm.jpg'
import cardURL from '@src/resources/img/road.jpg'

interface JindiItem {
  Grade: string | number
  name: string
  Best: string[]
  Price: number | string
  experience: number | string
}

const SecretPlace = ({ didian_list }: { didian_list?: JindiItem[] }) => {
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
        style={{ backgroundImage: `url(${secretPlaceURL})` }}
      >
        <main className="max-w-5xl mx-auto space-y-8">
          <header className="space-y-4 flex flex-col items-center">
            <h1 className="inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow">
              禁地
            </h1>
          </header>

          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {didian_list?.map((item, index) => (
              <article
                key={index}
                className="relative group rounded-2xl overflow-hidden bg-[length:100%_100%] bg-center shadow-card ring-1 ring-white/10 hover:ring-brand-accent transition-all duration-300"
                style={{ backgroundImage: `url(${cardURL})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50 group-hover:from-black/30 group-hover:to-black/60 transition-colors" />
                <div className="relative z-10 p-4 md:p-5 flex flex-col h-full justify-between">
                  <header className="space-y-1">
                    <h2 className="text-lg font-semibold text-white tracking-wide drop-shadow">
                      <span className="text-brand-accent">
                        【等级:{item.Grade}】
                      </span>
                      {item.name}
                    </h2>
                  </header>
                  <div className="mt-4 space-y-1 text-sm md:text-base text-white/90 font-medium">
                    <p>
                      极品：
                      <span className="text-brand-accent font-semibold">
                        {item.Best[0]}
                      </span>
                    </p>
                    <p>
                      所需灵石：
                      <span className="text-brand-accent font-semibold">
                        {item.Price}
                      </span>
                    </p>
                    <p>
                      所需修为：
                      <span className="text-brand-accent font-semibold">
                        {item.experience}
                      </span>
                    </p>
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

export default SecretPlace
