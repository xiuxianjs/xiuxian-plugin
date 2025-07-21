import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from '../supermarket/supermarket.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import supermarketURL from '@src/resources/img/supermarket/supermarket.jpg'
import user_stateURL from '@src/resources/img/state/user_state.png'

const Forum = ({ Forum: forumData }) => {
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
                <div>聚宝堂</div>
                <div style={{ fontSize: '0.8em' }}>
                  发布指令：#发布+物品名*价格*数量
                </div>
                <div style={{ fontSize: '0.8em' }}>
                  接取指令：#接取+编号*数量
                </div>
                <div style={{ fontSize: '0.8em' }}>取消指令：#取消+编号</div>
              </div>
              <div className="use_data_body">
                {forumData &&
                  forumData.map((item, index) => (
                    <div key={index} className="user_font">
                      <div>
                        <div style={{ display: 'inline-block' }}>
                          【{item.class}】{item.name}
                        </div>
                        <div className="number">No.{item.num}</div>
                      </div>
                      <div className="info">单价：{item.price}</div>
                      <div className="info">数量：{item.aconut}</div>
                      <div className="info">总价：{item.whole}</div>
                      <div className="info">QQ：{item.qq}</div>
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

export default Forum
