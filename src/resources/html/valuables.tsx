import React from 'react'
import classNames from 'classnames'
import HTML from './HTML'

// 楼层数据
const floors = [
  {
    name: '功法楼',
    type: '功法',
    icon: '📚',
    color: 'from-purple-400 to-purple-600',
    borderColor: 'border-purple-400/30'
  },
  {
    name: '丹药楼',
    type: '丹药',
    icon: '🧪',
    color: 'from-red-400 to-red-600',
    borderColor: 'border-red-400/30'
  },
  {
    name: '装备楼',
    type: '装备',
    icon: '⚔️',
    color: 'from-blue-400 to-blue-600',
    borderColor: 'border-blue-400/30'
  },
  {
    name: '道具楼',
    type: '道具',
    icon: '🎒',
    color: 'from-green-400 to-green-600',
    borderColor: 'border-green-400/30'
  },
  {
    name: '仙宠楼',
    type: '仙宠',
    icon: '🐉',
    color: 'from-yellow-400 to-yellow-600',
    borderColor: 'border-yellow-400/30'
  }
]

// 楼层组件
const FloorSection = ({
  name,
  type,
  icon,
  color,
  borderColor
}: {
  name: string
  type: string
  icon: string
  color: string
  borderColor: string
}) => (
  <div className="relative group">
    <div
      className={classNames(
        'absolute inset-0 bg-gradient-to-r rounded-2xl blur-sm',
        `${color.replace('400', '500')}/20`
      )}
    ></div>
    <div
      className={classNames(
        'relative backdrop-blur-md bg-white/5 rounded-2xl border p-6 hover:border-opacity-60 transition-all duration-300',
        borderColor
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className={classNames(
            'w-16 h-16 bg-gradient-to-br rounded-xl flex items-center justify-center border border-white/20',
            color
          )}
        >
          <span className="text-3xl">{icon}</span>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-white mb-2">{name}</div>
          <div className="text-sm text-gray-300 mb-3">类型: {type}</div>
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm">
            <span className="text-blue-200 text-sm font-medium">
              查看全部{type}价格
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const Valuables = () => {
  return (
    <HTML>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 relative overflow-hidden">
        {/* 背景装饰元素 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-amber-400 rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border border-yellow-400 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-orange-400 rounded-full"></div>
          <div className="absolute bottom-40 right-1/3 w-20 h-20 border border-red-400 rounded-full"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* 主标题区域 */}
          <div className="text-center mb-8">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-2xl blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-r from-amber-600 to-yellow-600 rounded-2xl px-8 py-4 border border-amber-400/30">
                <h1 className="text-3xl font-bold text-white tracking-wider">
                  🏛️ 万宝楼 🏛️
                </h1>
              </div>
            </div>
            <div className="mt-4 text-amber-200 text-sm">
              💎 修仙界最大的当铺 💎
            </div>
          </div>

          {/* 主信息区域 */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-3xl blur-xl"></div>
              <div className="relative backdrop-blur-sm bg-white/10 rounded-3xl border border-amber-400/30 p-8">
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-amber-300 mb-4">
                    🏛️ 万宝楼
                  </div>
                  <div className="text-lg font-bold text-white mb-2">
                    修仙界最大的当铺
                  </div>
                  <div className="text-base text-gray-300 mb-4">
                    汇聚天下所有物品
                  </div>
                  <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm">
                    <span className="text-blue-200 text-sm font-medium">
                      🗺️ 快去秘境历练获得神器吧 🗺️
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 楼层区域 */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {floors.map((floor, index) => (
                <FloorSection
                  key={index}
                  name={floor.name}
                  type={floor.type}
                  icon={floor.icon}
                  color={floor.color}
                  borderColor={floor.borderColor}
                />
              ))}
            </div>
          </div>

          {/* 底部装饰 */}
          <div className="text-center mt-12">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 rounded-full border border-amber-400/30 backdrop-blur-sm">
              <span className="text-amber-200 text-sm">
                💎 万宝楼中藏万宝，修仙路上寻仙缘 💎
              </span>
            </div>
          </div>
        </div>
      </div>
    </HTML>
  )
}

export default Valuables
