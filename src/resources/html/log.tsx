import React from 'react'
import HTML from './HTML'
import najieURL from '@src/resources/img/najie.jpg'

const Log = ({ log }: { log?: string[] }) => {
  return (
    <HTML
      className="min-h-screen w-full bg-top bg-cover relative p-4 md:p-8"
      style={{ backgroundImage: `url(${najieURL})` }}
    >
      {/* 背景遮罩渐变，防止文字与背景冲突 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none"></div>

      <main className="relative max-w-3xl mx-auto space-y-6 z-10">
        <section className="rounded-3xl bg-white/10 backdrop-blur-lg ring-1 ring-white/20 p-6 md:p-8 shadow-lg">
          {log?.length ? (
            log.map((item, index) => (
              <div
                key={index}
                className="mb-6 last:mb-0 bg-white/20 rounded-lg p-4 shadow-md"
              >
                <div className="text-base md:text-lg font-mono leading-relaxed text-gray-100 break-words whitespace-pre-line">
                  {item}
                </div>
                {index !== log.length - 1 && (
                  <hr className="border-t border-dashed border-white/30 mt-4" />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-300 text-lg font-semibold pt-10">
              暂无日志
            </p>
          )}
        </section>
      </main>
    </HTML>
  )
}

export default Log
