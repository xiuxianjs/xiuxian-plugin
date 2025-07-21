import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from '../ningmenghome/ningmenghome.css'
import tttgbnumberURL from '../../font/tttgbnumber.ttf'
import ningmenghomeURL from '../../img/ningmenghome/ningmenghome.jpg'
import user_stateURL from '../../img/state/user_state.png'

const ZongMeng = ({ temp }) => {
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
                <div>宗门列表</div>
              </div>
              <div className="use_data_body">
                {temp &&
                  temp.map((item, index) => (
                    <div key={index} className="user_font">
                      <div className="info">宗门名称：{item.宗名}</div>
                      <br />
                      <div className="info">
                        宗门人数：{item.人数}/{item.宗门人数上限}
                      </div>
                      <br />
                      <div className="info">宗门类型：{item.位置}</div>
                      <br />
                      <div className="info">宗门等级：{item.等级}</div>
                      <br />
                      <div className="info">天赋加成：{item.天赋加成}%</div>
                      <br />
                      <div className="info">建设等级：{item.宗门建设等级}</div>
                      <br />
                      <div className="info">镇宗神兽：{item.镇宗神兽}</div>
                      <br />
                      <div className="info">宗门驻地：{item.宗门驻地}</div>
                      <br />
                      <div className="info">加入门槛：{item.最低加入境界}</div>
                      <br />
                      <div className="info">
                        宗主Q&nbsp;&nbsp;Q：{item.宗主}
                      </div>
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

export default ZongMeng
