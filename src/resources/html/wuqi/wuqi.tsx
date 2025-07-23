import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from '../gongfa/gongfa.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import playerURL from '@src/resources/img/player/player.jpg'
import user_stateURL from '@src/resources/img/state/user_state.png'

const WuQi = ({ nickname, wuqi_have, wuqi_need }) => {
  return (
    <html>
      <head>
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
            width: 100%;
            text-align: center;
            background-image: url('${playerURL}');
            background-size: 100% auto;
          }

          .user_top_img_bottom {
            margin: auto;
            background-image: url('${user_stateURL}');
            background-size: 100% auto;
            width: 280px;
            height: 280px;
          }
        `
          }}
        >
          {}
        </style>
      </head>
      <body>
        <div className="header"></div>
        <div className="card_box">
          <div className="use_data">
            <div className="user_font user_font_title">{nickname}的装备</div>
          </div>
        </div>

        {wuqi_have && wuqi_have.length > 0 && (
          <div className="card_box">
            <div className="use_data">
              <div className="user_font user_font_title">【已拥有】</div>
              <div className="user_font wupin">
                {wuqi_have.map((item, index) => (
                  <div key={index} className="item">
                    <div
                      className="item_title font_item_title"
                      style={{ height: '45px' }}
                    >
                      {item.name}
                    </div>
                    <div className="item_int" style={{ paddingLeft: '38px' }}>
                      类型：{item.type}
                    </div>
                    {item.atk > 10 || item.def > 10 || item.HP > 10 ? (
                      <>
                        <div
                          className="item_int"
                          style={{ paddingLeft: '38px' }}
                        >
                          攻击：{item.atk}
                        </div>
                        <div
                          className="item_int"
                          style={{ paddingLeft: '38px' }}
                        >
                          防御：{item.def}
                        </div>
                        <div
                          className="item_int"
                          style={{ paddingLeft: '38px' }}
                        >
                          血量：{item.HP}
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="item_int"
                          style={{ paddingLeft: '38px' }}
                        >
                          攻击:{(item.atk * 100).toFixed(0)}%
                        </div>
                        <div
                          className="item_int"
                          style={{ paddingLeft: '38px' }}
                        >
                          防御:{(item.def * 100).toFixed(0)}%
                        </div>
                        <div
                          className="item_int"
                          style={{ paddingLeft: '38px' }}
                        >
                          血量:{(item.HP * 100).toFixed(0)}%
                        </div>
                      </>
                    )}
                    <div className="item_int" style={{ paddingLeft: '38px' }}>
                      暴击:{(item.bao * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {wuqi_need && wuqi_need.length > 0 && (
          <div className="card_box">
            <div className="use_data">
              <div className="user_font user_font_title">【未拥有】</div>
              <div className="user_font wupin">
                {wuqi_need.map((item, index) => (
                  <div key={index} className="item">
                    <div
                      className="item_title font_item_title"
                      style={{ height: '45px' }}
                    >
                      {item.name}
                    </div>
                    <div className="item_int" style={{ paddingLeft: '38px' }}>
                      类型：{item.type}
                    </div>
                    {item.atk > 10 || item.def > 10 || item.HP > 10 ? (
                      <>
                        <div
                          className="item_int"
                          style={{ paddingLeft: '38px' }}
                        >
                          攻击：{item.atk}
                        </div>
                        <div
                          className="item_int"
                          style={{ paddingLeft: '38px' }}
                        >
                          防御：{item.def}
                        </div>
                        <div
                          className="item_int"
                          style={{ paddingLeft: '38px' }}
                        >
                          血量：{item.HP}
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="item_int"
                          style={{ paddingLeft: '38px' }}
                        >
                          攻击:{(item.atk * 100).toFixed(0)}%
                        </div>
                        <div
                          className="item_int"
                          style={{ paddingLeft: '38px' }}
                        >
                          防御:{(item.def * 100).toFixed(0)}%
                        </div>
                        <div
                          className="item_int"
                          style={{ paddingLeft: '38px' }}
                        >
                          血量:{(item.HP * 100).toFixed(0)}%
                        </div>
                      </>
                    )}
                    <div className="item_int" style={{ paddingLeft: '38px' }}>
                      暴击:{(item.bao * 100).toFixed(0)}%
                    </div>
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

export default WuQi
