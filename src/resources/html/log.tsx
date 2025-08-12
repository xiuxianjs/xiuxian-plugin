import React from 'react'
import HTML from './HTML'
import najieURL from '@src/resources/img/najie.jpg'

const Log = ({ log }: { log?: string[] }) => {
  return (
    <HTML
      className="min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover"
      style={{ backgroundImage: `url(${najieURL})` }}
    >
      <main className="max-w-3xl mx-auto space-y-4">
        <section className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 md:p-6 shadow-card">
          {log?.length ? (
            log.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="text-white text-base md:text-lg font-mono break-words whitespace-pre-line">
                  {item}
                </div>
                <div className="border-b border-dashed border-white/30 my-2" />
              </div>
            ))
          ) : (
            <p className="text-white/60">暂无日志</p>
          )}
        </section>
      </main>
    </HTML>
  )
}

export default Log
