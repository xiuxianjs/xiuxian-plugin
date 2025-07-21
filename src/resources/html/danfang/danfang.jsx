import { LinkStyleSheet } from 'jsxp'
import cssURL from './danfang.css'
import tttgbnumberURL from '../../font/tttgbnumber.ttf'
import danfangURL from '../../img/danfang/danfang.jpg'
import user_stateURL from '../../img/state/user_state.png'

const Danfang = ({ danfang_list }) => {
  const renderItemInfo = item => {
    switch (item.type) {
      case '血量':
        return item.HP
      case '修为':
        return item.exp2
      case '血气':
        return item.exp2
      default:
        return ''
    }
  }

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
            background-image: url('${danfangURL}');
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
                <div>丹方</div>
                <div style={{ fontSize: '0.8em' }}>炼制指令：#炼制+丹药名</div>
                <div style={{ fontSize: '0.8em' }}>
                  炼制成功率 = 丹方成功率 + 玩家职业等级成功率
                </div>
              </div>
              <div className="use_data_body">
                {danfang_list?.map((item, index) => (
                  <div key={index} className="user_font">
                    <div>
                      <div style={{ display: 'inline-block' }}>
                        【{item.type}】{item.name}
                      </div>
                      <div className="rate" style={{ width: '50px' }}>
                        {Math.floor(item.rate * 100)}%
                      </div>
                      <div className="rate" style={{ width: '50px' }}>
                        lv.{item.level_limit}
                      </div>
                    </div>
                    <div className="info">
                      {item.type}：{renderItemInfo(item)}
                    </div>
                    <div>
                      <div className="info">配方：</div>
                      <div style={{ padding: '10px' }}>
                        {item.materials?.map((material, materialIndex) => (
                          <div
                            key={materialIndex}
                            className="info"
                            style={{ width: '250px' }}
                          >
                            {material.name}×{material.amount}
                          </div>
                        ))}
                      </div>
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

export default Danfang
