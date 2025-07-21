import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './tujian.css'
import tttgbnumberURL from '../../font/tttgbnumber.ttf'
import ningmenghomeURL from '../../img/ningmenghome/ningmenghome.jpg'
import user_stateURL from '../../img/state/user_state.png'

const TuJian = ({ commodities_list }) => {
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
            background-image: url('${ningmenghomeURL}');
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
                <div>斩首神器堂</div>
              </div>
              <div className="use_data_body">
                {commodities_list &&
                  commodities_list.map((item, index) => (
                    <div key={index} className="user_font">
                      <div>
                        <div style={{ display: 'inline-block' }}>
                          【{item.desc[0]}
                          {item.type}】{item.name}
                        </div>
                      </div>
                      {item.class === '装备' && (
                        <>
                          <div className="info" style={{ width: '600px' }}>
                            契合元素：【{item.desc[4]}】
                          </div>
                          <div className="info" style={{ width: '600px' }}>
                            锋利度：{item.atk}
                          </div>
                          <div className="info" style={{ width: '600px' }}>
                            刃体强度：{item.def}
                          </div>
                          <div className="info" style={{ width: '600px' }}>
                            血晶核：{item.HP}
                          </div>
                          <div className="info" style={{ width: '600px' }}>
                            元素爆发率：{item.bao * 100}%
                          </div>
                          <div className="info" style={{ width: '999px' }}>
                            特性{item.desc[1]}
                          </div>
                          <div className="info" style={{ width: '600px' }}>
                            {item.desc[2]}
                          </div>
                          <div className="info" style={{ width: '600px' }}>
                            {item.desc[3]}
                          </div>
                          <div className="info" style={{ width: '600px' }}>
                            获取途径:{item.tujin}
                          </div>
                        </>
                      )}
                      {item.class === '丹药' && (
                        <div className="info">
                          {item.type}：
                          {item.type === '修为'
                            ? item.exp
                            : item.type === '血气'
                              ? item.xueqi
                              : item.type === '血量'
                                ? item.HP
                                : ''}
                        </div>
                      )}
                      {item.class === '功法' && (
                        <div className="info">
                          修炼加成：{item.修炼加成 * 100}%
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

export default TuJian
