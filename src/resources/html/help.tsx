import React from 'react'
import HTML from './HTML'
import saURL from '@src/resources/styles/help.scss'
import backgroundURL from '@src/resources/img/xiuxian.jpg'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pkg = require('../../../package.json') as {
  name: string
  version: string
}

// 修仙主题图标映射
const CommandIcons = {
  修仙: '🧘',
  战斗: '⚔️',
  装备: '🗡️',
  丹药: '💊',
  宗门: '🏛️',
  交易: '💰',
  任务: '📜',
  其他: '✨'
}

// 获取命令图标
const getCommandIcon = (title: string) => {
  for (const [key, icon] of Object.entries(CommandIcons)) {
    if (title.includes(key)) return icon
  }
  return '✨'
}

const Help = ({ helpData = [], page = 1, pageSize, total }) => {
  return (
    <HTML
      className="elem-default default-mode text-[18px] text-brand font-sans "
      style={{
        backgroundImage: `url(${backgroundURL})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top left',
        backgroundSize: '100% 100%',
        fontFamily: 'PingFangSC-Medium, PingFang SC, sans-serif'
      }}
      linkStyleSheets={[saURL]}
    >
      {/* 静态背景效果 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 星空粒子效果 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:25px_25px]"></div>

        {/* 静态灵气 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/3 to-transparent"></div>

        {/* 修仙符文装饰 */}
        <div className="absolute top-16 left-16 text-cyan-400/15 text-3xl">
          ☯
        </div>
        <div className="absolute top-32 right-24 text-purple-400/15 text-2xl">
          ⚡
        </div>
        <div className="absolute bottom-32 left-20 text-yellow-400/15 text-2xl">
          🌟
        </div>
        <div className="absolute bottom-16 right-16 text-pink-400/15 text-3xl">
          💫
        </div>
      </div>

      <div
        className="relative z-10 max-w-[1000px] mx-auto px-6 py-10"
        id="container"
      >
        {/* 顶部标题区域 */}
        <header className="mb-8">
          <div className="relative">
            <div className="relative rounded-3xl p-6 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-xl border border-white/20 shadow-2xl">
              {/* 装饰性元素 */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-2 border-cyan-400/50 rounded-full"></div>

              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-2xl mb-2">
                  {pkg.name}
                </h1>
                <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full shadow-lg mb-3"></div>
                <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-200 font-bold shadow-lg">
                  v{pkg.version}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 内容分组 */}
        <main className="space-y-8">
          {helpData.map((val, index) => (
            <section key={index} className="relative">
              <div className="relative rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">
                {/* 装饰性角落 */}
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-teal-400/50 rounded-tr-lg"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-teal-400/50 rounded-bl-lg"></div>

                <h2 className="flex items-center justify-between pr-6 text-xl font-bold tracking-wide text-teal-100 bg-gradient-to-r from-black/40 to-black/60 px-4 py-3 border-b border-white/10">
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-6 bg-gradient-to-b from-teal-300 to-teal-600 rounded-sm shadow-lg"></span>
                    <span className="text-2xl mr-2">📚</span>
                    {val.group}
                  </span>
                  {Array.isArray(val.list) && val.list.length > 0 && (
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/30 text-teal-200 text-sm font-medium shadow-inner">
                      {val.list.length} 条
                    </span>
                  )}
                </h2>

                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {val.list?.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="relative p-4 rounded-xl bg-gradient-to-br from-black/20 to-black/30 border border-white/10"
                      >
                        {/* 装饰性光效 */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-teal-500/5 to-transparent"></div>

                        <div className="relative flex items-start gap-3">
                          {/* 图标区域 */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-400/30 flex items-center justify-center shadow-lg">
                              <span className="text-2xl">
                                {getCommandIcon(item.title)}
                              </span>
                            </div>
                          </div>

                          {/* 内容区域 */}
                          <div className="flex-1 min-w-0">
                            <strong className="block font-bold text-slate-800 mb-1">
                              {item.title}
                            </strong>
                            <span className="block text-sm leading-relaxed text-gray-600">
                              {item.desc}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </main>

        {/* 分页 / 提示 */}
        <footer className="mt-8">
          <div className="relative">
            <div className="relative rounded-2xl p-6 bg-gradient-to-br from-black/30 to-black/50 backdrop-blur-xl border border-white/20 shadow-xl">
              {/* 装饰性元素 */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-2 border-red-400/50 rounded-full"></div>

              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-yellow-500/20 px-6 py-3 rounded-2xl shadow-inner border border-red-400/30 backdrop-blur-sm">
                  <span className="text-white/70 text-sm md:text-base font-medium">
                    第
                  </span>
                  <b className="text-3xl md:text-4xl text-red-300 drop-shadow-lg font-black">
                    {page}
                  </b>
                  {typeof total === 'number' && total > 0 ? (
                    <>
                      <span className="text-white/50 text-lg md:text-xl">
                        /
                      </span>
                      <b className="text-2xl md:text-3xl text-red-300 font-black">
                        {total}
                      </b>
                      <span className="text-white/70 text-sm md:text-base font-medium">
                        页
                      </span>
                    </>
                  ) : (
                    <span className="text-white/70 text-sm md:text-base font-medium">
                      页
                    </span>
                  )}
                  {typeof pageSize !== 'undefined' && pageSize ? (
                    <span className="ml-3 text-xs md:text-sm text-red-200/80 font-normal">
                      （每页 {pageSize} 组）
                    </span>
                  ) : null}
                </div>

                <div className="mt-6">
                  <div className="inline-flex items-center shadow-inner gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600/30 to-red-700/30 border border-red-400/20 ">
                    <span className="text-red-200/90  text-sm md:text-base font-medium">
                      翻页： 指令后直接加页码
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </HTML>
  )
}

export default Help
