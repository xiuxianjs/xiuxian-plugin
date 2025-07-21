import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './time_place.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import timePlaceURL from '@src/resources/img/time_place/time_place.jpg'
import userStateURL from '@src/resources/img/state/user_state.png'

const TimePlace = ({ didian_list }) => {
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
            background-image: url('${timePlaceURL}');
            background-size: 100% auto;
          }

          .user_top_img_bottom {
            margin: auto;
            background-image: url('${userStateURL}');
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
                className="user_font head"
                style={{ textAlign: 'center', paddingLeft: '0px' }}
              >
                <div>仙府</div>
                <span style={{ fontSize: '0.8em' }}>指令：#探索仙府</span>
              </div>
            </div>
            {didian_list?.map((item, index) => (
              <div key={index} className="use_data">
                <div className="card">
                  <div className="use_data_head">
                    <div className="user_font">
                      <div>
                        <div style={{ display: 'inline-block' }}>
                          【{item.Grade}】{item.name}
                        </div>
                        <div className="price">{item.Price}灵石</div>
                      </div>
                    </div>
                  </div>
                  <div className="use_data_body">
                    <div className="user_font">
                      <div>
                        <div>
                          <div className="info">低级奖励：</div>
                          <div style={{ paddingLeft: '20px' }}>
                            {item.one?.map((thing, idx) => (
                              <div key={idx} className="info2">
                                {thing.name}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="info">中级奖励：</div>
                          <div style={{ paddingLeft: '20px' }}>
                            {item.two?.map((thing, idx) => (
                              <div key={idx} className="info2">
                                {thing.name}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="info">高级奖励：</div>
                          <div style={{ paddingLeft: '20px' }}>
                            {item.three?.map((thing, idx) => (
                              <div key={idx} className="info2">
                                {thing.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
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

export default TimePlace
