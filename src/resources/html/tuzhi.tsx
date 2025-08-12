import React from 'react'
import tuzhiURL from '@src/resources/img/fairyrealm.jpg'
import HTML from './HTML'

const Tuzhi = ({ tuzhi_list }) => {
  return (
    <HTML>
      <div
        className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8"
        style={{
          backgroundImage: `url(${tuzhiURL})`,
          backgroundSize: 'cover'
        }}
      >
        <div className="w-full max-w-2xl mx-auto">
          <div className="rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center">
            <div className="text-2xl font-bold text-blue-700 mb-2">图纸</div>
            <div className="text-base text-gray-600 mb-1">
              炼制指令：#打造+武器名
            </div>
            <div className="text-base text-green-600 mb-4">
              炼制成功率 = 炼制成功率 + 玩家职业等级成功率
            </div>
            <div className="w-full">
              {tuzhi_list?.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition mb-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-blue-800 text-lg">
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-700">
                      基础成功率 {~~(item.rate * 100)}%
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.materials?.map((material, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-blue-200 text-blue-900 rounded px-2 py-1 text-xs font-semibold"
                      >
                        {material.name} × {material.amount}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HTML>
  )
}

export default Tuzhi
