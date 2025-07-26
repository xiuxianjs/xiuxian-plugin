import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from '@src/resources/html/association/association.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import playerURL from '@src/resources/img/player.jpg'
import playerFooterURL from '@src/resources/img/player_footer.png'
import user_stateURL from '@src/resources/img/user_state.png'

const Association = ({
  user_id,
  ass,
  mainname,
  mainqq,
  weizhi,
  state,
  xiulian,
  level,
  fuzong,
  zhanglao,
  neimen,
  waimen
}) => {
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

          body {
            width: 100%;
            padding: 0;
            margin: 0;
            text-align: center;
            background-image: url('${playerURL}'), url('${playerFooterURL}');
            background-repeat: no-repeat, repeat;
            background-size: 100%, auto;
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
          {/* 上 */}
          <div className="user_top">
            <div className="user_top_left">
              <div className="user_top_img_bottom">
                <img
                  className="user_top_img"
                  src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`}
                />
              </div>
              <div className="user_top_left_qq">QQ:{user_id}</div>
            </div>
            <div className="user_top_right">
              <div
                className="user_font user_font"
                style={{ paddingLeft: '15px' }}
              >
                名称：{ass?.宗门名称}
              </div>
              <div className="user_font" style={{ paddingLeft: '15px' }}>
                宗主：{mainname}
                {mainqq}
              </div>
              <div className="user_font" style={{ paddingLeft: '15px' }}>
                等级：{ass?.宗门等级}
              </div>
              <div className="user_font" style={{ paddingLeft: '15px' }}>
                灵石: {ass?.灵石池}
              </div>
              <div className="user_font" style={{ paddingLeft: '15px' }}>
                人数: &nbsp;&nbsp;{ass?.所有成员?.length}
              </div>
              <div className="user_font" style={{ paddingLeft: '15px' }}>
                宗门位置：{weizhi}
              </div>
            </div>
          </div>

          <div className="user_bottom0"></div>
          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div
                  className="user_font"
                  style={{ textAlign: 'center', paddingLeft: '0px' }}
                >
                  [信息]
                </div>
                <div className="user_font">门派状态：{state}</div>
                <div className="user_font">天赋加强：{xiulian}%</div>
                <div className="user_font">大阵强度：{ass?.大阵血量}</div>
                <div className="user_font">入宗门槛：{level}</div>
                <div className="user_font">
                  宗门建设等级：{ass?.宗门建设等级}
                </div>
                <div className="user_font">镇宗神兽：{ass?.宗门神兽}</div>
              </div>
            </div>
          </div>

          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div
                  className="user_font"
                  style={{ textAlign: 'center', paddingLeft: '0px' }}
                >
                  [副宗主]
                </div>
                <div className="user_font">
                  {fuzong?.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div
                  className="user_font"
                  style={{ textAlign: 'center', paddingLeft: '0px' }}
                >
                  [长老]
                </div>
                <div className="user_font">
                  {zhanglao?.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 下 */}
          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div
                  className="user_font"
                  style={{ textAlign: 'center', paddingLeft: '0px' }}
                >
                  [内门弟子]
                </div>
                <div className="user_font">
                  {neimen?.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 下 */}
          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div
                  className="user_font"
                  style={{ textAlign: 'center', paddingLeft: '0px' }}
                >
                  [外门弟子]
                </div>
                <div className="user_font">
                  {waimen?.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div
                  className="user_font"
                  style={{ textAlign: 'center', paddingLeft: '0px' }}
                >
                  创立于: {ass?.创立时间?.[0]}
                </div>
              </div>
            </div>
          </div>
          <div className="user_bottom2"></div>
        </div>
      </body>
    </html>
  )
}

export default Association
