import React from 'react'
import HTML from './HTML'
import saURL from '@src/resources/styles/help.scss'
import backgroundURL from '@src/resources/img/xiuxian.jpg'
import iconURL from '@src/resources/img/icon.png'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pkg = require('../../../package.json') as {
  name: string
  version: string
}

const Help = ({ helpData = [], page = 1, pageSize, total }) => {
  return (
    <HTML
      className="elem-default default-mode text-[18px] text-brand font-sans min-h-screen"
      style={{
        backgroundImage: `url(${backgroundURL})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top left',
        backgroundSize: '100% 100%',
        fontFamily: 'PingFangSC-Medium, PingFang SC, sans-serif'
      }}
      linkStyleSheets={[saURL]}
    >
      <div className="max-w-[900px] mx-auto px-6 py-10" id="container">
        {/* 顶部标题区域 */}
        <header className="mb-6">
          <div className="relative px-6 py-5 rounded-2xl bg-black/30 backdrop-blur-md ring-1 ring-white/10 shadow-card">
            <h1 className="text-4xl font-bold tracking-wide text-white text-center drop-shadow">
              {pkg.name}
            </h1>
            <span className="absolute top-2 right-4 text-xs text-white/50 select-none">
              v{pkg.version}
            </span>
          </div>
        </header>

        {/* 内容分组 */}
        <main className="space-y-8">
          {helpData.map((val, index) => (
            <section
              key={index}
              className="border border-white/10 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-2xl bg-white/10 backdrop-blur-md overflow-hidden"
            >
              <h2 className="flex items-center justify-between pr-4 text-xl font-semibold tracking-wide text-teal-100 bg-black/30 px-3 py-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-gradient-to-b from-teal-300 to-teal-600 rounded-sm inline-block"></span>
                  {val.group}
                </span>
                {Array.isArray(val.list) && val.list.length > 0 && (
                  <span className="text-xs font-normal text-white/50">
                    {val.list.length} 条
                  </span>
                )}
              </h2>
              <div className="px-1 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                  {val.list?.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="relative pl-[52px] pr-3 py-3 text-left bg-black/20 hover:bg-black/35 transition-colors group border border-transparent hover:border-white/10 rounded-md m-[3px]"
                    >
                      <span
                        className={`${item.icon} ring-1 ring-white/10 shadow-md group-hover:ring-teal-300/60 group-hover:shadow-teal-300/20 transition absolute left-[6px] top-3 scale-[0.85] block rounded`}
                        style={{
                          width: 40,
                          height: 40,
                          backgroundImage: `url(${iconURL})`,
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '500px auto'
                        }}
                      />
                      <strong className="block font-medium text-teal-200 group-hover:text-teal-100">
                        {item.title}
                      </strong>
                      <span className="block text-xs leading-5 text-white/75 group-hover:text-white/90">
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </main>

        {/* 分页 / 提示 */}
        <footer className="mt-12 pt-8 border-t border-white/10">
          <div className="text-center px-2 py-2 text-[15px] sm:text-base md:text-lg leading-relaxed text-white/90 font-medium tracking-wide">
            <span className="inline-flex items-baseline gap-2 bg-black/30 px-4 py-2 rounded-xl shadow-inner shadow-black/40 backdrop-blur-sm">
              <span className="text-white/70 text-sm md:text-base">第</span>
              <b className="text-2xl md:text-3xl text-red-300 drop-shadow-sm font-bold">
                {page}
              </b>
              {typeof total === 'number' && total > 0 ? (
                <>
                  <span className="text-white/50 text-base md:text-lg">/</span>
                  <b className="text-xl md:text-2xl text-red-300 font-bold">
                    {total}
                  </b>
                  <span className="text-white/70 text-sm md:text-base">页</span>
                </>
              ) : (
                <span className="text-white/70 text-sm md:text-base">页</span>
              )}
              {typeof pageSize !== 'undefined' && pageSize ? (
                <span className="ml-1 md:ml-3 text-xs md:text-sm text-red-100/80 font-normal">
                  （每页 {pageSize} 组）
                </span>
              ) : null}
            </span>
            <div className="mt-4 text-red-100/90 text-sm md:text-base font-normal">
              <span className="ml-2 inline-flex gap-2 flex-wrap justify-center">
                <code className="px-2 py-1 rounded-lg bg-red-700/50 text-white text-sm md:text-base shadow ring-1 ring-white/10">
                  翻页：指令后直接加页码
                </code>
              </span>
            </div>
          </div>
          <div className="mt-2 text-center text-[10px] tracking-widest text-white/30 select-none">
            {pkg.name} · v{pkg.version}
          </div>
        </footer>
      </div>
    </HTML>
  )
}

export default Help
