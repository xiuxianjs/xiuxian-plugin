import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './shop.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import backgroundURL from '@src/resources/img/najie.jpg'
import user_stateURL from '@src/resources/img/user_state.png'

const Shop = ({ name, level, state, thing = [] }) => {
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
            background-image: url('${backgroundURL}');
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
        <div className="user_bottom1">
          <div className="use_data">
            <div className="use_data_head">
              <div
                className="user_font"
                style={{ textAlign: 'center', paddingLeft: '0px' }}
              >
                [{name}]
              </div>
              <div
                className="user_font"
                style={{ textAlign: 'center', paddingLeft: '0px' }}
              >
                难度:{level}
              </div>
              <div
                className="user_font"
                style={{ textAlign: 'center', paddingLeft: '0px' }}
              >
                状态:{state}
              </div>
              <div className="user_font2">
                {thing.map((item, index) => (
                  <div
                    key={index}
                    className="user_font3"
                    style={{ position: 'relative' }}
                  >
                    <div style={{ paddingLeft: '10px' }}>{item.name}</div>
                    <div
                      style={{
                        position: 'absolute',
                        right: '0',
                        paddingRight: '10px'
                      }}
                    >
                      数量:{item.数量}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="user_bottom2"></div>
      </body>
    </html>
  )
}

export default Shop
