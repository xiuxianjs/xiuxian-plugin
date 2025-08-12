import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from '@src/resources/styles/tw.scss'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import najieURL from '@src/resources/img/najie.jpg'

const Log = ({ log }: { log?: string[] }) => {
  return (
    <html>
      <head>
        <LinkStyleSheet src={cssURL} />
        <meta httpEquiv="content-type" content="text/html;charset=utf-8" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face { font-family: 'tttgbnumber'; src: url('${tttgbnumberURL}'); font-weight: normal; font-style: normal; }
              body { font-family: 'tttgbnumber', system-ui, sans-serif; }
            `
          }}
        />
      </head>
      <body
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
      </body>
    </html>
  )
}

export default Log
