import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from '../ningmenghome/ningmenghome.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import ningmenghomeBgURL from '@src/resources/img/ningmenghome/ningmenghome.jpg'
import userStateURL from '@src/resources/img/state/user_state.png'

const MoneyCheck = ({ qq, victory, victory_num, defeated, defeated_num }) => {
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
            background-image: url('${ningmenghomeBgURL}');
            background-size: 100% auto;
          }

          .user_top_img_bottom {
            margin: auto;
            background-image: url('${userStateURL}');
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
                <div>金银坊记录</div>
                <div style={{ fontSize: '0.8em' }}>{qq}</div>
              </div>
              <div className="use_data_body">
                <div className="user_font">
                  <div className="info">胜场：{victory}</div>
                  <div className="info">共卷走灵石：{victory_num}</div>
                  <div className="info">败场：{defeated}</div>
                  <div className="info">共献祭灵石：{defeated_num}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

export default MoneyCheck
