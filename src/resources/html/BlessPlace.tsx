import React from 'react'
import secretPlaceURL from '@src/resources/img/fairyrealm.jpg'
import cardURL from '@src/resources/img/road.jpg'
import HTML from './HTML'

interface BlessPlaceItem {
  ass?: string
  name: string
  level: string | number
  efficiency: string | number
}

const SecretPlace = ({ didian_list }: { didian_list?: BlessPlaceItem[] }) => {
  return (
    <HTML
      className=" w-full text-center p-4 md:p-8 bg-top bg-cover relative text-white"
      style={{ backgroundImage: `url(${secretPlaceURL})` }}
    >
      {/* 背景渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/20 backdrop-blur-[2px] pointer-events-none"></div>

      <main className="relative max-w-5xl mx-auto space-y-8">
        <header className="space-y-4 flex flex-col items-center">
          <h1
            className="inline-block px-8 py-2 rounded-2xl bg-white/30 backdrop-blur-md 
            text-2xl md:text-3xl font-bold tracking-widest shadow-lg border border-white/40
            text-blue-900 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
          >
            洞天福地
          </h1>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {didian_list?.map((item, index) => (
            <article
              key={index}
              className="relative group rounded-2xl overflow-hidden bg-[length:100%_100%] bg-center 
              shadow-lg ring-1 ring-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              style={{ backgroundImage: `url(${cardURL})` }}
            >
              {/* 背景遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40 group-hover:from-black/20 group-hover:to-black/30 transition-colors"></div>

              <div className="relative z-10 p-4 md:p-5 flex flex-col h-full justify-between">
                <header className="space-y-1">
                  <h2 className="text-lg font-semibold tracking-wide drop-shadow-md">
                    {item.name}
                    <span className="block text-sm font-medium text-blue-100/90">
                      【入驻宗门: {item.ass || '-'}】
                    </span>
                  </h2>
                </header>

                <div className="mt-4 space-y-2 text-sm md:text-base font-medium">
                  <p className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/30 border border-white/20">
                      福地等级
                    </span>
                    <span className="font-semibold">{item.level}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-400/30 border border-white/20">
                      修炼效率
                    </span>
                    <span className="font-semibold">{item.efficiency}</span>
                  </p>
                </div>
              </div>
            </article>
          )) || <p className="col-span-full text-blue-900/60">暂无数据</p>}
        </section>
      </main>
    </HTML>
  )
}

export default SecretPlace
