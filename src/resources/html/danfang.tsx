import React from 'react'
import HTML from './HTML'
import danfangURL from '@src/resources/img/fairyrealm.jpg'
import user_stateURL from '@src/resources/img/user_state.png'

interface Material {
  name: string
  amount: number | string
}
interface DanfangItem {
  type: string
  name: string
  rate: number
  level_limit: number | string
  HP?: number | string
  exp2?: number | string
  materials?: Material[]
}

const Danfang = ({ danfang_list }: { danfang_list?: DanfangItem[] }) => {
  const renderItemInfo = (item: DanfangItem) => {
    switch (item.type) {
      case '血量':
        return item.HP
      case '修为':
        return item.exp2
      case '血气':
        return item.exp2
      default:
        return ''
    }
  }

  return (
    <HTML
      className="min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover"
      style={{ backgroundImage: `url(${danfangURL})` }}
    >
      <main className="max-w-6xl mx-auto space-y-10">
        <header className="space-y-3">
          <div
            className="mx-auto w-56 h-56 rounded-full bg-cover bg-center ring-4 ring-white/30 shadow-card"
            style={{ backgroundImage: `url(${user_stateURL})` }}
          />
          <h1 className="inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow">
            丹方
          </h1>
          <p className="text-white/70 text-sm md:text-base">
            炼制指令：#炼制+丹药名
          </p>
          <p className="text-white/60 text-xs md:text-sm">
            炼制成功率 = 丹方成功率 + 玩家职业等级成功率
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {danfang_list?.map((item, index) => {
            const ratePercent = Math.floor(item.rate * 100)
            return (
              <article
                key={index}
                className="group rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 flex flex-col gap-3 shadow-card hover:ring-brand-accent hover:bg-white/10 transition"
              >
                <header className="space-y-1">
                  <h2 className="text-lg font-semibold text-white tracking-wide">
                    <span className="text-brand-accent">【{item.type}】</span>
                    {item.name}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <span className="px-2 py-0.5 rounded-full bg-brand-dark/60 text-brand-accent font-medium shadow">
                      {ratePercent}%
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-accent/20 text-brand-accent font-medium shadow">
                      lv.{item.level_limit}
                    </span>
                  </div>
                </header>
                <div className="text-sm text-white/90 font-medium">
                  {item.type}：
                  <span className="text-brand-accent font-semibold">
                    {renderItemInfo(item)}
                  </span>
                </div>
                <div className="mt-auto space-y-2">
                  <h3 className="text-sm font-semibold text-white/80 tracking-wide">
                    配方
                  </h3>
                  <ul className="space-y-1 max-h-40 overflow-auto pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    {item.materials?.map((m, mi) => (
                      <li
                        key={mi}
                        className="flex justify-between gap-4 text-xs md:text-sm text-white/80 bg-white/5 rounded px-2 py-1"
                      >
                        <span className="truncate" title={m.name}>
                          {m.name}
                        </span>
                        <span className="text-brand-accent font-semibold">
                          ×{m.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            )
          }) || <p className="col-span-full text-white/60">暂无丹方</p>}
        </section>
      </main>
    </HTML>
  )
}

export default Danfang
