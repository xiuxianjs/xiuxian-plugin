import React from 'react'
import cssURL from '@src/resources/styles/tw.scss'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import { LinkStyleSheet } from 'jsxp'
import backgroundURL from '@src/resources/img/najie.jpg'

const Shop = ({ name, level, state, thing = [] }) => {
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
          className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 flex flex-col items-center py-8"
          style={{
            backgroundImage: `url('${backgroundURL}')`,
            backgroundSize: 'cover'
          }}
        >
          <div className="w-full max-w-2xl mx-auto">
            <div className="rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center">
              <div className="text-2xl font-bold text-yellow-700 mb-2">
                [{name}]
              </div>
              <div className="text-base text-gray-600 mb-1">难度: {level}</div>
              <div className="text-base text-gray-600 mb-4">状态: {state}</div>
              <div className="w-full">
                {thing.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <span className="text-base text-gray-800 font-medium">
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      数量: {item.数量}
                    </span>
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

export default Shop
