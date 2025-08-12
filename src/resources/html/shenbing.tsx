import React from 'react'
import HTML from './HTML'
import stateURL from '@src/resources/img/state.jpg'

const Shenbing = ({ newwupin }) => {
  return (
    <HTML
      className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8"
      style={{
        backgroundImage: `url('${stateURL}')`,
        backgroundSize: 'cover'
      }}
    >
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-xl shadow-lg bg-white/80 p-6 mb-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-700 mb-2">神兵榜</div>
        </div>
        {newwupin?.map((item, index) => (
          <div
            key={index}
            className="rounded-xl shadow bg-white/70 p-4 mb-6 flex flex-col items-center"
          >
            <div className="text-lg font-semibold text-blue-800 mb-2">
              No.{index + 1}
            </div>
            <div className="w-full flex flex-col gap-1 text-base text-gray-700">
              <div>
                兵器名：
                <span className="font-bold text-blue-700">{item.name}</span>
              </div>
              <div>类别：{item.type}</div>
              <div>缔造者：{item.制作者}</div>
              <div>持兵者：{item.使用者}</div>
              <div>
                灵韵值：
                <span className="font-bold text-green-700">{item.评分}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </HTML>
  )
}

export default Shenbing
