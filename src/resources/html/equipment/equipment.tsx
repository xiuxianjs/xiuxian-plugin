import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './equipment.css'
import tttgbnumberURL from '../../font/tttgbnumber.ttf'
import backgroundURL from '../../img/equipment_pifu/0.jpg'

const Equipment = ({
  arms = {},
  armor = {},
  treasure = {},
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
        <style>
          {`
          @font-face {
            font-family: 'tttgbnumber';
            src: url('${tttgbnumberURL}');
            font-weight: normal;
            font-style: normal;
          }

          body {
            transform: scale(1);
            width: 100%;
            height: 480px;
            margin: 0;
            text-align: center;
            background-image: url('${backgroundURL}');
            background-size: 100% auto;
          }
        `}
        </style>
      </head>

      <body>
        <div className="user_width">
          <div className="user_left">
            <div className="user_left_top">
              <div className="user_font_title">[武器]</div>
              <div className="user_font">
                名称:{arms.name}({qualities[arms.pinji]})
              </div>
              <div className="user_font">
                属性:{renderStats(arms).attribute}
              </div>
              <div className="user_font">攻击:{renderStats(arms).atk}</div>
              <div className="user_font">防御:{renderStats(arms).def}</div>
              <div className="user_font">血量:{renderStats(arms).HP}</div>
              <div className="user_font">
                暴击率:{(arms.bao * 100).toFixed(0)}%
              </div>
            </div>
            <div className="user_left_buttom">
              <div className="user_font_title">[护具]</div>
              <div className="user_font">
                名称:{armor.name}({qualities[armor.pinji]})
              </div>
              <div className="user_font">
                属性:{renderStats(armor).attribute}
              </div>
              <div className="user_font">攻击:{renderStats(armor).atk}</div>
              <div className="user_font">防御:{renderStats(armor).def}</div>
              <div className="user_font">血量:{renderStats(armor).HP}</div>
              <div className="user_font">
                暴击率:{(armor.bao * 100).toFixed(0)}%
              </div>
            </div>
          </div>
          <div className="user_right">
            <div className="user_right_top">
              <div className="user_font_title">[法宝]</div>
              <div className="user_font">
                名称:{treasure.name}({qualities[treasure.pinji]})
              </div>
              <div className="user_font">
                属性:{renderStats(treasure).attribute}
              </div>
              <div className="user_font">攻击:{renderStats(treasure).atk}</div>
              <div className="user_font">防御:{renderStats(treasure).def}</div>
              <div className="user_font">血量:{renderStats(treasure).HP}</div>
              <div className="user_font">
                暴击率:{(treasure.bao * 100).toFixed(0)}%
              </div>
            </div>
            <div className="user_right_buttom">
              <div className="user_font_title">[属性板]</div>
              <div className="user_font2">道号:{nickname}</div>
              <div className="user_font2">血量:{player_maxHP.toFixed(0)}</div>
              <div className="user_font2">攻击:{player_atk.toFixed(0)}</div>
              <div className="user_font2">防御:{player_def.toFixed(0)}</div>
              <div className="user_font2">暴击率:{player_bao.toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

export default Equipment
