import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from './tailwindcss.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import backgroundURL from '@src/resources/img/equipment.jpg'

/**
 * 装备项接口
 */
interface EquipmentItem {
  name: string
  pinji: number
  id: number
  atk: number
  def: number
  HP: number
  bao: number
}

/**
 * 装备页面属性接口
 */
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

/**
 * 装备信息组件
 */
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
}> = ({ title, equipment, qualities, renderStats }) => (
  <article className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 flex flex-col gap-2 shadow-card hover:ring-brand-accent hover:bg-white/10 transition">
    <h2 className="text-lg font-bold text-brand-accent tracking-wide mb-1">
      {title}
    </h2>
    <div className="text-white/90 text-base font-semibold">
      {equipment.name}{' '}
      <span className="text-brand-accent">({qualities[equipment.pinji]})</span>
    </div>
    <div className="text-sm text-white/80">
      属性：
      <span className="font-semibold text-brand-accent">
        {renderStats(equipment).attribute}
      </span>
    </div>
    <div className="text-sm text-white/80">
      攻击：
      <span className="font-semibold text-brand-accent">
        {renderStats(equipment).atk}
      </span>
    </div>
    <div className="text-sm text-white/80">
      防御：
      <span className="font-semibold text-brand-accent">
        {renderStats(equipment).def}
      </span>
    </div>
    <div className="text-sm text-white/80">
      血量：
      <span className="font-semibold text-brand-accent">
        {renderStats(equipment).HP}
      </span>
    </div>
    <div className="text-sm text-white/80">
      暴击率：
      <span className="font-semibold text-brand-accent">
        {(equipment.bao * 100).toFixed(0)}%
      </span>
    </div>
  </article>
)

/**
 * 属性板组件
 */
const PlayerStats: React.FC<{
  nickname: string
  player_maxHP: number
  player_atk: number
  player_def: number
  player_bao: number
}> = ({ nickname, player_maxHP, player_atk, player_def, player_bao }) => (
  <article className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 flex flex-col gap-2 shadow-card">
    <h2 className="text-lg font-bold text-white tracking-wide mb-1">
      [属性板]
    </h2>
    <div className="text-base text-white/90 font-semibold">
      道号：<span className="text-brand-accent">{nickname}</span>
    </div>
    <div className="text-sm text-white/80">
      血量：
      <span className="font-semibold text-brand-accent">
        {player_maxHP.toFixed(0)}
      </span>
    </div>
    <div className="text-sm text-white/80">
      攻击：
      <span className="font-semibold text-brand-accent">
        {player_atk.toFixed(0)}
      </span>
    </div>
    <div className="text-sm text-white/80">
      防御：
      <span className="font-semibold text-brand-accent">
        {player_def.toFixed(0)}
      </span>
    </div>
    <div className="text-sm text-white/80">
      暴击率：
      <span className="font-semibold text-brand-accent">
        {player_bao.toFixed(0)}%
      </span>
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

  const renderStats = item => {
    const isAbsolute = item.atk > 10 || item.def > 10 || item.HP > 10

    return {
      attribute: isAbsolute ? '无' : elements[item.id - 1],
      atk: isAbsolute ? item.atk.toFixed(0) : (item.atk * 100).toFixed(0) + '%',
      def: isAbsolute ? item.def.toFixed(0) : (item.def * 100).toFixed(0) + '%',
      HP: isAbsolute ? item.HP.toFixed(0) : (item.HP * 100).toFixed(0) + '%'
    }
  }

  return (
    <html>
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
      <body
        className="min-h-screen w-full p-4 md:p-8 bg-top bg-cover"
        style={{ backgroundImage: `url(${backgroundURL})` }}
      >
        <main className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
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
      </body>
    </html>
  )
}

export default Equipment
