import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './talent.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import talentURL from '@src/resources/img/talent/talent.jpg'
import user_stateURL from '@src/resources/img/state/user_state.png'

const Talent = ({ talent_list = [] }) => {
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
            text-align: center;
            background-image: url('${talentURL}');
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
                <div>灵根列表</div>
              </div>
              <div className="use_data_body">
                {talent_list.map((item, index) => (
                  <div key={index} className="user_font">
                    <div>
                      <div style={{ display: 'inline-block' }}>
                        【{item.type}】{item.name}
                      </div>
                    </div>
                    <div className="info" style={{ width: '200px' }}>
                      修炼效率：{item.eff * 100}%
                    </div>
                    <div className="info" style={{ width: '200px' }}>
                      额外增伤：{item.法球倍率 * 100}%
                    </div>
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

export default Talent
