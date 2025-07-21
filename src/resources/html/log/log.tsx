import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './log.css'
import tttgbnumberURL from '../../font/tttgbnumber.ttf'
import najieURL from '../../img/najie/najie.jpg'
import user_stateURL from '../../img/state/user_state.png'

const Log = ({ log }) => {
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
            background-image: url('${najieURL}');
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
        <div className="user_bottom1">
          <div className="use_data">
            {log &&
              log.map((item, index) => (
                <div key={index}>
                  <div className="user_font" style={{ paddingLeft: 0 }}>
                    {item}
                  </div>
                  <div style={{ margin: '0 0 -10px' }}>
                    -------------------------------------------------------------------------------------------------------------------------------
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="user_bottom2"></div>
      </body>
    </html>
  )
}

export default Log
