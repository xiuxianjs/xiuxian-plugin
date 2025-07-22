import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from '../ningmenghome/ningmenghome.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import ningmenghomeURL from '@src/resources/img/ningmenghome/ningmenghome.jpg'
import user_stateURL from '@src/resources/img/state/user_state.png'

const SearchForum = ({ Forum, nowtime }) => {
  return (
    <html>
      <head>
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
            transform: scale(1);
            width: 100%;
            text-align: center;
            background-image: url('${ningmenghomeURL}');
            background-size: 100% auto;
          }

          .user_top_img_bottom {
            margin: auto;
            background-image: url('${user_stateURL}');
            background-size: 100% auto;
            width: 280px;
            height: 280px;
          }
        `,
          }}
        />
      </head>
      <body>
        <div>
          <div className="user_bottom1">
            <div className="use_data">
              <div
                className="user_font use_data_head"
                style={{ textAlign: 'center', paddingLeft: '0px' }}
              >
                <div>冒险家协会</div>
                <div style={{ fontSize: '0.8em' }}>
                  向着仙府与神界,欢迎来到冒险家协会
                </div>
              </div>
              <div className="use_data_body">
                {Forum &&
                  Forum.map((item, index) => (
                    <div key={index} className="user_font">
                      <div className="info">
                        物品：{item.thing.name}【{item.pinji}】
                      </div>
                      <br />
                      <div className="number">No.{index + 1}</div>
                      <div className="info">类型：{item.thing.class}</div>
                      <br />
                      <div className="info">数量：{item.thingNumber}</div>
                      <br />
                      <div className="info">金额：{item.thingJIAGE}</div>
                      <br />
                      {item.end_time - nowtime > 0 && (
                        <div className="info">
                          CD：{((item.end_time - nowtime) / 60000).toFixed(0)}分
                          {(((item.end_time - nowtime) % 60000) / 1000).toFixed(
                            0
                          )}
                          秒
                        </div>
                      )}
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

export default SearchForum
