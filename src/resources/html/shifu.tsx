import React from 'react'
import cssURL from '@src/resources/styles/tw.scss'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import { LinkStyleSheet } from 'jsxp'
import playerURL from '@src/resources/img/player.jpg'

const Shifu = ({
  user_id,
  minghao,
  renwu,
  tudinum,
  shifu,
  shimen,
  rw1,
  wancheng1,
  rw2,
  wancheng2,
  rw3,
  wancheng3,
  chengyuan
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
          className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8"
          style={{
            backgroundImage: `url('${playerURL}')`,
            backgroundSize: 'cover'
          }}
        >
          <div className="w-full max-w-2xl mx-auto">
            {/* 顶部信息 */}
            <div className="flex flex-row items-center gap-6 mb-6">
              <div className="flex flex-col items-center">
                <img
                  className="w-28 h-28 rounded-full shadow-lg border-4 border-white/30 mb-2"
                  src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`}
                  alt="头像"
                />
                <div className="text-sm text-gray-700">QQ:{user_id}</div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-base text-blue-800 font-bold">
                  名号: {minghao}
                </div>
                <div className="text-base text-gray-700">任务阶段: {renwu}</div>
                <div className="text-base text-gray-700">
                  师门人数: {tudinum}
                </div>
                <div className="text-base text-gray-700">师傅: {shifu}</div>
                <div className="text-base text-green-700">
                  师徒积分：{shimen}
                </div>
              </div>
            </div>
            {/* 师徒任务 */}
            <div className="rounded-xl shadow-lg bg-white/80 p-6 mb-6 flex flex-col items-center">
              <div className="text-xl font-bold text-blue-700 mb-2">
                [师徒任务]
              </div>
              <div className="w-full flex flex-col gap-2">
                <div className="text-base text-gray-700">任务1：</div>
                <div className="text-base text-gray-800">
                  {rw1} {wancheng1}
                </div>
                <div className="text-base text-gray-700">任务2：</div>
                <div className="text-base text-gray-800">
                  {rw2} {wancheng2}
                </div>
                <div className="text-base text-gray-700">任务3：</div>
                <div className="text-base text-gray-800">
                  {rw3} {wancheng3}
                </div>
              </div>
            </div>
            {/* 同门弟子 */}
            <div className="rounded-xl shadow-lg bg-white/80 p-6 mb-6 flex flex-col items-center">
              <div className="text-xl font-bold text-blue-700 mb-2">
                [同门弟子]
              </div>
              <div className="w-full flex flex-wrap gap-2">
                {chengyuan?.map((item, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-900 rounded px-3 py-1 text-sm font-semibold"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

export default Shifu
