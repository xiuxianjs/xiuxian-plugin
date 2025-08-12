import React from 'react'
import cssURL from '@src/resources/styles/tw.scss'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import stateURL from '@src/resources/img/state.jpg'
import user_stateURL from '@src/resources/img/user_state2.png'
import { LinkStyleSheet } from 'jsxp'

/**
 * @param param0
 * @returns
 */
const Ranking = ({
  user_id,
  messages = [],
  title,
  values
}: {
  user_id?: string
  messages?: React.ReactNode
  title?: string
  values?: React.ReactNode[]
}) => {
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
      <body>
        <div
          className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
          style={{ backgroundImage: `url('${stateURL}')` }}
        >
          <div className="h-16 w-full"></div>
          {user_id && (
            <div className="flex justify-center px-5 text-white w-full max-w-3xl">
              <div className="relative flex items-center justify-center">
                <div className="p-6">
                  <img
                    className="w-40 h-40 rounded-full shadow-xl border-4 border-white/30 backdrop-blur-lg bg-white/20"
                    src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`}
                    alt="头像"
                  />
                </div>
                <img
                  className="w-52 h-52 rounded-full absolute"
                  src={user_stateURL}
                  alt="状态"
                />
              </div>
              <div className="ml-6 flex-1 px-6 py-4 rounded-2xl shadow-2xl border border-white/30 bg-white/30 backdrop-blur-xl text-white">
                <div className="flex flex-col gap-2">{messages}</div>
              </div>
            </div>
          )}
          <div className="w-full max-w-3xl flex flex-col items-center mt-8 px-5 gap-2 text-white">
            <div className="border rounded-t-md w-full flex justify-center bg-white/30 backdrop-blur-xl shadow">
              <span className="text-2xl font-extrabold text-blue-900">
                {title}
              </span>
            </div>
            {values && values.length > 0 ? (
              <div className="w-full flex flex-col gap-6">
                {values.map((item, index) => (
                  <div
                    key={index}
                    className="backdrop-blur-xl shadow-lg border border-white/30 p-5 flex gap-2 items-start transition-transform duration-200 bg-white/40 rounded-xl"
                  >
                    {item}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="h-16 w-full"></div>
        </div>
      </body>
    </html>
  )
}

export default Ranking
