import { LinkStyleSheet } from 'jsxp'
import cssURL from './najie.css'
import tttgbnumberURL from '../../font/tttgbnumber.ttf'
import NZBZURL from '../../font/NZBZ.TTF'
import backgroundURL from '../../img/player_pifu/0.jpg'
import user_stateURL from '../../img/state/user_state.png'

const Najie = ({
  user_id,
  player = {},
  strand_hp = {},
  najie = {},
  strand_lingshi = {}
}) => {
  const whenError = img => {
    img.src = 'default-avatar.png'
  }

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
    <html>
      <head>
        <meta httpEquiv="content-type" content="text/html;charset=utf-8" />
        <LinkStyleSheet src={cssURL} />
        <style>
          {`
          body {
            width: 100%;
            text-align: center;
            background-image: url('${backgroundURL}');
            background-size: 100% auto;
          }

          @font-face {
            font-family: 'tttgbnumber';
            src: url('${tttgbnumberURL}');
            font-weight: normal;
            font-style: normal;
          }

          @font-face {
            font-family: 'NZBZ';
            src: url('${NZBZURL}');
            font-weight: normal;
            font-style: normal;
          }

          .user_top_img_bottom {
            margin: auto;
            background-image: url('${user_stateURL}');
            background-size: 100% auto;
            width: 280px;
            height: 280px;
          }
        `}
        </style>
      </head>

      <body>
        <div>
          <div className="header"></div>
          {/* 上 */}
          <div className="card_box">
            {/* 左 */}
            <div className="user_top_left">
              <div className="user_top_img_bottom">
                <img
                  className="user_top_img"
                  src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`}
                  onError={e => whenError(e.target)}
                />
              </div>
              <div className="user_top_font_left">{user_id}</div>
            </div>
            {/* 右 */}
            <div className="user_top_right">
              <div className="user_top_font_right">道号：{player.名号}</div>
              <div className="user_top_font_right">
                生命：
                <div className="blood_box">
                  <div className="blood_bar" style={strand_hp.style}></div>
                  <div className="blood_volume">
                    {player.当前血量}/{player.血量上限}
                  </div>
                </div>
              </div>
              <div className="user_top_font_right">等级：{najie.等级}</div>
              <div className="user_top_font_right">
                储量：
                <div className="blood_box">
                  <div className="blood_bar" style={strand_lingshi.style}></div>
                  <div className="blood_volume">
                    {najie.灵石}/{najie.灵石上限}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                      <div className="item_int">出售价：{item.出售价}灵石</div>
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
      </body>
    </html>
  )
}

export default Najie
