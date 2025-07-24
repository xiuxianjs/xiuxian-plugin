import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from '../state/state.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import stateBgURL from '@src/resources/img/state.jpg'
import userStateURL from '@src/resources/img/user_state.png'

const Immortal = ({ allplayer = [] }) => {
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
            background-image: url('${stateBgURL}');
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
          }}
        />
      </head>

      <body>
        <div>
          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div className="user_font"></div>
              </div>
            </div>
          </div>

          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div className="user_font">#至尊榜</div>
              </div>
            </div>
          </div>

          {allplayer.map((item, index) => (
            <div key={index} className="user_bottom1">
              <div className="use_data">
                <div className="use_data_head">
                  <div className="user_font">
                    [第{index + 1}名]{item.name}
                  </div>
                  <div className="user_font">道号: {item.name}</div>
                  <div className="user_font">战力: {item.power}</div>
                  <div className="user_font">QQ: {item.qq}</div>
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

export default Immortal
