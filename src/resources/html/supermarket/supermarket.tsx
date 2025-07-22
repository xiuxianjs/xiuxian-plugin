import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './supermarket.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import supermarketURL from '@src/resources/img/supermarket/supermarket.jpg'
import user_stateURL from '@src/resources/img/state/user_state.png'

const Supermarket = ({ Exchange_list }) => {
  return (
    <html>
      <head>
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
              <div
                className="user_font use_data_head"
                style={{ textAlign: 'center', paddingLeft: '0px' }}
              >
                <div>冲水堂</div>
                <div style={{ fontSize: '0.8em' }}>
                  上架指令：#上架+物品名*价格*数量
                </div>
                <div style={{ fontSize: '0.8em' }}>
                  选购指令：#选购+编号*数量
                </div>
                <div style={{ fontSize: '0.8em' }}>下架指令：#下架+编号</div>
              </div>
              <div className="use_data_body">
                {Exchange_list &&
                  Exchange_list.map((item, index) => (
                    <div key={index} className="user_font">
                      <div>
                        {item.name.class === '装备' ? (
                          <div style={{ display: 'inline-block' }}>
                            【{item.name.class}】{item.name.name}【{item.pinji}
                            】
                          </div>
                        ) : (
                          <div style={{ display: 'inline-block' }}>
                            【{item.name.class}】{item.name.name}
                          </div>
                        )}
                        <div className="number">No.{item.num}</div>
                      </div>
                      {item.name.class === '装备' && (
                        <>
                          {item.name.atk > 10 ||
                          item.name.def > 10 ||
                          item.name.HP > 10 ? (
                            <>
                              <div className="info">属性:无</div>
                              <div className="info">
                                攻击：{item.name.atk.toFixed(0)}
                              </div>
                              <div className="info">
                                防御：{item.name.def.toFixed(0)}
                              </div>
                              <div className="info">
                                血量：{item.name.HP.toFixed(0)}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="info">
                                属性:
                                {
                                  ['金', '木', '土', '水', '火'][
                                    item.name.id - 1
                                  ]
                                }
                              </div>
                              <div className="info">
                                攻击：{(item.name.atk * 100).toFixed(0)}%
                              </div>
                              <div className="info">
                                防御：{(item.name.def * 100).toFixed(0)}%
                              </div>
                              <div className="info">
                                血量：{(item.name.HP * 100).toFixed(0)}%
                              </div>
                            </>
                          )}
                          <div className="info">
                            暴：{(item.name.bao * 100).toFixed(0)}%
                          </div>
                        </>
                      )}
                      {item.name.class === '仙宠' && (
                        <div className="info">
                          等级：{item.name.等级.toFixed(0)}
                        </div>
                      )}
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

export default Supermarket
