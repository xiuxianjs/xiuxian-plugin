import { BackgroundImage, LinkStyleSheet } from 'jsxp'
import React from 'react'
import tailwindcssURL from './tailwindcss.css'
import stateURL from '@src/resources/img/state.jpg'
import user_stateURL from '@src/resources/img/user_state2.png'

/**
 *
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
        <LinkStyleSheet src={tailwindcssURL} />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .liquid-glass {
      position: relative;
      background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(200,220,255,0.3) 100%);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 1.5px 8px 0 rgba(0, 255, 255, 0.15);
      border: 1.5px solid rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(8px) saturate(180%);
      overflow: hidden;
    }
          }
          `
          }}
        />
      </head>
      <body className="p-0 m-0">
        <BackgroundImage src={stateURL}>
          <div className="h-16 w-full"></div>
          {user_id && (
            <div className="flex justify-center px-5 text-white ">
              <div className="relative flex items-center justify-center">
                <div className="p-6">
                  <img
                    className="size-40 rounded-full shadow-xl border-4 border-white/30 backdrop-blur-lg bg-white/20"
                    src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`}
                    alt="头像"
                  />
                </div>
                <img
                  className="size-52 rounded-full absolute"
                  src={user_stateURL}
                  alt="状态"
                />
              </div>
              <div className="liquid-glass text-white ml-6 flex-1 px-6 py-4 rounded-2xl shadow-2xl border border-white/30 bg-white/30 backdrop-blur-xl">
                <div className="flex flex-col gap-2">{messages}</div>
              </div>
            </div>
          )}
          <div className="w-full flex flex-col items-center mt-8 px-5 gap-2 text-white ">
            <div className="liquid-glass border rounded-t-md w-full flex justify-center">
              <span className="text-2xl  font-extrabold ">{title}</span>
            </div>
            {values && values.length > 0 ? (
              <div className="w-full flex flex-col gap-6">
                {values.map((item, index) => (
                  <div
                    key={index}
                    className="liquid-glass backdrop-blur-xl shadow-lg border border-white/30 p-5 flex gap-2 items-start transition-transform duration-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="h-16 w-full"></div>
        </BackgroundImage>
      </body>
    </html>
  )
}

export default Ranking
