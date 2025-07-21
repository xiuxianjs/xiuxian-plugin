import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './temp.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import najieURL from '@src/resources/img/najie/najie.jpg'
import user_stateURL from '@src/resources/img/state/user_state.png'

const Temp = ({ temp }) => {
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
            {temp &&
              temp.map((item, index) => (
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
      </body>
    </html>
  )
}

export default Temp
