import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from '@src/resources/styles/tw.scss'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'

const Najie = ({
  user_id,
  player = {},
  strand_hp = {},
  najie = {},
  strand_lingshi = {}
}) => {
  const qualities = ['劣', '普', '优', '精', '极', '绝', '顶']
  const lockStatus = ['未锁定', '已锁定']
  const elements = ['金', '木', '土', '水', '火']
  const renderEquipmentStats = item => {
    const isAbsolute = item.atk > 10 || item.def > 10 || item.HP > 10
    return {
      attribute: isAbsolute ? '无' : elements[item.id - 1],
      atk: isAbsolute ? item.atk.toFixed(0) : (item.atk * 100).toFixed(0) + '%',
      def: isAbsolute ? item.def.toFixed(0) : (item.def * 100).toFixed(0) + '%',
      HP: isAbsolute ? item.HP.toFixed(0) : (item.HP * 100).toFixed(0) + '%'
    }
  }
  return (
    <html lang="zh-CN">
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
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 py-6 px-2">
          {/* 顶部信息卡 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
            {/* 左侧头像与ID */}
            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-4 w-full md:w-72">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300 mb-2">
                <img
                  src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`}
                  alt="头像"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-lg font-bold text-gray-700">
                ID: {user_id}
              </div>
            </div>
            {/* 右侧信息 */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="text-xl font-semibold text-blue-700 mb-2">
                  道号：{player.名号}
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-600">生命：</span>
                  <div className="w-full bg-gray-200 rounded h-6 relative">
                    <div
                      className="absolute left-0 top-0 h-6 rounded bg-red-400"
                      style={{ width: strand_hp.style?.width || '0%' }}
                    ></div>
                    <div className="absolute w-full h-6 flex items-center justify-center text-xs font-bold text-white">
                      {player.当前血量}/{player.血量上限}
                    </div>
                  </div>
                </div>
                <div className="mb-2 text-gray-600">等级：{najie.等级}</div>
                <div>
                  <span className="font-medium text-gray-600">灵石储量：</span>
                  <div className="w-full bg-gray-200 rounded h-6 relative">
                    <div
                      className="absolute left-0 top-0 h-6 rounded bg-yellow-400"
                      style={{ width: strand_lingshi.style?.width || '0%' }}
                    ></div>
                    <div className="absolute w-full h-6 flex items-center justify-center text-xs font-bold text-white">
                      {najie.灵石}/{najie.灵石上限}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 道具 */}
          {najie.道具?.length > 0 && (
            <div className="card_box">
              <div className="use_data">
                <div className="user_font user_font_title">【道具】</div>
                <div className="user_font wupin">
                  {najie.道具.map((item, index) => {
                    return (
                      <div key={index} className="item">
                        <div className="item_title">
                          【{item.type}】{item.name}
                        </div>
                        <div className="item_int">介绍：{item.desc}</div>
                        <div className="item_int">数量：{item.数量}</div>
                        <div className="item_int">
                          出售价：{item.出售价}灵石
                        </div>
                        <div className="item_int">代号：{index + 101}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
          {/* 装备 */}
          {najie.装备?.length > 0 && (
            <div className="card_box">
              <div className="use_data">
                <div className="user_font user_font_title">【装备】</div>
                <div className="user_font wupin">
                  {najie.装备.map((item, index) => {
                    const stats = renderEquipmentStats(item)
                    return (
                      <div key={index} className="item">
                        <div className="item_title">
                          【{item.type}】{item.name}({qualities[item.pinji]})(
                          {lockStatus[item.islockd]})
                        </div>
                        <div className="item_int">属性:{stats.attribute}</div>
                        <div className="item_int">攻击：{stats.atk}</div>
                        <div className="item_int">防御：{stats.def}</div>
                        <div className="item_int">血量：{stats.HP}</div>
                        <div className="item_int">
                          暴击：{(item.bao * 100).toFixed(0)}%
                        </div>
                        <div className="item_int">数量：{item.数量}</div>
                        <div className="item_int">
                          出售价：{item.出售价}灵石
                        </div>
                        <div className="item_int">代号：{index + 101}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 丹药 */}
          {najie.丹药?.length > 0 && (
            <div className="card_box">
              <div className="use_data">
                <div className="user_font user_font_title">【丹药】</div>
                <div className="user_font wupin">
                  {najie.丹药.map((item, index) => (
                    <div key={index} className="item">
                      <div className="item_title">
                        {item.name}({lockStatus[item.islockd]})
                      </div>
                      {item.HPp > 0 && (
                        <div className="item_int">
                          恢复百分比：{item.HPp * 100}%
                        </div>
                      )}
                      {item.exp > 0 && (
                        <div className="item_int">增加修为：{item.exp}</div>
                      )}
                      {item.xingyun > 0 && (
                        <div className="item_int">
                          幸运值：{(item.xingyun * 100).toFixed(1)}%
                        </div>
                      )}
                      <div className="item_int">数量：{item.数量}</div>
                      <div className="item_int">出售价：{item.出售价}灵石</div>
                      <div className="item_int">代号：{index + 201}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {najie.草药?.length > 0 && (
            <div className="card_box">
              <div className="use_data">
                <div className="user_font user_font_title">【草药】</div>
                <div className="user_font wupin">
                  {najie.草药.map((item, index) => (
                    <div key={index} className="item">
                      <div className="item_title">
                        {item.name}({lockStatus[item.islockd]})
                      </div>
                      <div className="item_int">功能：{item.type}</div>
                      <div className="item_int">介绍：{item.desc}</div>
                      <div className="item_int">数量：{item.数量}</div>
                      <div className="item_int">出售价：{item.出售价}灵石</div>
                      <div className="item_int">代号：{index + 301}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {najie.材料?.length > 0 && (
            <div className="card_box">
              <div className="use_data">
                <div className="user_font user_font_title">【材料】</div>
                <div className="user_font wupin">
                  {najie.材料.map((item, index) => (
                    <div key={index} className="item">
                      <div className="item_title">
                        {item.name}({lockStatus[item.islockd]})
                      </div>
                      <div className="item_int">功能：{item.type}</div>
                      <div className="item_int">介绍：{item.desc}</div>
                      <div className="item_int">数量：{item.数量}</div>
                      <div className="item_int">出售价：{item.出售价}灵石</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {najie.仙宠?.length > 0 && (
            <div className="card_box">
              <div className="use_data">
                <div className="user_font user_font_title">【仙宠】</div>
                <div className="user_font wupin">
                  {najie.仙宠.map((item, index) => (
                    <div key={index} className="item">
                      <div className="item_title">
                        {item.name}({lockStatus[item.islockd]})
                      </div>
                      <div className="item_int">功能：{item.type}</div>
                      <div className="item_int">介绍：{item.desc}</div>
                      <div className="item_int">数量：{item.数量}</div>
                      <div className="item_int">出售价：{item.出售价}灵石</div>
                      <div className="item_int">品级：{item.品级}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 仙宠口粮 */}
          {najie.仙宠口粮?.length > 0 && (
            <div className="card_box">
              <div className="use_data">
                <div className="user_font user_font_title">【仙宠口粮】</div>
                <div className="user_font wupin">
                  {najie.仙宠口粮.map((item, index) => (
                    <div key={index} className="item">
                      <div className="item_title">
                        {item.name}({lockStatus[item.islockd]})
                      </div>
                      <div className="item_int">数量：{item.数量}</div>
                      <div className="item_int">出售价：{item.出售价}灵石</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="user_bottom2"></div>
        </div>
      </body>
    </html>
  )
}

export default Najie
