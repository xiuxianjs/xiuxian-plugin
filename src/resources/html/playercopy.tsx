import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from '@src/resources/styles/tw.scss'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'

import playerURL from '@src/resources/img/player.jpg'
import playerFooterURL from '@src/resources/img/player_footer.png'
import userStateURL from '@src/resources/img/user_state.png'

const PlayerCopy = ({
  user_id,
  nickname,
  player_nowHP,
  player_maxHP,
  levelMax,
  xueqi,
  need_xueqi,
  lingshi,
  association,
  learned_gongfa
}) => {
  return (
    <html lang="zh-CN">
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
          style={{
            backgroundImage: `url('${playerURL}'), url('${playerFooterURL}')`
          }}
        >
          {/* 头部 */}
          <div className="w-full max-w-3xl mx-auto mt-8">
            <div className="flex gap-8 items-center">
              <div className="relative flex flex-col items-center">
                <div
                  className="w-56 h-56 rounded-full bg-cover bg-center flex items-center justify-center"
                  style={{ backgroundImage: `url('${userStateURL}')` }}
                >
                  <img
                    className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
                    src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`}
                    alt="头像"
                  />
                </div>
                <div className="mt-2 text-lg font-bold text-blue-900">
                  QQ: {user_id}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2 text-gray-800">
                <div className="font-bold text-xl">道号：{nickname}</div>
                <div className="text-base">
                  生命：{player_nowHP} / {player_maxHP}
                </div>
                <div className="text-base">体境：{levelMax}</div>
                <div className="text-base">
                  气血：{xueqi} / {need_xueqi}
                </div>
                <div className="text-base">灵石：{lingshi}</div>
              </div>
            </div>
            {/* 宗门信息 */}
            <div className="mt-8 bg-white/80 rounded-xl shadow-lg p-6">
              <div className="text-lg font-bold text-blue-700 mb-4">
                [我的宗门]
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="font-semibold">
                  宗门名称：{association?.宗门名称 || '无'}
                </div>
                <div className="font-semibold">
                  职位：{association?.职位 || '无'}
                </div>
              </div>
            </div>
            {/* 已学功法 */}
            <div className="mt-8 bg-white/80 rounded-xl shadow-lg p-6">
              <div className="text-lg font-bold text-blue-700 mb-4">
                [已学功法]
              </div>
              <div className="flex flex-wrap gap-2">
                {learned_gongfa?.length > 0 ? (
                  learned_gongfa.map((item, index) => (
                    <div
                      key={index}
                      className="px-2 py-1 bg-blue-100 rounded text-blue-900"
                    >
                      《{item}》
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">暂无功法</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

export default PlayerCopy
