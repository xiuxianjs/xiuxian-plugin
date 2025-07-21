import { LinkStyleSheet } from 'jsxp'
import cssURL from '../state/state.css'
import tttgbnumberURL from '../../font/tttgbnumber.ttf'
import stateURL from '../../img/state/state.jpg'
import user_stateURL from '../../img/state/user_state.png'

const RankingPower = ({
  user_id,
  nickname,
  level,
  exp,
  usr_paiming,
  allplayer
}) => {
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
            background-image: url('${stateURL}');
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
          <div className="user_top">
            <div className="user_top_left">
              <div className="user_top_img_bottom">
                <img
                  className="user_top_img"
                  src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`}
                  onError={e => {
                    e.target.src = '../../img/default_avatar.png'
                  }}
                />
              </div>
              <div className="user_top_left_qq">QQ:{user_id}</div>
            </div>
            <div className="user_top_right">
              <div
                className="user_font user_font"
                style={{ textAlign: 'left' }}
              >
                道号:{nickname}
              </div>
              <div className="user_font" style={{ textAlign: 'left' }}>
                境界:{level}
              </div>
              <div className="user_font" style={{ textAlign: 'left' }}>
                修为:{exp}
              </div>
              <div className="user_font" style={{ textAlign: 'left' }}>
                排名:第{usr_paiming}名
              </div>
            </div>
          </div>

          <div className="user_bottom0"></div>

          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div className="user_font">#天榜</div>
              </div>
            </div>
          </div>

          {allplayer &&
            allplayer.map((item, index) => (
              <div key={index} className="user_bottom1">
                <div className="use_data">
                  <div className="use_data_head">
                    <div className="user_font">
                      [第{item.名次}名] {item.名号}
                    </div>
                    <div className="user_font">&gt;&gt;境界: {item.境界}</div>
                    <div className="user_font">
                      &nbsp;&nbsp;修为:{item.总修为}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          <div className="user_bottom2"></div>
        </div>
      </body>
    </html>
  )
}

export default RankingPower
