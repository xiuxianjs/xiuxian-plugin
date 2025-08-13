import React from 'react'
import HTML from './HTML'
import celestialSectsURL from '@src/resources/img/fairyrealm.jpg'

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

/**
 * ZongMeng (宗门列表) Component
 * A beautifully redesigned component to display a list of sects in a Xianxia game.
 * Design Concept: "Celestial Jade Steles" floating in a starry realm.
 */
const ZongMeng = ({ temp }: { temp?: ZongMengItem[] }) => {
  const data = temp || []
  return (
    <HTML
      className="w-full text-white/90 p-6 bg-center bg-cover font-serif"
      style={{ backgroundImage: `url(${celestialSectsURL})` }}
    >
      {/* 整体背景与布局 */}
      <div className="bg-white bg-opacity-30 p-2 rounded-md backdrop-blur-sm">
        <main className="max-w-6xl mx-auto space-y-8">
          {/* 顶栏标题 - 如同天宫牌匾 */}
          <header className="flex flex-col items-center text-center">
            <h1
              className="px-8 py-3 rounded-lg bg-black/30 backdrop-blur-md text-3xl md:text-4xl font-bold tracking-widest text-amber-200"
              style={{ textShadow: '0 2px 8px rgba(252, 211, 77, 0.5)' }}
            >
              仙门百家
            </h1>
            <p className="mt-2 text-base text-sky-800/80">
              于此方天地，寻觅汝之道途
            </p>
          </header>

          {/* 宗门卡片网格 */}
          <section className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.length ? (
              data.map((item, index) => (
                // 卡片设计: "星玉石碑"
                <article
                  key={index}
                  className="flex flex-col rounded-xl bg-slate-900/60 backdrop-blur-lg border border-sky-500/30 transition-all duration-300 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-2"
                >
                  {/* 卡片头部: 宗名与等级徽章 */}
                  <header className="p-4 border-b border-sky-500/20 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-amber-100 tracking-wider">
                      {item.宗名}
                    </h2>
                    <span className="px-3 py-1 text-sm font-bold bg-sky-800/80 border border-sky-600 rounded-md text-sky-200">
                      Lv.{item.等级}
                    </span>
                  </header>

                  {/* 卡片主体: 核心信息 */}
                  <div className="p-4 space-y-3 text-sm flex-grow">
                    <div className="flex items-center gap-3">
                      <span className="text-sky-300 w-20 shrink-0">
                        {' '}
                        {/* Icon Placeholder */} 仙盟人数:
                      </span>
                      <span className="font-semibold text-white">
                        {item.人数} / {item.宗门人数上限}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sky-300 w-20 shrink-0">
                        {' '}
                        {/* Icon Placeholder */} 天赋加成:
                      </span>
                      <span className="font-semibold text-green-300">
                        {item.天赋加成}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sky-300 w-20 shrink-0">
                        {' '}
                        {/* Icon Placeholder */} 镇宗神兽:
                      </span>
                      <span className="font-semibold text-white">
                        {item.镇宗神兽}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sky-300 w-20 shrink-0">
                        {' '}
                        {/* Icon Placeholder */} 宗门驻地:
                      </span>
                      <span className="font-semibold text-white">
                        {item.宗门驻地}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sky-300 w-20 shrink-0">
                        {' '}
                        {/* Icon Placeholder */} 加入门槛:
                      </span>
                      <span className="font-semibold text-red-300">
                        {item.最低加入境界}
                      </span>
                    </div>
                  </div>

                  {/* 卡片底部: 宗主印章 */}
                  <footer className="mt-auto p-3 bg-slate-950/50 rounded-b-xl border-t border-sky-500/20 flex items-center justify-between">
                    <span className="text-xs text-sky-300/80">宗主法谕</span>
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${item.宗主}`}
                        alt="宗主头像"
                        className="w-6 h-6 rounded-full border border-amber-300/50"
                      />
                      <span className="font-mono text-amber-200 text-sm">
                        {item.宗主}
                      </span>
                    </div>
                  </footer>
                </article>
              ))
            ) : (
              <p className="col-span-full text-center text-sky-200/70 text-lg">
                混沌未开，暂无仙门
              </p>
            )}
          </section>
        </main>
      </div>
    </HTML>
  )
}

export default ZongMeng
