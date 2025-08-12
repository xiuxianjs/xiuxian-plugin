import React from 'react'
import supermarketURL from '@src/resources/img/fairyrealm.jpg'
import HTML from './HTML'

const Supermarket = ({ Exchange_list }) => {
  return (
    <HTML>
      <div
        className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8"
        style={{
          backgroundImage: `url(${supermarketURL})`,
          backgroundSize: 'cover'
        }}
      >
        <div className="w-full max-w-2xl mx-auto">
          <div className="rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center">
            <div className="text-2xl font-bold text-blue-700 mb-2">冲水堂</div>
            <div className="text-base text-gray-600 mb-1">
              上架指令：#上架+物品名*价格*数量
            </div>
            <div className="text-base text-gray-600 mb-1">
              选购指令：#选购+编号*数量
            </div>
            <div className="text-base text-gray-600 mb-4">
              下架指令：#下架+编号
            </div>
            <div className="w-full">
              {Exchange_list &&
                Exchange_list.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition mb-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-blue-800 text-lg">
                        {item.name.class === '装备'
                          ? `【${item.name.class}】${item.name.name}【${item.pinji}】`
                          : `【${item.name.class}】${item.name.name}`}
                      </span>
                      <span className="text-sm text-gray-700">
                        No.{item.num}
                      </span>
                    </div>
                    {item.name.class === '装备' && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.name.atk > 10 ||
                        item.name.def > 10 ||
                        item.name.HP > 10 ? (
                          <>
                            <span className="inline-block bg-gray-200 text-gray-900 rounded px-2 py-1 text-xs font-semibold">
                              属性:无
                            </span>
                            <span className="inline-block bg-blue-200 text-blue-900 rounded px-2 py-1 text-xs font-semibold">
                              攻击：{item.name.atk.toFixed(0)}
                            </span>
                            <span className="inline-block bg-green-200 text-green-900 rounded px-2 py-1 text-xs font-semibold">
                              防御：{item.name.def.toFixed(0)}
                            </span>
                            <span className="inline-block bg-yellow-200 text-yellow-900 rounded px-2 py-1 text-xs font-semibold">
                              血量：{item.name.HP.toFixed(0)}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="inline-block bg-gray-200 text-gray-900 rounded px-2 py-1 text-xs font-semibold">
                              属性:
                              {['金', '木', '土', '水', '火'][item.name.id - 1]}
                            </span>
                            <span className="inline-block bg-blue-200 text-blue-900 rounded px-2 py-1 text-xs font-semibold">
                              攻击：{(item.name.atk * 100).toFixed(0)}%
                            </span>
                            <span className="inline-block bg-green-200 text-green-900 rounded px-2 py-1 text-xs font-semibold">
                              防御：{(item.name.def * 100).toFixed(0)}%
                            </span>
                            <span className="inline-block bg-yellow-200 text-yellow-900 rounded px-2 py-1 text-xs font-semibold">
                              血量：{(item.name.HP * 100).toFixed(0)}%
                            </span>
                          </>
                        )}
                        <span className="inline-block bg-pink-200 text-pink-900 rounded px-2 py-1 text-xs font-semibold">
                          暴：{(item.name.bao * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                    {item.name.class === '仙宠' && (
                      <span className="inline-block bg-purple-200 text-purple-900 rounded px-2 py-1 text-xs font-semibold mb-2">
                        等级：{item.name.等级.toFixed(0)}
                      </span>
                    )}
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-block bg-blue-100 text-blue-900 rounded px-2 py-1 text-xs font-semibold">
                        单价：{item.price}
                      </span>
                      <span className="inline-block bg-green-100 text-green-900 rounded px-2 py-1 text-xs font-semibold">
                        数量：{item.aconut}
                      </span>
                      <span className="inline-block bg-yellow-100 text-yellow-900 rounded px-2 py-1 text-xs font-semibold">
                        总价：{item.whole}
                      </span>
                      <span className="inline-block bg-gray-100 text-gray-900 rounded px-2 py-1 text-xs font-semibold">
                        QQ：{item.qq}
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

export default Supermarket
