import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from '../supermarket/supermarket.css'
import tttgbnumberURL from '../../font/tttgbnumber.ttf'
import supermarketURL from '../../img/supermarket/supermarket.jpg'
import user_stateURL from '../../img/state/user_state.png'

const Msg = ({ type, msg }) => {
  return (
    <html>
      <head>
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
            text-align: center;
            background-image: url('${supermarketURL}');
            background-size: 100% auto;
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
          <div className="user_bottom1">
            <div className="use_data">
              <div
                className="user_font use_data_head"
                style={{ textAlign: 'center', paddingLeft: '0px' }}
              >
                {type === 0 && (
                  <>
                    <div>悬赏目标</div>
                    <div style={{ fontSize: '0.8em' }}>
                      指令：#讨伐目标+数字
                    </div>
                  </>
                )}
                {type === 1 && (
                  <>
                    <div>悬赏榜</div>
                    <div style={{ fontSize: '0.8em' }}>
                      指令：#刺杀目标+数字
                    </div>
                  </>
                )}
              </div>
              <div className="use_data_body">
                {msg &&
                  msg.map((item, index) => (
                    <div key={index} className="user_font">
                      <div className="info">名号：{item.名号}</div>
                      <div className="number">No.{index + 1}</div>
                      <div className="info">赏金：{item.赏金}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

export default Msg
