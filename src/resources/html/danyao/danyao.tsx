import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from '../gongfa/gongfa.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import NZBZURL from '@src/resources/font/NZBZ.ttf'
import playerURL from '@src/resources/img/player/player.jpg'
import user_stateURL from '@src/resources/img/state/user_state.png'

const Danyao = ({
  nickname,
  danyao_have = [],
  danyao2_have = [],
  danyao_need = []
}) => {
  const renderEffect = item => {
    const effects = []
    if (item.HP) effects.push(item.HP)
    if (item.exp) effects.push(item.exp)
    if (item.xueqi) effects.push(item.xueqi)
    if (item.xingyun > 0) effects.push(`${(item.xingyun * 100).toFixed(1)}%`)
    return effects.join('')
  }

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
        `
          }}
        />
      </head>

      <body>
        <div>
          <div className="header"></div>
          {/* 上 */}
          <div className="card_box">
            <div className="use_data">
              <div className="user_font user_font_title">{nickname}的丹药</div>
            </div>
          </div>

          {/* 下 */}
          {(danyao_have.length > 0 || danyao2_have.length > 0) && (
            <div className="card_box">
              <div className="use_data">
                <div className="user_font user_font_title">【已拥有】</div>
                <div className="user_font wupin">
                  {danyao_have.map((item, index) => (
                    <div key={`danyao_${index}`} className="item">
                      <div className="item_title font_item_title">
                        {item.name}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '38px' }}>
                        类型：{item.type}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '38px' }}>
                        效果：{renderEffect(item)}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '38px' }}>
                        价格：{item.出售价.toFixed(0)}
                      </div>
                    </div>
                  ))}

                  {danyao2_have.map((item, index) => (
                    <div key={`danyao2_${index}`} className="item">
                      <div className="item_title font_item_title">
                        {item.name}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '38px' }}>
                        类型：{item.type}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '38px' }}>
                        效果：{renderEffect(item)}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '38px' }}>
                        价格：{item.出售价.toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 下 */}
          {danyao_need.length > 0 && (
            <div className="card_box">
              <div className="use_data">
                <div className="user_font user_font_title">【未拥有】</div>
                <div className="user_font wupin">
                  {danyao_need.map((item, index) => (
                    <div key={`need_${index}`} className="item">
                      <div className="item_title font_item_title">
                        {item.name}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '38px' }}>
                        类型：{item.type}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '38px' }}>
                        效果：{renderEffect(item)}
                      </div>
                      <div className="item_int" style={{ paddingLeft: '38px' }}>
                        价格：{item.出售价.toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="user_bottom2"></div>
        </div>
      </body>
    </html>
  )
}

export default Danyao
