import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from '../gongfa/gongfa.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import playerURL from '@src/resources/img/player.jpg'
import playerFooterURL from '@src/resources/img/player_footer.png'
import user_stateURL from '@src/resources/img/user_state.png'

const Daoju = ({ nickname, daoju_have = [], daoju_need = [] }) => {
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
            width: 100%;
            padding: 0;
            margin: 0;
            text-align: center;
            background-image: url('${playerURL}'), url('${playerFooterURL}');
            background-repeat: no-repeat, repeat;
            background-size: 100%, auto;
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
        />
      </head>

      <body>
        <div>
          <div className="header"></div>
          {/* 上 */}
          <div className="card_box">
            <div className="use_data">
              <div className="user_font user_font_title">{nickname}的道具</div>
            </div>
          </div>

          {/* 下 */}
          {daoju_have.length > 0 && (
            <div className="card_box">
              <div className="use_data">
                <div className="user_font user_font_title">【已拥有】</div>
                <div className="user_font wupin">
                  {daoju_have.map((item, index) => (
                    <div key={index} className="item">
                      <div className="item_title font_item_title">
                        {item.name}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '26px' }}>
                        类型：{item.name}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '26px' }}>
                        描述：{item.desc}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '26px' }}>
                        价格：{item.出售价.toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 下 */}
          {daoju_need.length > 0 && (
            <div className="card_box">
              <div className="use_data">
                <div className="user_font user_font_title">【未拥有】</div>
                <div className="user_font wupin">
                  {daoju_need.map((item, index) => (
                    <div key={index} className="item">
                      <div className="item_title font_item_title">
                        {item.name}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '26px' }}>
                        类型：{item.name}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '26px' }}>
                        描述：{item.desc}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '26px' }}>
                        价格：{item.出售价.toFixed(0)}
                      </div>
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

export default Daoju
