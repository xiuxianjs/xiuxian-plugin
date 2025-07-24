import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './equipment.css'
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
    attributeClass: string
  }
}> = ({ title, equipment, qualities, renderStats }) => (
  <div className="equipment-card">
    <div className="user_font_title">{title}</div>
    <div className="user_font">
      名称: <span className={`quality-${equipment.pinji}`}>
        {equipment.name} ({qualities[equipment.pinji]})
      </span>
    </div>
    <div className="user_font">血量:{renderStats(equipment).HP}</div>
    <div className="user_font">暴击率:{(equipment.bao * 100).toFixed(0)}%</div>
  </div>
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
  <div className="equipment-card">
    <div className="user_font_title">[属性板]</div>
    <div className="user_font2">道号:{nickname}</div>
    <div className="user_font2">血量:{player_maxHP.toFixed(0)}</div>
    <div className="user_font2">攻击:{player_atk.toFixed(0)}</div>
    <div className="user_font2">防御:{player_def.toFixed(0)}</div>
    <div className="user_font2">暴击率:{player_bao.toFixed(0)}%</div>
  </div>
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
        <meta httpEquiv="content-type" content="text/html;charset=utf-8" />
        <LinkStyleSheet src={cssURL} />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @font-face {
            font-family: 'tttgbnumber';
            src: url('${tttgbnumberURL}');
            font-weight: normal;
            font-style: normal;
          }

          body {
            transform: scale(1);
            width: 100%;
            margin: 0;
            background-image: url('${backgroundURL}');
            background-size: 100% auto;
          }
        `
          }}
        />
      </head>

      <body>
        <div className="equipment-container">
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
        </div>
      </body>
    </html>
  )
}

export default Equipment
