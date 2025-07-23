import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './shenbing.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import stateURL from '@src/resources/img/state.jpg'
import userStateURL from '@src/resources/img/user_state.png'

const Shenbing = ({ newwupin }) => {
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
        {/*头部*/}

        <div className="user_bottom1">
          <div className="use_data">
            <div className="use_data_head">
              <div className="user_font">神兵榜</div>
            </div>
          </div>
        </div>

        {newwupin?.map((item, index) => (
          <div key={index} className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div className="user_font">
                  No.{index + 1}
                  <br />
                  兵器名:{item.name}
                  <br />
                  类&nbsp;&nbsp;别:{item.type}
                  <br />
                  缔造者:{item.制作者}
                  <br />
                  持兵者:{item.使用者}
                  <br />
                  灵韵值:{item.评分}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/*底部*/}

        <div className="user_bottom2"></div>
      </body>
    </html>
  )
}

export default Shenbing
