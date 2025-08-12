import React from 'react'
import talentURL from '@src/resources/img/fairyrealm.jpg'
import HTML from './HTML'

const Talent = ({ talent_list = [] }) => {
  return (
    <HTML>
      <div
        className=" bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8"
        style={{
          backgroundImage: `url('${talentURL}')`,
          backgroundSize: 'cover'
        }}
      >
        <div className="w-full max-w-2xl mx-auto">
          <div className="rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center">
            <div className="text-2xl font-bold text-blue-700 mb-2">
              灵根列表
            </div>
            <div className="w-full">
              {talent_list.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition mb-4"
                >
                  <div className="font-bold text-blue-800 text-lg mb-2">
                    【{item.type}】{item.name}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block bg-blue-200 text-blue-900 rounded px-2 py-1 text-xs font-semibold">
                      修炼效率：{item.eff * 100}%
                    </span>
                    <span className="inline-block bg-green-200 text-green-900 rounded px-2 py-1 text-xs font-semibold">
                      额外增伤：{item.法球倍率 * 100}%
                    </span>
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

export default Talent
