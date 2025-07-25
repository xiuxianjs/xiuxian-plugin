import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './shitu.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'

import playerURL from '@src/resources/img/player.jpg'
import playerFooterURL from '@src/resources/img/player_footer.png'
import userStateURL from '@src/resources/img/user_state.png'

const Shitu = ({
  user_id,
  minghao,
  renwu,
  tudinum,
  newchengyuan,
  shimen,
  rw1,
  wancheng1,
  rw2,
  wancheng2,
  rw3,
  wancheng3,
  chengyuan
}) => {
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
            background-image: url('${userStateURL}');
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
            <div className="user_font" style={{ paddingLeft: '15px' }}>
              名号:{minghao}
            </div>
            <div className="user_font" style={{ paddingLeft: '15px' }}>
              任务阶段: {renwu}
            </div>
            <div className="user_font" style={{ paddingLeft: '15px' }}>
              师门人数: {tudinum}
            </div>
            <div className="user_font" style={{ paddingLeft: '15px' }}>
              未出师徒弟: {newchengyuan}
            </div>
            <div
              className="user_font user_font"
              style={{ paddingLeft: '15px' }}
            >
              师徒积分：{shimen}
            </div>
          </div>
        </div>

        <div className="user_bottom0"></div>
        <div className="user_bottom1">
          <div className="use_data">
            <div className="use_data_head">
              <div
                className="user_font"
                style={{ textAlign: 'center', paddingLeft: '0px' }}
              >
                [师徒任务]
              </div>
              <div className="user_font">任务1：</div>
              <div className="user_font">
                {rw1}
                {wancheng1}
              </div>
              <div className="user_font">任务2：</div>
              <div className="user_font">
                {rw2}
                {wancheng2}
              </div>
              <div className="user_font">任务3：</div>
              <div className="user_font">
                {rw3}
                {wancheng3}
              </div>
            </div>
          </div>
        </div>

        <div className="user_bottom1">
          <div className="use_data">
            <div className="use_data_head">
              <div
                className="user_font"
                style={{ textAlign: 'center', paddingLeft: '0px' }}
              >
                [座下门徒]
              </div>
              <div className="user_font">
                {chengyuan?.map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

export default Shitu
