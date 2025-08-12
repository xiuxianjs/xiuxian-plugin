import React from 'react'
import cssURL from '@src/resources/styles/tw.scss'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import valuablesTopURL from '@src/resources/img/valuables-top.jpg'
import valuablesDanyaoURL from '@src/resources/img/valuables-danyao.jpg'
import { LinkStyleSheet } from 'jsxp'

// 楼层数据
const floors = [
  { name: '#功法楼', type: '功法' },
  { name: '#丹药楼', type: '丹药' },
  { name: '#装备楼', type: '装备' },
  { name: '#道具楼', type: '道具' },
  { name: '#仙宠楼', type: '仙宠' }
]

// 楼层组件
const FloorSection = ({ name, type }: { name: string; type: string }) => (
  <div className="rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center">
    <div className="text-xl font-bold text-blue-700 mb-2">{name}</div>
    <div className="text-base text-gray-600 mb-1">类型: {type}</div>
    <div className="text-base text-green-600">查看全部{type}价格</div>
  </div>
)

const Valuables = () => {
  // ...existing code...

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
        <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 flex flex-col items-center py-6">
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-3xl font-bold text-yellow-700 mb-6 text-center drop-shadow">
              #万宝楼
            </div>
            {/* 头部图片 */}
            <div
              className="w-full h-64 rounded-xl mb-6 bg-cover bg-center"
              style={{ backgroundImage: `url('${valuablesTopURL}')` }}
            ></div>
            {/* 介绍区域 */}
            <div className="rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center">
              <div className="text-xl font-bold text-blue-700 mb-2">
                修仙界最大的当铺
              </div>
              <div className="text-base text-gray-600 mb-1">
                汇聚天下所有物品
              </div>
              <div className="text-base text-green-600">
                快去秘境历练获得神器吧
              </div>
            </div>
            {/* 动态渲染楼层 */}
            {floors.map((floor, index) => (
              <FloorSection key={index} name={floor.name} type={floor.type} />
            ))}
            {/* 底部图片 */}
            <div
              className="w-full h-32 rounded-xl mt-6 bg-cover bg-center"
              style={{ backgroundImage: `url('${valuablesDanyaoURL}')` }}
            ></div>
          </div>
        </div>
      </body>
    </html>
  )
}

export default Valuables
