import React from 'react'
import cssURL from '@src/resources/styles/tw.scss'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import { LinkStyleSheet } from 'jsxp'
const XianChong = ({ nickname, XianChong_have, XianChong_need, Kouliang }) => {
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
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-6">
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-2xl font-bold text-blue-700 mb-6 text-center drop-shadow">
              {nickname}的仙宠
            </div>

            {XianChong_have && XianChong_have.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="text-lg font-semibold text-green-600 mb-2">
                  【已拥有】
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {XianChong_have.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="font-bold text-blue-800 text-lg mb-2">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-700">
                        类型：{item.type}
                      </div>
                      <div className="text-sm text-gray-700">
                        初始加成：{item.初始加成 * 100}%
                      </div>
                      <div className="text-sm text-gray-700">
                        每级增加：{item.每级增加 * 100}%
                      </div>
                      <div className="text-sm text-gray-700">
                        加成：{item.加成 * 100}%
                      </div>
                      <div className="text-sm text-gray-700">
                        灵魂绑定：{item.灵魂绑定 === 0 ? '否' : '是'}
                      </div>
                      <div className="text-sm text-gray-700">
                        品级：{item.品级}
                      </div>
                      <div className="text-sm text-gray-700">
                        等级上限：{item.等级上限}
                      </div>
                      <div className="text-sm text-gray-700">
                        价格：{item.出售价}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {XianChong_need && XianChong_need.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="text-lg font-semibold text-red-600 mb-2">
                  【未拥有】
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {XianChong_need.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="font-bold text-blue-800 text-lg mb-2">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-700">
                        类型：{item.type}
                      </div>
                      <div className="text-sm text-gray-700">
                        初始加成：{item.初始加成 * 100}%
                      </div>
                      <div className="text-sm text-gray-700">
                        每级增加：{item.每级增加 * 100}%
                      </div>
                      <div className="text-sm text-gray-700">
                        加成：{item.加成 * 100}%
                      </div>
                      <div className="text-sm text-gray-700">
                        灵魂绑定：{item.灵魂绑定 === 0 ? '否' : '是'}
                      </div>
                      <div className="text-sm text-gray-700">
                        品级：{item.品级}
                      </div>
                      <div className="text-sm text-gray-700">
                        等级上限：{item.等级上限}
                      </div>
                      <div className="text-sm text-gray-700">
                        价格：{item.出售价}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="text-lg font-semibold text-yellow-600 mb-2">
                【口粮图鉴】
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Kouliang &&
                  Kouliang.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="font-bold text-blue-800 text-lg mb-2">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-700">
                        等级：{item.level}
                      </div>
                      <div className="text-sm text-gray-700">
                        价格：{item.出售价.toFixed(0)}
                      </div>
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

export default XianChong
