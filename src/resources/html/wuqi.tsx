import React from 'react'
import HTML from './HTML'

const WuQi = ({ nickname, wuqi_have, wuqi_need }) => {
  return (
    <HTML>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-200 flex flex-col items-center py-6">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-2xl font-bold text-blue-700 mb-6 text-center drop-shadow">
            {nickname}的装备
          </div>

          {wuqi_have && wuqi_have.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="text-lg font-semibold text-green-600 mb-2">
                【已拥有】
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wuqi_have.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="font-bold text-blue-800 text-lg mb-2 h-11 flex items-center">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-700">
                      类型：{item.type}
                    </div>
                    {item.atk > 10 || item.def > 10 || item.HP > 10 ? (
                      <>
                        <div className="text-sm text-gray-700">
                          攻击：{item.atk}
                        </div>
                        <div className="text-sm text-gray-700">
                          防御：{item.def}
                        </div>
                        <div className="text-sm text-gray-700">
                          血量：{item.HP}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm text-gray-700">
                          攻击：{(item.atk * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-700">
                          防御：{(item.def * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-700">
                          血量：{(item.HP * 100).toFixed(0)}%
                        </div>
                      </>
                    )}
                    <div className="text-sm text-gray-700">
                      暴击：{(item.bao * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {wuqi_need && wuqi_need.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="text-lg font-semibold text-red-600 mb-2">
                【未拥有】
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wuqi_need.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="font-bold text-blue-800 text-lg mb-2 h-11 flex items-center">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-700">
                      类型：{item.type}
                    </div>
                    {item.atk > 10 || item.def > 10 || item.HP > 10 ? (
                      <>
                        <div className="text-sm text-gray-700">
                          攻击：{item.atk}
                        </div>
                        <div className="text-sm text-gray-700">
                          防御：{item.def}
                        </div>
                        <div className="text-sm text-gray-700">
                          血量：{item.HP}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm text-gray-700">
                          攻击：{(item.atk * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-700">
                          防御：{(item.def * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-700">
                          血量：{(item.HP * 100).toFixed(0)}%
                        </div>
                      </>
                    )}
                    <div className="text-sm text-gray-700">
                      暴击：{(item.bao * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </HTML>
  )
}

export default WuQi
