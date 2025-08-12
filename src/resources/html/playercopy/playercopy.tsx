import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './player.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'

import playerURL from '@src/resources/img/player.jpg'
import playerFooterURL from '@src/resources/img/player_footer.png'
import userStateURL from '@src/resources/img/user_state.png'

const PlayerCopy = ({
  user_id,
  nickname,
  player_nowHP,
  player_maxHP,
  levelMax,
  xueqi,
  need_xueqi,
  lingshi,
  association,
  learned_gongfa
}) => {
  return (
    <html>
      <head>
        <LinkStyleSheet src={cssURL} />
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
            background-image: url('${userStateURL}');
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
          {/*上*/}
          <div className="user_top">
            <div className="user_top_left">
              <div className="user_top_img_bottom">
                <img
                  className="user_top_img"
                  src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`}
                />
              </div>
              <div className="user_top_left_qq">QQ:{user_id}</div>
            </div>
            <div className="user_top_right">
              <div
                className="user_font user_font"
                style={{ paddingLeft: '15px' }}
              >
                道号：{nickname}
              </div>
              <div className="user_font" style={{ paddingLeft: '15px' }}>
                血量：{player_nowHP} / {player_maxHP}
              </div>
              <div className="user_font" style={{ paddingLeft: '15px' }}>
                体境：{levelMax}
              </div>
              <div className="user_font" style={{ paddingLeft: '15px' }}>
                气血：{xueqi} / {need_xueqi}
              </div>
              <div className="user_font" style={{ paddingLeft: '15px' }}>
                灵石：{lingshi}
              </div>
            </div>
          </div>

          <div className="user_bottom0"></div>

          {/*下*/}
          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div
                  className="user_font"
                  style={{ textAlign: 'center', paddingLeft: '0px' }}
                >
                  【我的宗门】
                </div>
                <div className="user_font">
                  宗门名称：{association?.宗门名称}
                </div>
                <div className="user_font">职位：{association?.职位}</div>
              </div>
            </div>
          </div>

          {/*下*/}
          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div
                  className="user_font"
                  style={{ textAlign: 'center', paddingLeft: '0px' }}
                >
                  【已学功法】
                </div>
                <div className="user_font gonfa">
                  {learned_gongfa?.map((item, index) => (
                    <div key={index} className="gonfa2">
                      《{item}》
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/*下*/}
          <div className="user_bottom2"></div>
        </div>
      </body>
    </html>
  )
}

export default PlayerCopy
