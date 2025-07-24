import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './player.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import backgroundURL from '@src/resources/img/player.jpg'
import user_stateURL from '@src/resources/img/user_state.png'

const Player = ({
  avatar,
  PowerMini,
  player = {},
  user_id,
  strand_hp = {},
  lingshi,
  this_association = {},
  player_atk,
  player_atk2,
  player_def,
  player_def2,
  bao,
  攻击加成,
  攻击加成_t,
  防御加成,
  防御加成_t,
  生命加成,
  生命加成_t,
  talent,
  occupation,
  婚姻状况,
  rank_lianqi,
  expmax_lianqi,
  strand_lianqi = {},
  rank_llianti,
  expmax_llianti,
  strand_llianti = {},
  rank_liandan,
  expmax_liandan,
  strand_liandan = {},
  neidan,
  player_action
}) => {
  const whenError = img => {
    img.src = 'default-avatar.png' // 或其他默认头像
  }

  const genders = ['未知', '女', '男', '扶她']

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
            text-align: center;
            background-image: url('${backgroundURL}');
            background-size: 100% 100%;
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
            {/* 左 */}
            <div className="user_top_left">
              <div className="user_top_img_bottom">
                <img
                  className="user_top_img"
                  src={avatar}
                  onError={e => whenError(e.target)}
                />
              </div>
              <div className="user_top_font_left">战力 {PowerMini}</div>
            </div>
            {/* 右 */}
            <div className="user_top_right">
              <div className="user_top_font_right">道号：{player.名号}</div>
              <div className="user_top_font_right">QQ：{user_id}</div>
              <div className="user_top_font_right">
                性别：({genders[player.sex]})
              </div>
              <div className="user_top_font_right">
                生命：
                <div className="blood_box">
                  <div className="blood_bar" style={strand_hp.style}></div>
                  <div className="blood_volume">
                    {player.当前血量.toFixed(0)}/{player.血量上限.toFixed(0)}
                  </div>
                </div>
              </div>
              <div className="user_top_font_right">灵石：{lingshi}</div>
              <div className="user_top_font_right">
                宗门：【{this_association.宗门名称}】
                {this_association.宗门名称 !== '无' &&
                  `[${this_association.职位}]`}
              </div>
              <div className="user_top_font_right">道宣：{player.宣言}</div>
            </div>
          </div>
          {/* 下 */}
          <div className="card_box">
            <div className="use_data">
              <div className="user_font user_font_title">[基础信息]</div>
              <div className="user_font wupin">
                <div className="item">
                  <div className="item_title font_left">
                    攻击：{player_atk}
                    <sup>{player_atk2}</sup>
                  </div>
                  <div className="item_title font_left">
                    防御：{player_def}
                    <sup>{player_def2}</sup>
                  </div>
                  <div className="item_title font_left">暴击：{bao}</div>
                  <div className="item_title font_left">
                    暴伤：{(player.暴击伤害 * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="item">
                  <div className="item_title font_left">
                    攻击：{攻击加成}
                    <sup>{攻击加成_t}</sup>
                  </div>
                  <div className="item_title font_left">
                    防御：{防御加成}
                    <sup>{防御加成_t}</sup>
                  </div>
                  <div className="item_title font_left">
                    生命：{生命加成}
                    <sup>{生命加成_t}</sup>
                  </div>
                </div>
                <div className="item">
                  <div className="item_title font_left">
                    修炼加成：{talent}%
                  </div>
                  <div className="item_title font_left">
                    职业：[{occupation}]
                  </div>
                  <div className="item_title font_left">道侣[{婚姻状况}]</div>
                </div>
              </div>
              <div className="user_font wupin">
                <div className="item">
                  <div className="item_title font_left">
                    {rank_lianqi}
                    {player.修为 >= expmax_lianqi && '[UP]'}
                  </div>
                  <div className="item_int">
                    <div className="xuetiao">
                      <div
                        className="xueliang font_volume"
                        style={strand_lianqi.style}
                      >
                        {strand_lianqi.num}%
                      </div>
                    </div>
                  </div>
                  <div className="item_int">
                    {player.修为}/{expmax_lianqi}
                  </div>
                </div>
                <div className="item">
                  <div className="item_title font_left">
                    {rank_llianti}
                    {player.血气 >= expmax_llianti && '[UP]'}
                  </div>
                  <div className="item_int">
                    <div className="xuetiao">
                      <div
                        className="xueliang font_volume"
                        style={strand_llianti.style}
                      >
                        {strand_llianti.num}%
                      </div>
                    </div>
                  </div>
                  <div className="item_int">
                    {player.血气}/{expmax_llianti}
                  </div>
                </div>
                {player.occupation.length == 0 ? (
                  <div className="item">
                    <div className="item_title font_left">职业：</div>
                    <div className="item_title font_left">无业游民</div>
                  </div>
                ) : (
                  <div className="item">
                    <div className="item_title font_left">
                      {rank_liandan}
                      {player.occupation_exp >= expmax_liandan && '[UP]'}
                    </div>
                    <div className="item_int">
                      <div className="xuetiao">
                        <div
                          className="xueliang font_volume"
                          style={strand_liandan.style}
                        >
                          {strand_liandan.num}%
                        </div>
                      </div>
                    </div>
                    <div className="item_int">
                      {player.occupation_exp}/{expmax_liandan}
                    </div>
                  </div>
                )}
              </div>
              <div className="user_font wupin">
                <div className="item">
                  <div className="item_title font_left">
                    <div></div>
                    灵根：【{player.灵根?.type}】
                    {player.灵根?.type !== '无' && (
                      <>
                        {player.灵根?.name}
                        <br />
                        被动：【额外增伤】攻击+
                        {(player.灵根?.法球倍率 * 100).toFixed(1)}%
                      </>
                    )}
                    <br />
                    镇妖：【{player.镇妖塔层数}层】
                    <br />
                    神魂：【{player.神魄段数}层】
                    <br />
                    幸运:【{(player.幸运 * 100).toFixed(1)}%】
                    <br />
                    魔道值:【{player.魔道值}】<br />
                    内丹:【{neidan}】<br />
                    状态：【{player_action}】
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 仙宠 */}
          <div className="card_box">
            <div className="use_data">
              <div className="user_font user_font_title">[仙宠]</div>
              <div className="user_font wupin">
                {!player.仙宠 || player.仙宠.length == 0 ? (
                  <div />
                ) : (
                  <>
                    <div className="item_title2">
                      【{player.仙宠.品级}】{player.仙宠.name}
                    </div>
                    <div className="item_int2">等级：{player.仙宠.等级}</div>
                    {player.仙宠.type === '战斗' ? (
                      <div className="item_int2">三维加成{player.仙宠.atk}</div>
                    ) : (
                      <div className="item_int2">
                        {player.仙宠.type}加成:
                        {(player.仙宠.加成 * 100).toFixed(1)}%
                      </div>
                    )}
                    <div className="item_int2">
                      绑定：{player.仙宠.灵魂绑定 === 1 ? '有' : '无'}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="user_bottom2"></div>
        </div>
      </body>
    </html>
  )
}

export default Player
