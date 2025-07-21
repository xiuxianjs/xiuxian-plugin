import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './ningmenghome.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import ningmenghomeURL from '@src/resources/img/ningmenghome/ningmenghome.jpg'
import userStateURL from '@src/resources/img/state/user_state.png'

const Ningmenghome = ({ commodities_list }) => {
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
            background-image: url('${ningmenghomeURL}');
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
                className="user_font use_data_head"
                style={{ textAlign: 'center', paddingLeft: '0px' }}
              >
                <div>柠檬堂</div>
                <div style={{ fontSize: '0.8em' }}>购买指令：#购买+物品名</div>
                <div style={{ fontSize: '0.8em' }}>
                  筛选指令：#柠檬堂+物品类型
                </div>
              </div>
              <div className="use_data_body">
                {commodities_list?.map((item, index) => (
                  <div key={index} className="user_font">
                    <div>
                      <div style={{ display: 'inline-block' }}>
                        【{item.type}】{item.name}
                      </div>
                      <div className="price">{item.出售价 * 1.2}灵石</div>
                    </div>
                    {item.class === '装备' && (
                      <>
                        <div className="info" style={{ width: '130px' }}>
                          攻：{item.atk}
                        </div>
                        <div className="info" style={{ width: '130px' }}>
                          防：{item.def}
                        </div>
                        <div className="info" style={{ width: '130px' }}>
                          血：{item.HP}
                        </div>
                        <div className="info" style={{ width: '130px' }}>
                          暴：{item.bao * 100}%
                        </div>
                      </>
                    )}
                    {item.class === '丹药' && (
                      <div className="info">
                        效果：{item.HP / 1000}%{item.exp}
                        {item.xueqi}
                      </div>
                    )}
                    {item.class === '功法' && (
                      <div className="info">
                        修炼加成：{(item.修炼加成 * 100).toFixed(0)}%
                      </div>
                    )}
                    {item.class === '道具' && (
                      <div className="info">描述：{item.desc}</div>
                    )}
                    {item.class === '草药' && (
                      <div className="info">描述：{item.desc}</div>
                    )}
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

export default Ningmenghome
