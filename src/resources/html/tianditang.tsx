import React from 'react'
import cssURL from '@src/resources/styles/tw.scss'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import { LinkStyleSheet } from 'jsxp'
import ningmenghomeURL from '@src/resources/img/fairyrealm.jpg'

const TianDiTang = ({ name, jifen, commodities_list }) => {
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
            backgroundImage: `url('${ningmenghomeURL}')`,
            backgroundSize: 'cover'
          }}
        >
          <div className="w-full max-w-2xl mx-auto">
            <div className="rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center">
              <div className="text-2xl font-bold text-blue-700 mb-2">
                天地堂
              </div>
              <div className="text-base text-gray-600 mb-1">
                购买指令：#积分兑换+物品名
              </div>
              <div className="text-base text-gray-600 mb-1">
                每周日开放物品兑换
              </div>
              <div className="text-base text-green-600 mb-4">
                {name}的积分：{jifen}
              </div>
              <div className="w-full">
                {commodities_list &&
                  commodities_list.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition mb-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-blue-800 text-lg">
                          【{item.type}】{item.name}
                        </span>
                        <span className="text-sm text-green-700">
                          {item.积分}积分
                        </span>
                      </div>
                      {item.class === '装备' && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="inline-block bg-blue-200 text-blue-900 rounded px-2 py-1 text-xs font-semibold">
                            攻：{item.atk}
                          </span>
                          <span className="inline-block bg-green-200 text-green-900 rounded px-2 py-1 text-xs font-semibold">
                            防：{item.def}
                          </span>
                          <span className="inline-block bg-yellow-200 text-yellow-900 rounded px-2 py-1 text-xs font-semibold">
                            血：{item.HP}
                          </span>
                          <span className="inline-block bg-pink-200 text-pink-900 rounded px-2 py-1 text-xs font-semibold">
                            暴：{item.bao * 100}%
                          </span>
                        </div>
                      )}
                      {item.class === '丹药' && (
                        <div className="text-sm text-gray-700 mb-2">
                          效果：{item.exp}
                          {item.xueqi}
                        </div>
                      )}
                      {item.class === '功法' && (
                        <div className="text-sm text-gray-700 mb-2">
                          修炼加成：{(item.修炼加成 * 100).toFixed(0)}%
                        </div>
                      )}
                      {(item.class === '道具' || item.class === '草药') && (
                        <div className="text-sm text-gray-700 mb-2">
                          描述：{item.desc}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

export default TianDiTang
