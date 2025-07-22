import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './tuzhi.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import tuzhiURL from '@src/resources/img/tuzhi/tuzhi.jpg'
import userStateURL from '@src/resources/img/state/user_state.png'

const Tuzhi = ({ tuzhi_list }) => {
  return (
    <html>
      <head>
        <meta httpEquiv="content-type" content="text/html;charset=utf-8" />
        <LinkStyleSheet src={cssURL} />
        <style dangerouslySetInnerHTML = {{
          _html:`
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
            background-image: url('${tuzhiURL}');
            background-size: 100% auto;
          }

          .user_top_img_bottom {
            margin: auto;
            background-image: url('${userStateURL}');
            background-size: 100% auto;
            width: 280px;
            height: 280px;
          }
        `
        }}>
          {}
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
                <div>图纸</div>
                <div style={{ fontSize: '0.8em' }}>炼制指令：#打造+武器名</div>
                <div style={{ fontSize: '0.8em' }}>
                  炼制成功率 = 炼制成功率 + 玩家职业等级成功率
                </div>
              </div>
              <div className="use_data_body">
                {tuzhi_list?.map((item, index) => (
                  <div key={index} className="user_font">
                    <div>
                      <div style={{ display: 'inline-block' }}>{item.name}</div>
                      <div className="rate">
                        基础成功率{~~(item.rate * 100)}%
                      </div>
                    </div>
                    {item.materials?.map((material, idx) => (
                      <div
                        key={idx}
                        className="info"
                        style={{ width: '130px' }}
                      >
                        {material.name}×{material.amount}
                      </div>
                    ))}
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

export default Tuzhi
