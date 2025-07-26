import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './gongfa.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import playerURL from '@src/resources/img/player.jpg'
import playerFooterURL from '@src/resources/img/player_footer.png'
import user_stateURL from '@src/resources/img/user_state.png'

const Gongfa = ({ nickname, gongfa_need = [], gongfa_have = [] }) => {
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

          <div className="card_box">
            <div className="use_data">
              <div className="user_font user_font_title">{nickname}的功法</div>
            </div>
          </div>

          {gongfa_need.length > 0 && (
            <div className="card_box">
              <div className="use_data">
                <div className="user_font user_font_title">【未学习】</div>
                <div className="user_font wupin">
                  {gongfa_need.map((item, index) => (
                    <div key={index} className="item">
                      <div
                        className="item_title font_item_title"
                        style={{ height: '45px' }}
                      >
                        {item.name}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '38px' }}>
                        修炼加成：{(item.修炼加成 * 100).toFixed(0)}%
                      </div>
                      <div className="item_int" style={{ paddingLeft: '38px' }}>
                        价格：{item.出售价.toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {gongfa_have.length > 0 && (
            <div className="card_box">
              <div className="use_data">
                <div className="user_font user_font_title">【已学习】</div>
                <div className="user_font wupin">
                  {gongfa_have.map((item, index) => (
                    <div key={index} className="item">
                      <div
                        className="item_title font_item_title"
                        style={{ height: '45px' }}
                      >
                        {item.name}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '38px' }}>
                        修炼加成：{(item.修炼加成 * 100).toFixed(0)}%
                      </div>
                      <div className="item_int" style={{ paddingLeft: '38px' }}>
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

export default Gongfa
