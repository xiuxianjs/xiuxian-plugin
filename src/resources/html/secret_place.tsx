import React from 'react'
import HTML from './HTML'
import secretPlaceURL from '@src/resources/img/fairyrealm.jpg'
import cardURL from '@src/resources/img/road.jpg'

const SecretPlace = ({ didian_list }) => {
  return (
    <HTML
      className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8"
      style={{
        backgroundImage: `url('${secretPlaceURL}')`,
        backgroundSize: 'cover'
      }}
    >
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-xl shadow-lg bg-white/80 p-6 mb-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-700 mb-2">秘境</div>
          <div className="text-base text-gray-600 mb-1">
            降临指令：#降临秘境+秘境名
          </div>
          <div className="text-base text-gray-600 mb-4">
            筛选指令：#秘境+类型（装备/丹药/草药/功法）
          </div>
        </div>
        {didian_list?.map((item, index) => (
          <div
            key={index}
            className="rounded-xl shadow bg-white/70 p-4 mb-6 flex flex-col items-center"
            style={{
              backgroundImage: `url('${cardURL}')`,
              backgroundSize: 'cover'
            }}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="font-bold text-blue-800 text-lg">
                【{item.Grade}】{item.name}
              </span>
              <span className="text-sm text-green-700">{item.Price}灵石</span>
            </div>
            <div className="w-full space-y-2">
              <div>
                <span className="font-semibold text-gray-700">低级奖励：</span>
                <span className="flex flex-wrap gap-2 ml-2">
                  {item.one?.map((thing, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-blue-200 text-blue-900 rounded px-2 py-1 text-xs font-semibold"
                    >
                      {thing.name}
                    </span>
                  ))}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">中级奖励：</span>
                <span className="flex flex-wrap gap-2 ml-2">
                  {item.two?.map((thing, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-green-200 text-green-900 rounded px-2 py-1 text-xs font-semibold"
                    >
                      {thing.name}
                    </span>
                  ))}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">高级奖励：</span>
                <span className="flex flex-wrap gap-2 ml-2">
                  {item.three?.map((thing, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-yellow-200 text-yellow-900 rounded px-2 py-1 text-xs font-semibold"
                    >
                      {thing.name}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </HTML>
  )
}

export default SecretPlace
