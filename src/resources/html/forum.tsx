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
      className="w-full text-center p-4 md:p-8 bg-top bg-cover min-h-screen"
      style={{ backgroundImage: `url(${supermarketURL})` }}
    >
      {/* 星空粒子层 */}
      <div
        className="absolute inset-0 pointer-events-none 
        bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] 
        bg-[length:18px_18px]"
      />

      {/* 轻微渐变遮罩提升对比度 */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-sky-800/20 to-transparent" />

      <main className="relative z-10 max-w-6xl mx-auto space-y-12">
        {/* 标题 */}
        <header className="space-y-6 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/30 to-cyan-400/30 rounded-3xl blur-xl"></div>
            <h1
              className="relative inline-block px-10 py-4 rounded-3xl 
              bg-gradient-to-r from-sky-400/60 via-cyan-300/50 to-sky-400/60 
              backdrop-blur-xl border-2 border-sky-300/50 
              text-3xl md:text-4xl font-extrabold tracking-widest shadow-2xl ring-2 ring-sky-200/60"
            >
              <span className="bg-gradient-to-r from-sky-100 to-cyan-100 bg-clip-text text-transparent">
                聚宝堂
              </span>
            </h1>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-cyan-500/10 rounded-2xl blur-lg"></div>
            <div className="relative px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-sky-200/30 text-sky-100/90 text-xs md:text-sm space-y-2 drop-shadow">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sky-300">📜</span>
                <span>发布指令：#发布+物品名*价格*数量</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sky-300">🤝</span>
                <span>接取指令：#接取+编号*数量</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sky-300">❌</span>
                <span>取消指令：#取消+编号</span>
              </div>
            </div>
          </div>
        </header>

        {/* 卡片区 */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-600/5 to-cyan-600/5 rounded-3xl blur-2xl"></div>
          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {forumData?.length ? (
              forumData.map((item, index) => (
                <article
                  key={index}
                  className="relative rounded-2xl p-6 flex flex-col gap-3
                    bg-white/15 backdrop-blur-xl border border-sky-200/40
                    shadow-xl overflow-hidden"
                >
                  {/* 顶部光带 */}
                  <div
                    className="absolute top-0 left-0 w-full h-1 
                    bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 shadow-md"
                  />

                  {/* 右上角装饰 */}
                  <div className="absolute top-3 right-3 w-3 h-3 bg-cyan-400/50 rounded-full"></div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sky-300 text-lg">🏪</span>
                      <h2 className="text-lg font-bold tracking-wide text-cyan-100 drop-shadow">
                        【{item.class}】{item.name}
                      </h2>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-sky-100/90">
                        <span className="text-sky-300">🆔</span>
                        <span>编号：</span>
                        <span className="font-semibold text-indigo-200">
                          No.{item.num}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sky-100/90">
                        <span className="text-amber-300">💰</span>
                        <span>单价：</span>
                        <span className="font-semibold text-amber-200">
                          {item.price}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sky-100/90">
                        <span className="text-emerald-300">📦</span>
                        <span>数量：</span>
                        <span className="font-semibold text-emerald-200">
                          {item.aconut}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sky-100/90">
                        <span className="text-orange-300">🪙</span>
                        <span>总价：</span>
                        <span className="font-semibold text-orange-200">
                          {item.whole}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sky-100/90">
                        <span className="text-cyan-300">✉</span>
                        <span>账号：</span>
                        <span className="font-semibold text-cyan-200">
                          {item.qq}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-600/10 to-cyan-600/10 rounded-2xl blur-xl"></div>
                <div
                  className="relative px-8 py-6 rounded-2xl 
                  border border-sky-200/40 bg-white/10 
                  text-sky-100/80 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-sky-300 text-xl">📭</span>
                    <span className="text-lg font-semibold">暂无发布</span>
                    <span className="text-sky-300 text-xl">📭</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 底部装饰 */}
        <div className="flex justify-center space-x-4 pt-8">
          <div className="w-16 h-1 bg-gradient-to-r from-sky-400/50 to-transparent rounded-full"></div>
          <div className="w-8 h-8 bg-gradient-to-br from-sky-400/30 to-cyan-400/30 rounded-full flex items-center justify-center">
            <span className="text-white/70 text-sm">💎</span>
          </div>
          <div className="w-16 h-1 bg-gradient-to-l from-cyan-400/50 to-transparent rounded-full"></div>
        </div>
      </main>
    </HTML>
  )
}

export default Forum
