import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from '../ningmenghome/ningmenghome.css'
import tttgbnumberURL from '../../font/tttgbnumber.ttf'
import ningmenghomeURL from '../../img/ningmenghome/ningmenghome.jpg'
import userStateURL from '../../img/state/user_state.png'

const Shitujifen = ({ name, jifen, commodities_list }) => {
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
                <div>师徒商店</div>
                <div style={{ fontSize: '0.8em' }}>
                  购买指令：#师徒兑换+物品名
                </div>
                <div style={{ fontSize: '0.8em' }}>
                  {name}的积分：{jifen}
                </div>
              </div>
              <div className="use_data_body">
                {commodities_list?.map((item, index) => (
                  <div key={index} className="user_font">
                    <div>
                      <div style={{ display: 'inline-block' }}>
                        【{item.type}】{item.name}
                      </div>
                      <div className="price">{item.积分}积分</div>
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
                        效果：{item.exp}
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

export default Shitujifen
