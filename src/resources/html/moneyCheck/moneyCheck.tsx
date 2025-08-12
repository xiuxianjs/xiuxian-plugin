import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from './tailwindcss.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import ningmenghomeBgURL from '@src/resources/img/fairyrealm.jpg'

const MoneyCheck = ({
  qq,
  victory,
  victory_num,
  defeated,
  defeated_num
}: {
  qq: string | number
  victory: number | string
  victory_num: number | string
  defeated: number | string
  defeated_num: number | string
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
        style={{ backgroundImage: `url(${ningmenghomeBgURL})` }}
      >
        <main className="max-w-xl mx-auto space-y-8">
          <section className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-6 shadow-card flex flex-col items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-widest text-brand-accent mb-2">
              金银坊记录
            </h1>
            <div className="text-white/70 text-base mb-4">QQ：{qq}</div>
            <div className="grid gap-3 text-white/90 text-lg font-medium">
              <div>
                胜场：
                <span className="text-brand-accent font-semibold">
                  {victory}
                </span>
              </div>
              <div>
                共卷走灵石：
                <span className="text-brand-accent font-semibold">
                  {victory_num}
                </span>
              </div>
              <div>
                败场：
                <span className="text-brand-accent font-semibold">
                  {defeated}
                </span>
              </div>
              <div>
                共献祭灵石：
                <span className="text-brand-accent font-semibold">
                  {defeated_num}
                </span>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  )
}

export default MoneyCheck
