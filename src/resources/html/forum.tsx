import React from 'react'
import HTML from './HTML'
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
    <HTML
      className="min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover relative"
      style={{ backgroundImage: `url(${supermarketURL})` }}
    >
      {/* 星空粒子层 */}
      <div
        className="absolute inset-0 pointer-events-none 
        bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] 
        bg-[length:18px_18px] animate-pulse"
      />

      {/* 轻微渐变遮罩提升对比度 */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-sky-800/20 to-transparent" />

      <main className="relative z-10 max-w-5xl mx-auto space-y-10">
        {/* 标题 */}
        <header className="space-y-4 flex flex-col items-center">
          <h1
            className="inline-block px-10 py-3 rounded-3xl 
              bg-gradient-to-r from-sky-400/50 via-cyan-300/40 to-sky-400/50 
              backdrop-blur-lg border border-sky-300/40 
              text-3xl md:text-4xl font-extrabold tracking-widest shadow-lg ring-1 ring-sky-200/60"
          >
            聚宝堂
          </h1>
          <div className="text-sky-100/80 text-xs md:text-sm space-y-1 drop-shadow">
            <div>📜 发布指令：#发布+物品名*价格*数量</div>
            <div>🤝 接取指令：#接取+编号*数量</div>
            <div>❌ 取消指令：#取消+编号</div>
          </div>
        </header>

        {/* 卡片区 */}
        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {forumData?.length ? (
            forumData.map((item, index) => (
              <article
                key={index}
                className="relative rounded-2xl p-5 flex flex-col gap-2
                  bg-sky-900/50 backdrop-blur-lg border border-sky-200/30
                  shadow-lg hover:shadow-cyan-400/40 hover:scale-[1.03]
                  transition-all duration-300 overflow-hidden"
              >
                {/* 顶部光带 */}
                <div
                  className="absolute top-0 left-0 w-full h-[3px] 
                  bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 shadow-md"
                />

                <h2 className="text-lg font-bold tracking-wide text-cyan-200 drop-shadow">
                  【{item.class}】{item.name}
                </h2>
                <div className="text-sm text-sky-100/80">
                  🆔 编号：
                  <span className="font-semibold text-indigo-300">
                    No.{item.num}
                  </span>
                </div>
                <div className="text-sm text-sky-100/80">
                  💰 单价：
                  <span className="font-semibold text-amber-300">
                    {item.price}
                  </span>
                </div>
                <div className="text-sm text-sky-100/80">
                  📦 数量：
                  <span className="font-semibold text-emerald-300">
                    {item.aconut}
                  </span>
                </div>
                <div className="text-sm text-sky-100/80">
                  🪙 总价：
                  <span className="font-semibold text-orange-300">
                    {item.whole}
                  </span>
                </div>
                <div className="text-sm text-sky-100/80">
                  ✉ QQ：
                  <span className="font-semibold text-cyan-300">{item.qq}</span>
                </div>
              </article>
            ))
          ) : (
            <p
              className="col-span-full px-6 py-3 rounded-xl 
              border border-sky-200/30 bg-sky-900/40 
              text-sky-100/70 backdrop-blur-md"
            >
              暂无发布
            </p>
          )}
        </section>
      </main>
    </HTML>
  )
}

export default Forum
