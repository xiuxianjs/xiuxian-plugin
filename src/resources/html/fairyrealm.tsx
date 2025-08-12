import React from 'react'
import HTML from './HTML'
import fairyrealmBgURL from '@src/resources/img/fairyrealm.jpg'
import cardBgURL from '@src/resources/img/card.jpg'

interface RewardItem {
  name: string
}
interface FairyRealmItem {
  Grade: string
  name: string
  Price: number | string
  one?: RewardItem[]
  two?: RewardItem[]
  three?: RewardItem[]
}

const FairyRealm = ({
  didian_list = []
}: {
  didian_list?: FairyRealmItem[]
}) => {
  return (
    <HTML
      className=" w-full text-center p-4 md:p-8 bg-top bg-cover"
      style={{ backgroundImage: `url(${fairyrealmBgURL})` }}
    >
      <main className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-4 flex flex-col items-center">
          <h1 className="inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest  shadow">
            仙境
          </h1>
          <span className="/70 text-sm md:text-base">
            指令：#镇守仙境+仙境名
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
                  <h2 className="text-lg font-semibold  tracking-wide drop-shadow">
                    <span className="">【{item.Grade}】</span>
                    {item.name}
                  </h2>
                  <div className="text-sm /80 font-medium">
                    <span className=" font-bold">{item.Price}</span> 灵石 +
                    100000 修为
                  </div>
                </header>
                <div className="mt-4 space-y-2 text-sm md:text-base /90 font-medium text-left">
                  <div>
                    <span className="font-semibold ">低级奖励：</span>
                    <ul className="pl-4 space-y-1">
                      {item.one?.map((thing, thingIndex) => (
                        <li key={thingIndex} className="/80">
                          {thing.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold ">中级奖励：</span>
                    <ul className="pl-4 space-y-1">
                      {item.two?.map((thing, thingIndex) => (
                        <li key={thingIndex} className="/80">
                          {thing.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold ">高级奖励：</span>
                    <ul className="pl-4 space-y-1">
                      {item.three?.map((thing, thingIndex) => (
                        <li key={thingIndex} className="/80">
                          {thing.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          )) || <p className="col-span-full /60">暂无仙境</p>}
        </section>
      </main>
    </HTML>
  )
}

export default FairyRealm
