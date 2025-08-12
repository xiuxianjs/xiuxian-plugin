import React from 'react'
import HTML from './HTML'

// 装备项接口
interface EquipmentItem {
  name: string
  pinji: number
  id: number
  atk: number
  def: number
  HP: number
  bao: number
}

// 装备页面属性接口
interface EquipmentProps {
  arms?: EquipmentItem
  armor?: EquipmentItem
  treasure?: EquipmentItem
  nickname: string
  player_maxHP: number
  player_atk: number
  player_def: number
  player_bao: number
}

// 品质颜色（渐变）
const qualityGradients = [
  'from-gray-400 to-gray-200', // 劣
  'from-green-400 to-lime-300', // 普
  'from-blue-400 to-cyan-300', // 优
  'from-purple-400 to-pink-300', // 精
  'from-orange-400 to-amber-300', // 极
  'from-red-400 to-pink-300', // 绝
  'from-yellow-300 to-amber-100' // 顶
]

// 装备信息卡
const EquipmentCard: React.FC<{
  title: string
  equipment: EquipmentItem
  qualities: string[]
  renderStats: (item: EquipmentItem) => {
    attribute: string
    atk: string
    def: string
    HP: string
  }
}> = ({ title, equipment, qualities, renderStats }) => {
  const qualityStyle = qualityGradients[equipment.pinji] || qualityGradients[0]
  const stats = renderStats(equipment)

  return (
    <article
      className={`rounded-2xl p-4 flex flex-col gap-2 
      bg-white/10 backdrop-blur-lg ring-2 shadow-xl 
      ring-white/20 hover:scale-[1.02] hover:shadow-2xl 
      transition-all duration-300 
      border border-white/20 relative overflow-hidden`}
    >
      {/* 渐变标题条 */}
      <div
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${qualityStyle}`}
      ></div>

      <h2 className="text-xl font-extrabold tracking-wide mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 drop-shadow-md">
        {title}
      </h2>

      <div className="text-lg font-semibold flex items-center gap-2">
        <span>{equipment.name}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${qualityStyle} text-black font-bold shadow-inner`}
        >
          {qualities[equipment.pinji]}
        </span>
      </div>

      <div className="text-sm flex gap-1 items-center">
        <span className="opacity-70">属性：</span>
        <span className="font-semibold text-emerald-300">
          {stats.attribute}
        </span>
      </div>

      <div className="text-sm flex gap-1 items-center">
        <span className="text-red-300">⚔ 攻击：</span>
        <span className="font-semibold">{stats.atk}</span>
      </div>

      <div className="text-sm flex gap-1 items-center">
        <span className="text-blue-300">🛡 防御：</span>
        <span className="font-semibold">{stats.def}</span>
      </div>

      <div className="text-sm flex gap-1 items-center">
        <span className="text-pink-300">❤️ 血量：</span>
        <span className="font-semibold">{stats.HP}</span>
      </div>

      <div className="text-sm flex gap-1 items-center">
        <span className="text-yellow-300">✨ 暴击率：</span>
        <span className="font-semibold">
          {(equipment.bao * 100).toFixed(0)}%
        </span>
      </div>
    </article>
  )
}

// 属性板
const PlayerStats: React.FC<{
  nickname: string
  player_maxHP: number
  player_atk: number
  player_def: number
  player_bao: number
}> = ({ nickname, player_maxHP, player_atk, player_def, player_bao }) => (
  <article className="rounded-2xl p-4 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-2xl transition">
    <h2 className="text-xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
      [属性板]
    </h2>
    <div className="text-base mb-1">
      道号：<span className="font-semibold text-emerald-200">{nickname}</span>
    </div>
    <div className="text-sm text-pink-200">
      ❤️ 血量：<span className="font-semibold">{player_maxHP.toFixed(0)}</span>
    </div>
    <div className="text-sm text-red-200">
      ⚔ 攻击：<span className="font-semibold">{player_atk.toFixed(0)}</span>
    </div>
    <div className="text-sm text-blue-200">
      🛡 防御：<span className="font-semibold">{player_def.toFixed(0)}</span>
    </div>
    <div className="text-sm text-yellow-200">
      ✨ 暴击率：<span className="font-semibold">{player_bao.toFixed(0)}%</span>
    </div>
  </article>
)

const Equipment: React.FC<EquipmentProps> = ({
  arms = { name: '无', pinji: 0, id: 1, atk: 0, def: 0, HP: 0, bao: 0 },
  armor = { name: '无', pinji: 0, id: 1, atk: 0, def: 0, HP: 0, bao: 0 },
  treasure = { name: '无', pinji: 0, id: 1, atk: 0, def: 0, HP: 0, bao: 0 },
  nickname,
  player_maxHP,
  player_atk,
  player_def,
  player_bao
}) => {
  const qualities = ['劣', '普', '优', '精', '极', '绝', '顶']
  const elements = ['金', '木', '土', '水', '火']

  const renderStats = (item: EquipmentItem) => {
    const isAbsolute = item.atk > 10 || item.def > 10 || item.HP > 10
    return {
      attribute: isAbsolute ? '无' : elements[item.id - 1],
      atk: isAbsolute ? item.atk.toFixed(0) : (item.atk * 100).toFixed(0) + '%',
      def: isAbsolute ? item.def.toFixed(0) : (item.def * 100).toFixed(0) + '%',
      HP: isAbsolute ? item.HP.toFixed(0) : (item.HP * 100).toFixed(0) + '%'
    }
  }

  return (
    <HTML className="min-h-screen w-full bg-black bg-opacity-40 p-4 md:p-8 bg-top bg-cover relative">
      {/* 星空粒子层（可用 canvas 或 CSS 动画增强） */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:20px_20px]"></div>

      <main className="relative z-10 max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
        <EquipmentCard
          title="[武器]"
          equipment={arms}
          qualities={qualities}
          renderStats={renderStats}
        />
        <EquipmentCard
          title="[护具]"
          equipment={armor}
          qualities={qualities}
          renderStats={renderStats}
        />
        <EquipmentCard
          title="[法宝]"
          equipment={treasure}
          qualities={qualities}
          renderStats={renderStats}
        />
        <PlayerStats
          nickname={nickname}
          player_maxHP={player_maxHP}
          player_atk={player_atk}
          player_def={player_def}
          player_bao={player_bao}
        />
      </main>
    </HTML>
  )
}

export default Equipment
