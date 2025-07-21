import { LinkStyleSheet } from 'jsxp'
import commonCssURL from './common.css'
import helpCssURL from './help.css'
import backgroundURL from '../../img/help/xiuxian.jpg'
import iconURL from '../../img/help/icon.png'

const Help = ({ helpData = [] }) => {
  return (
    <html>
      <head>
        <meta httpEquiv="content-type" content="text/html;charset=utf-8" />
        <LinkStyleSheet src={commonCssURL} />
        <LinkStyleSheet src={helpCssURL} />
        <style>
          {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-user-select: none;
            user-select: none;
          }

          body {
            font-size: 18px;
            color: #47ada8;
            font-family: PingFangSC-Medium, PingFang SC, sans-serif;
            transform: scale(1);
            width: 100%;
            background: url('${backgroundURL}') top left no-repeat;
            background-size: 100% 100%;
          }

          .container {
            width: 100%;
            padding: 40px !important;
          }

          .help-icon {
            width: 40px;
            height: 40px;
            display: block;
            position: absolute;
            background: url('${iconURL}') 0 0 no-repeat;
            background-size: 500px auto;
            border-radius: 5px;
            left: 6px;
            top: 12px;
            transform: scale(0.85);
          }
        `}
        </style>
      </head>

      <body className="elem-default default-mode">
        <div className="container" id="container">
          <div className="info_box">
            <div className="head-box type">
              <div className="title">xiuxian@1.3.0</div>
            </div>
          </div>

          {helpData.map((val, index) => (
            <div key={index} className="cont-box">
              <div className="help-group">{val.group}</div>
              <div className="help-table">
                <div className="tr">
                  {val.list?.map((item, itemIndex) => (
                    <div key={itemIndex} className="td">
                      <span className={`help-icon ${item.icon}`}></span>
                      <strong className="help-title">{item.title}</strong>
                      <span className="help-desc">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="copyright">
            Xiuxian-Plugin<span className="version">@1.3.0</span>
          </div>
        </div>
      </body>
    </html>
  )
}

export default Help
