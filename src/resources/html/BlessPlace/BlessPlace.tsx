import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './BlessPlace.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import secretPlaceURL from '@src/resources/img/fairyrealm.jpg'
import userStateURL from '@src/resources/img/user_state.png'
import cardURL from '@src/resources/img/road.jpg'

const SecretPlace = ({ didian_list }) => {
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
            background-image: url('${secretPlaceURL}');
            background-size: 100% auto;
          }

          .user_top_img_bottom {
            margin: auto;
            background-image: url('${userStateURL}');
            background-size: 100% auto;
            width: 280px;
            height: 280px;
          }

          .card {
            border-radius: 20px;
            background-size: cover;
            background-image: url('${cardURL}');
          }
        `
          }}
        />
      </head>

      <body>
        <div>
          <div className="user_bottom1">
            <div className="use_data">
              <div
                className="user_font head"
                style={{ textAlign: 'center', paddingLeft: '0px' }}
              >
                <div>洞天福地</div>
              </div>
            </div>
            {didian_list?.map((item, index) => (
              <div key={index} className="use_data">
                <div className="card">
                  <div className="use_data_head">
                    <div className="user_font">
                      <div>
                        <div style={{ display: 'inline-block' }}>
                          【入驻宗门:{item.ass}】{item.name}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="use_data_body">
                    <div className="user_font">
                      福地等级: {item.level}
                      <br />
                      修炼效率: {item.efficiency}
                      <br />
                      <div></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </body>
    </html>
  )
}

export default SecretPlace
