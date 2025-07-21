import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './valuables.css'
import valuablesTopURL from '@src/resources/img/valuables/valuables-top.jpg'
import valuablesDanyaoURL from '@src/resources/img/valuables/valuables-danyao.jpg'

const Valuables = () => {
  return (
    <html>
      <head>
        <meta httpEquiv="content-type" content="text/html;charset=utf-8" />
        <LinkStyleSheet src={cssURL} />
        <style>
          {`
          body {
            transform: scale(1);
            width: 100%;
            text-align: center;
          }

          .user_bottom0 {
            width: 100%;
            height: 285px;
            margin: auto;
            background-image: url('${valuablesTopURL}');
            background-size: 100% auto;
          }

          .user_bottom1 {
            margin: auto;
            background-image: url('${valuablesDanyaoURL}');
            background-size: 100% auto;
          }

          .user_bottom2 {
            width: 100%;
            margin: auto;
            background-image: url('${valuablesDanyaoURL}');
            background-size: 100% auto;
            padding-top: 20px;
          }
        `}
        </style>
      </head>

      <body>
        <div>
          <div className="user_float">
            <div className="use_data0">
              <div className="user_font_0">#万宝楼</div>
            </div>
          </div>

          {/*头部*/}
          <div className="user_bottom0"></div>

          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div className="user_font">修仙界最大的当铺</div>
                <div className="user_font">汇聚天下所有物品</div>
                <div className="user_font">快去秘境历练获得神器吧</div>
              </div>
            </div>
          </div>

          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div className="user_font">#功法楼</div>
                <div className="user_font">类型: 功法</div>
                <div className="user_font">查看全部功法价格</div>
              </div>
            </div>
          </div>

          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div className="user_font">#丹药楼</div>
                <div className="user_font">类型: 丹药</div>
                <div className="user_font">查看全部丹药价格</div>
              </div>
            </div>
          </div>

          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div className="user_font">#装备楼</div>
                <div className="user_font">类型: 装备</div>
                <div className="user_font">查看全部装备价格</div>
              </div>
            </div>
          </div>

          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div className="user_font">#道具楼</div>
                <div className="user_font">类型: 道具</div>
                <div className="user_font">查看全部道具价格</div>
              </div>
            </div>
          </div>

          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div className="user_font">#仙宠楼</div>
                <div className="user_font">类型: 仙宠</div>
                <div className="user_font">查看全部仙宠价格</div>
              </div>
            </div>
          </div>
          {/*底部*/}

          <div className="user_bottom2"></div>
        </div>
      </body>
    </html>
  )
}

export default Valuables
