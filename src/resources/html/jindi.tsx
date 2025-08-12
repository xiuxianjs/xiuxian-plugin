import React from 'react'
import HTML from './HTML'
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
    <HTML
      className="min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover relative text-white"
      style={{ backgroundImage: `url(${secretPlaceURL})` }}
    >
      {/* 背景渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 backdrop-blur-sm pointer-events-none"></div>

      <main className="relative max-w-5xl mx-auto space-y-8">
        <header className="space-y-4 flex flex-col items-center">
          <h1
            className="inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur-md
            text-2xl md:text-3xl font-bold tracking-widest shadow-lg border border-white/20
            text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
          >
            禁地
          </h1>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {didian_list?.length ? (
            didian_list.map((item, index) => (
              <article
                key={index}
                className="relative group rounded-2xl overflow-hidden bg-[length:100%_100%] bg-center
                shadow-lg ring-1 ring-white/20 transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl hover:ring-brand-accent"
                style={{ backgroundImage: `url(${cardURL})` }}
              >
                {/* 背景遮罩 */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50
                  group-hover:from-black/30 group-hover:via-black/40 group-hover:to-black/60 transition-colors"
                />

                <div className="relative z-10 p-5 flex flex-col h-full justify-between">
                  <header className="space-y-1">
                    <h2 className="text-lg font-semibold tracking-wide drop-shadow-md text-white">
                      <span className="block text-sm font-medium text-blue-200/90">
                        【等级: {item.Grade}】
                      </span>
                      {item.name}
                    </h2>
                  </header>

                  <div className="mt-4 space-y-2 text-sm md:text-base font-medium text-white/90">
                    <p>
                      极品：
                      <span className="font-semibold text-blue-300">
                        {item.Best[0]}
                      </span>
                    </p>
                    <p>
                      所需灵石：
                      <span className="font-semibold">{item.Price}</span>
                    </p>
                    <p>
                      所需修为：
                      <span className="font-semibold">{item.experience}</span>
                    </p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="col-span-full text-white/60">暂无禁地</p>
          )}
        </section>
      </main>
    </HTML>
  )
}

export default SecretPlace
