import { LinkStyleSheet } from 'jsxp'
import cssURL from '../gongfa/gongfa.css'
import tttgbnumberURL from '../../font/tttgbnumber.ttf'
import NZBZURL from '../../font/NZBZ.TTF'
import playerURL from '../../img/player/player.jpg'
import user_stateURL from '../../img/state/user_state.png'

const XianChong = ({ nickname, XianChong_have, XianChong_need, Kouliang }) => {
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

          @font-face {
            font-family: 'NZBZ';
            src: url('${NZBZURL}');
            font-weight: normal;
            font-style: normal;
          }

          body {
            width: 100%;
            text-align: center;
            background-image: url('${playerURL}');
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
          <div className="header"></div>
          <div className="card_box">
            <div className="use_data">
              <div className="user_font user_font_title">{nickname}的仙宠</div>
            </div>
          </div>
        </div>

        {XianChong_have && XianChong_have.length > 0 && (
          <div className="card_box">
            <div className="use_data">
              <div className="user_font user_font_title">【已拥有】</div>
              <div className="user_font wupin">
                {XianChong_have.map((item, index) => (
                  <div key={index} className="item">
                    <div className="item_title font_item_title">
                      {item.name}
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      类型：{item.type}
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      初始加成：{item.初始加成 * 100}%
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      每级增加：{item.每级增加 * 100}%
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      加成：{item.加成 * 100}%
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      灵魂绑定：{item.灵魂绑定 === 0 ? '否' : '是'}
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      品级：{item.品级}
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      等级上限：{item.等级上限}
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      价格：{item.出售价}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {XianChong_need && XianChong_need.length > 0 && (
          <div className="card_box">
            <div className="use_data">
              <div className="user_font user_font_title">【未拥有】</div>
              <div className="user_font wupin">
                {XianChong_need.map((item, index) => (
                  <div key={index} className="item">
                    <div className="item_title font_item_title">
                      {item.name}
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      类型：{item.type}
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      初始加成：{item.初始加成 * 100}%
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      每级增加：{item.每级增加 * 100}%
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      加成：{item.加成 * 100}%
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      灵魂绑定：{item.灵魂绑定 === 0 ? '否' : '是'}
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      品级：{item.品级}
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      等级上限：{item.等级上限}
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      价格：{item.出售价}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="card_box">
          <div className="use_data">
            <div className="user_font user_font_title">【口粮图鉴】</div>
            <div className="user_font wupin">
              {Kouliang &&
                Kouliang.map((item, index) => (
                  <div key={index} className="item">
                    <div className="item_title font_item_title">
                      {item.name}
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      等级：{item.level}
                    </div>
                    <div className="item_int" style={{ paddingLeft: '26px' }}>
                      价格：{item.出售价.toFixed(0)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="user_bottom2"></div>
      </body>
    </html>
  )
}

export default XianChong
