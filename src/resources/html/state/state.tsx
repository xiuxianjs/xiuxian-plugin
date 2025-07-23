import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './state.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import stateURL from '@src/resources/img/state.jpg'
import user_stateURL from '@src/resources/img/user_state.png'

const State = ({ Level_list = [] }) => {
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
            text-align: center;
            background-image: url('${stateURL}');
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
        <div>
          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div className="user_font">#练气境界</div>
              </div>
            </div>
          </div>

          {Level_list.map((item, index) => (
            <div key={index} className="user_bottom1">
              <div className="use_data">
                <div className="use_data_head">
                  <div className="user_font">
                    <div>境界：{item.level}</div>
                    <div>突破修为：{item.exp}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="user_bottom2"></div>
        </div>
      </body>
    </html>
  )
}

export default State
