import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import commonCssURL from './common.css'
import cssURL from './shituhelp.css'
import HWZSURL from '@src/resources/font/华文中宋x.ttf'
import NumberURL from '@src/resources/font/tttgbnumber.ttf'
import NZBZURL from '@src/resources/font/NZBZ.ttf'
import YSURL from '@src/resources/font/HYWH-85W.ttf'
import YS2URL from '@src/resources/font/HYWH-65W.ttf'
import bgURL from '@src/resources/img/help/shituhelp.jpg'
import iconURL from '@src/resources/img/help/icon.png'

const ShituHelp = ({ version, helpData = [] }) => {
  return (
    <html>
      <head>
        <meta httpEquiv="content-type" content="text/html;charset=utf-8" />
        <LinkStyleSheet src={commonCssURL} />
        <LinkStyleSheet src={cssURL} />
        <style>{`
          @font-face {
            font-family: 'HWZS';
            src: url('${HWZSURL}');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'Number';
            src: url('${NumberURL}');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'NZBZ';
            src: url('${NZBZURL}');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'YS';
            src: url('${YSURL}');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'YS2';
            src: url('${YS2URL}');
            font-weight: normal;
            font-style: normal;
          }
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
            font-family: Number, YS2, PingFangSC-Medium, PingFang SC, sans-serif;
            transform: scale(1.4);
            transform-origin: 0 0;
            width: 600px;
          }
          body {
            transform: scale(1);
            width: 100%;
            background: url('${bgURL}') top left no-repeat;
            background-size: 100% 100%;
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
        `}</style>
      </head>
      <body className="elem-default default-mode">
        <div className="container" id="container">
          <div className="info_box">
            <div className="head-box type">
              <div className="title">
                #师徒帮助<span className="version">{version}</span>
              </div>
            </div>
          </div>
          {helpData.map((val, idx) => (
            <div className="cont-box" key={idx}>
              <div className="help-group">{val.group}</div>
              <div className="help-table">
                <div className="tr">
                  {val.list.map((item, i) => (
                    <div className="td" key={i}>
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
            Created By xiuxian<span className="version">@1.3.0</span>
          </div>
        </div>
      </body>
    </html>
  )
}

export default ShituHelp
