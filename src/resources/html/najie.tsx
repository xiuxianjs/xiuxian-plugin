import React from 'react'
import cssURL from '@src/resources/styles/player.scss'
import playerURL from '@src/resources/img/player.jpg'
import playerFooterURL from '@src/resources/img/player_footer.png'
import HTML from './HTML'
import { Avatar } from './Avatar'

type NajieProps = {
  user_id: string | number
  player?: {
    名号?: string
    当前血量?: number
    血量上限?: number
  }
  strand_hp?: {
    style?: React.CSSProperties
  }
  najie?: {
    等级?: number
    灵石?: number
    灵石上限?: number
    道具?: Array<{
      type: string
      name: string
      desc: string
      数量: number
      出售价: number
    }>
    装备?: Array<{
      type: string
      name: string
      pinji: number
      islockd: number
      atk: number
      def: number
      HP: number
      bao: number
      数量: number
      出售价: number
    }>
    丹药?: Array<{
      name: string
      islockd: number
      HPp?: number
      exp?: number
      xingyun?: number
      数量: number
      出售价: number
    }>
    草药?: Array<{
      name: string
      islockd: number
      type: string
      desc: string
      数量: number
      出售价: number
    }>
    材料?: Array<{
      name: string
      islockd: number
      type: string
      desc: string
      数量: number
      出售价: number
    }>
    仙宠?: Array<{
      name: string
      islockd: number
      type: string
      desc: string
      数量: number
      出售价: number
      品级: string
    }>
    仙宠口粮?: Array<{
      name: string
      islockd: number
      数量: number
      出售价: number
    }>
  }
  strand_lingshi?: {
    style?: React.CSSProperties
  }
}

const Najie = ({
  user_id,
  player = {},
  strand_hp = {},
  najie = {},
  strand_lingshi = {}
}: NajieProps) => {
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
    <HTML
      className="p-0 m-0 w-full text-center"
      linkStyleSheets={[cssURL]}
      dangerouslySetInnerHTML={{
        __html: `
          body {
            background-image: url(${playerURL}), url(${playerFooterURL});
            background-repeat: no-repeat, repeat;
            background-size: 100%, auto;
          }
        `
      }}
    >
      <div className="min-h-screen relative overflow-hidden">
        {/* 多层背景装饰元素 - 增强层次感 */}
        <div className="absolute inset-0">
          {/* 第一层装饰 */}
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full backdrop-blur-sm"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border border-white/20 rounded-full backdrop-blur-sm"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white/20 rounded-full backdrop-blur-sm"></div>
          <div className="absolute bottom-40 right-1/3 w-20 h-20 border border-white/20 rounded-full backdrop-blur-sm"></div>

          {/* 第二层装饰 */}
          <div className="absolute top-20 left-1/3 w-20 h-20 border border-white/15 rounded-full backdrop-blur-sm"></div>
          <div className="absolute top-60 right-1/4 w-16 h-16 border border-white/15 rounded-full backdrop-blur-sm"></div>
          <div className="absolute bottom-60 left-1/5 w-24 h-24 border border-white/15 rounded-full backdrop-blur-sm"></div>

          {/* 第三层装饰 */}
          <div className="absolute top-40 left-1/2 w-12 h-12 border border-white/10 rounded-full backdrop-blur-sm"></div>
          <div className="absolute bottom-80 right-1/6 w-28 h-28 border border-white/10 rounded-full backdrop-blur-sm"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* 主标题区域 */}

          {/* 用户信息卡片 */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative">
              {/* 多层阴影效果 */}
              <div className="absolute inset-0 bg-white/15 rounded-3xl blur-2xl"></div>
              <div className="absolute inset-0 bg-white/10 rounded-3xl blur-xl"></div>
              <div className="relative backdrop-blur-xl bg-white/25 rounded-3xl border border-white/40 p-6 shadow-2xl">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* 头像区域 */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      {/* 头像光晕效果 */}
                      <div className="absolute inset-0 bg-white/30 rounded-full blur-lg"></div>
                      <div className="absolute inset-0 bg-white/20 rounded-full blur-md"></div>
                      <Avatar
                        src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`}
                        rootClassName="w-60 h-60"
                        className="w-32 h-32 rounded-full border-4 border-white/50 relative z-10 backdrop-blur-sm"
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <div className="text-lg font-bold text-gray-700">
                        {user_id}
                      </div>
                      <div className="text-sm text-gray-600">修仙者</div>
                    </div>
                  </div>

                  {/* 用户信息 */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-xs">👤</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            道号
                          </span>
                        </div>
                        <div className="text-lg font-bold text-gray-800">
                          {player.名号 || '无名'}
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-xs">⭐</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            等级
                          </span>
                        </div>
                        <div className="text-lg font-bold text-gray-800">
                          {najie.等级 || 0}
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-xs">❤️</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            生命值
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-white/30 backdrop-blur-sm rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full"
                                style={strand_hp.style}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-gray-800">
                              {player.当前血量 || 0}/{player.血量上限 || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-xs">💎</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            灵石储量
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-white/30 backdrop-blur-sm rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full"
                                style={strand_lingshi.style}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-gray-800">
                              {najie.灵石 || 0}/{najie.灵石上限 || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 物品分类展示 */}
          <div className="max-w-6xl mx-auto space-y-6">
            {/* 道具 */}
            {najie.道具?.length > 0 && (
              <div className="relative">
                {/* 多层阴影效果 */}
                <div className="absolute inset-0 bg-white/15 rounded-3xl blur-2xl"></div>
                <div className="absolute inset-0 bg-white/10 rounded-3xl blur-xl"></div>
                <div className="relative backdrop-blur-xl bg-white/25 rounded-3xl border border-white/40 p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-lg">🎒</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700">
                      【道具】
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {najie.道具.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30 shadow-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-xs">📦</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">
                            【{item.type}】{item.name}
                          </h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="text-gray-700">介绍：{item.desc}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">数量：</span>
                            <span className="font-bold text-gray-800">
                              {item.数量}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">出售价：</span>
                            <span className="font-bold text-gray-800">
                              {item.出售价}灵石
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">代号：</span>
                            <span className="font-bold text-gray-800">
                              {index + 101}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 装备 */}
            {najie.装备?.length > 0 && (
              <div className="relative">
                {/* 多层阴影效果 */}
                <div className="absolute inset-0 bg-white/15 rounded-3xl blur-2xl"></div>
                <div className="absolute inset-0 bg-white/10 rounded-3xl blur-xl"></div>
                <div className="relative backdrop-blur-xl bg-white/25 rounded-3xl border border-white/40 p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-lg">⚔️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700">
                      【装备】
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {najie.装备.map((item, index) => {
                      const stats = renderEquipmentStats(item)
                      return (
                        <div
                          key={index}
                          className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30 shadow-lg"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <span className="text-xs">🗡️</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">
                              【{item.type}】{item.name}({qualities[item.pinji]}
                              )({lockStatus[item.islockd]})
                            </h3>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">属性:</span>
                                <span className="font-bold text-gray-800">
                                  {stats.attribute}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">攻击:</span>
                                <span className="font-bold text-gray-800">
                                  {stats.atk}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">防御:</span>
                                <span className="font-bold text-gray-800">
                                  {stats.def}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">血量:</span>
                                <span className="font-bold text-gray-800">
                                  {stats.HP}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-600">暴击:</span>
                              <span className="font-bold text-gray-800">
                                {(item.bao * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">数量：</span>
                              <span className="font-bold text-gray-800">
                                {item.数量}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">出售价：</span>
                              <span className="font-bold text-gray-800">
                                {item.出售价}灵石
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">代号：</span>
                              <span className="font-bold text-gray-800">
                                {index + 101}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 丹药 */}
            {najie.丹药?.length > 0 && (
              <div className="relative">
                {/* 多层阴影效果 */}
                <div className="absolute inset-0 bg-white/15 rounded-3xl blur-2xl"></div>
                <div className="absolute inset-0 bg-white/10 rounded-3xl blur-xl"></div>
                <div className="relative backdrop-blur-xl bg-white/25 rounded-3xl border border-white/40 p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-lg">🧪</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700">
                      【丹药】
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {najie.丹药.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30 shadow-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-xs">💊</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {item.name}({lockStatus[item.islockd]})
                          </h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          {item.HPp > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-gray-600">恢复百分比:</span>
                              <span className="font-bold text-gray-800">
                                {item.HPp * 100}%
                              </span>
                            </div>
                          )}
                          {item.exp > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-gray-600">增加修为:</span>
                              <span className="font-bold text-gray-800">
                                {item.exp}
                              </span>
                            </div>
                          )}
                          {item.xingyun > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-gray-600">幸运值:</span>
                              <span className="font-bold text-gray-800">
                                {(item.xingyun * 100).toFixed(1)}%
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">数量：</span>
                            <span className="font-bold text-gray-800">
                              {item.数量}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">出售价：</span>
                            <span className="font-bold text-gray-800">
                              {item.出售价}灵石
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">代号：</span>
                            <span className="font-bold text-gray-800">
                              {index + 201}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 草药 */}
            {najie.草药?.length > 0 && (
              <div className="relative">
                {/* 多层阴影效果 */}
                <div className="absolute inset-0 bg-white/15 rounded-3xl blur-2xl"></div>
                <div className="absolute inset-0 bg-white/10 rounded-3xl blur-xl"></div>
                <div className="relative backdrop-blur-xl bg-white/25 rounded-3xl border border-white/40 p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-lg">🌿</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700">
                      【草药】
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {najie.草药.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30 shadow-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-xs">🌱</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {item.name}({lockStatus[item.islockd]})
                          </h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="text-gray-700">功能：{item.type}</div>
                          <div className="text-gray-700">介绍：{item.desc}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">数量：</span>
                            <span className="font-bold text-gray-800">
                              {item.数量}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">出售价：</span>
                            <span className="font-bold text-gray-800">
                              {item.出售价}灵石
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">代号：</span>
                            <span className="font-bold text-gray-800">
                              {index + 301}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 材料 */}
            {najie.材料?.length > 0 && (
              <div className="relative">
                {/* 多层阴影效果 */}
                <div className="absolute inset-0 bg-white/15 rounded-3xl blur-2xl"></div>
                <div className="absolute inset-0 bg-white/10 rounded-3xl blur-xl"></div>
                <div className="relative backdrop-blur-xl bg-white/25 rounded-3xl border border-white/40 p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-lg">🔧</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700">
                      【材料】
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {najie.材料.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30 shadow-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-xs">⚒️</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {item.name}({lockStatus[item.islockd]})
                          </h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="text-gray-700">功能：{item.type}</div>
                          <div className="text-gray-700">介绍：{item.desc}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">数量：</span>
                            <span className="font-bold text-gray-800">
                              {item.数量}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">出售价：</span>
                            <span className="font-bold text-gray-800">
                              {item.出售价}灵石
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 仙宠 */}
            {najie.仙宠?.length > 0 && (
              <div className="relative">
                {/* 多层阴影效果 */}
                <div className="absolute inset-0 bg-white/15 rounded-3xl blur-2xl"></div>
                <div className="absolute inset-0 bg-white/10 rounded-3xl blur-xl"></div>
                <div className="relative backdrop-blur-xl bg-white/25 rounded-3xl border border-white/40 p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-lg">🐉</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700">
                      【仙宠】
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {najie.仙宠.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30 shadow-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-xs">🐾</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {item.name}({lockStatus[item.islockd]})
                          </h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="text-gray-700">功能：{item.type}</div>
                          <div className="text-gray-700">介绍：{item.desc}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">数量：</span>
                            <span className="font-bold text-gray-800">
                              {item.数量}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">出售价：</span>
                            <span className="font-bold text-gray-800">
                              {item.出售价}灵石
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">品级：</span>
                            <span className="font-bold text-gray-800">
                              {item.品级}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 仙宠口粮 */}
            {najie.仙宠口粮?.length > 0 && (
              <div className="relative">
                {/* 多层阴影效果 */}
                <div className="absolute inset-0 bg-white/15 rounded-3xl blur-2xl"></div>
                <div className="absolute inset-0 bg-white/10 rounded-3xl blur-xl"></div>
                <div className="relative backdrop-blur-xl bg-white/25 rounded-3xl border border-white/40 p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-lg">🥘</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700">
                      【仙宠口粮】
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {najie.仙宠口粮.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30 shadow-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-xs">🥘</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {item.name}({lockStatus[item.islockd]})
                          </h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">数量：</span>
                            <span className="font-bold text-gray-800">
                              {item.数量}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">出售价：</span>
                            <span className="font-bold text-gray-800">
                              {item.出售价}灵石
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 底部装饰 */}
          <div className="text-center mt-12">
            <div className="inline-block px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full border border-white/30 shadow-lg">
              <span className="text-gray-700 text-sm font-medium">
                💎 纳戒空间无限，修仙路上相伴 💎
              </span>
            </div>
          </div>
        </div>
      </div>
    </HTML>
  )
}

export default Najie
