import React from 'react'
import ningmenghomeURL from '@src/resources/img/fairyrealm.jpg'
import HTML from './HTML'

const TuJian = ({ commodities_list }) => {
  return (
    <HTML>
      <div
        className=" bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8"
        style={{
          backgroundImage: `url('${ningmenghomeURL}')`,
          backgroundSize: 'cover'
        }}
      >
        <div className="w-full max-w-2xl mx-auto">
          <div className="rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center">
            <div className="text-2xl font-bold text-blue-700 mb-2">
              斩首神器堂
            </div>
            <div className="w-full">
              {commodities_list &&
                commodities_list.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition mb-4"
                  >
                    <div className="font-bold text-blue-800 text-lg mb-2">
                      【{item.desc[0]}
                      {item.type}】{item.name}
                    </div>
                    {item.class === '装备' && (
                      <div className="space-y-1">
                        <div className="text-sm text-gray-700">
                          契合元素：【{item.desc[4]}】
                        </div>
                        <div className="text-sm text-gray-700">
                          锋利度：{item.atk}
                        </div>
                        <div className="text-sm text-gray-700">
                          刃体强度：{item.def}
                        </div>
                        <div className="text-sm text-gray-700">
                          血晶核：{item.HP}
                        </div>
                        <div className="text-sm text-gray-700">
                          元素爆发率：{item.bao * 100}%
                        </div>
                        <div className="text-sm text-gray-700">
                          特性：{item.desc[1]}
                        </div>
                        <div className="text-sm text-gray-700">
                          {item.desc[2]}
                        </div>
                        <div className="text-sm text-gray-700">
                          {item.desc[3]}
                        </div>
                        <div className="text-sm text-gray-700">
                          获取途径：{item.tujin}
                        </div>
                      </div>
                    )}
                    {item.class === '丹药' && (
                      <div className="text-sm text-gray-700">
                        {item.type}：
                        {item.type === '修为'
                          ? item.exp
                          : item.type === '血气'
                            ? item.xueqi
                            : item.type === '血量'
                              ? item.HP
                              : ''}
                      </div>
                    )}
                    {item.class === '功法' && (
                      <div className="text-sm text-gray-700">
                        修炼加成：{item.修炼加成 * 100}%
                      </div>
                    )}
                    {(item.class === '道具' || item.class === '草药') && (
                      <div className="text-sm text-gray-700">
                        描述：{item.desc}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </HTML>
  )
}

export default TuJian
