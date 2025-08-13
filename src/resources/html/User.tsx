import React from 'react'
import cssURL from '@src/resources/styles/player.scss'
import playerURL from '@src/resources/img/player.jpg'
import playerFooterURL from '@src/resources/img/player_footer.png'
import HTML from './HTML'
import { Avatar } from './Avatar'

interface PlayerProps {
  avatar: string
  PowerMini: number | string
  player?: {
    名号?: string
    sex?: number
    当前血量?: number
    血量上限?: number
    宣言?: string
    暴击伤害?: number
    修为?: number
    occupation?: string[]
    occupation_exp?: number
    血气?: number
    灵根?: {
      type?: string
      name?: string
      法球倍率?: number
    }
    镇妖塔层数?: number
    神魄段数?: number
    幸运?: number
    魔道值?: number
    仙宠?:
      | {
          品级?: string
          name?: string
          等级?: number
          type?: string
          atk?: number
          加成?: number
          灵魂绑定?: number
        }[]
      | {
          品级?: string
          name?: string
          等级?: number
          type?: string
          atk?: number
          加成?: number
          灵魂绑定?: number
        }
  }
  user_id: string | number
  strand_hp?: { style?: React.CSSProperties }
  lingshi: number | string
  this_association?: {
    宗门名称?: string
    职位?: string
  }
  player_atk: number
  player_atk2: number
  player_def: number
  player_def2: number
  bao: number
  攻击加成: number
  攻击加成_t: number
  防御加成: number
  防御加成_t: number
  生命加成: number
  生命加成_t: number
  talent: number
  occupation: string
  婚姻状况: string
  rank_lianqi: string
  expmax_lianqi: number
  strand_lianqi?: { style?: React.CSSProperties; num?: number }
  rank_llianti: string
  expmax_llianti: number
  strand_llianti?: { style?: React.CSSProperties; num?: number }
  rank_liandan: string
  expmax_liandan: number
  strand_liandan?: { style?: React.CSSProperties; num?: number }
  neidan: string | number
  player_action: string
}

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
}: PlayerProps) => {
  const genders = ['未知', '女', '男', '扶她']

  const Pets = ({ value }) => {
    return (
      <div className="item wupin ">
        <div className="item_title2">
          【{value.品级}】{value.name}
        </div>
        <div className="item_int2">等级：{value.等级}</div>
        {value.type === '战斗' ? (
          <div className="item_int2">三维加成{value.atk}</div>
        ) : (
          <div className="item_int2">
            {value.type}加成:
            {(value.加成 * 100).toFixed(1)}%
          </div>
        )}
        <div className="item_int2">
          绑定：{value.灵魂绑定 === 1 ? '有' : '无'}
        </div>
      </div>
    )
  }

  const PetsReander = Array.isArray(player.仙宠) ? (
    player.仙宠.map((pet, index) => <Pets key={index} value={pet} />)
  ) : (
    <Pets value={player.仙宠} />
  )

  return (
    <HTML
      className="p-0 m-0 w-full text-center"
      linkStyleSheets={[cssURL]}
      dangerouslySetInnerHTML={{
        __html: `
          body {
            background-image: url(${playerURL}), url(${playerFooterURL});
            background-repeat: no-repeat, repeat;
            background-size: 100%, auto;
          }
        `
      }}
    >
      <div>
        <div className="header"></div>
        {/* 上 */}
        <div className="card_box flex pb-6">
          {/* 左 */}
          <div className="user_top_left w-72">
            <div className="flex justify-center">
              <Avatar
                src={avatar}
                rootClassName="w-60 h-60"
                className="w-40 h-40"
              />
            </div>
            {/* 战力卡片 - 使用Tailwind CSS */}
            <div className="mt-4 mx-4 relative">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl px-4 py-2 shadow-xl border-2 border-amber-300 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">⚔️</span>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-xs font-medium opacity-90">
                      战力
                    </div>
                    <div className="text-white text-2xl font-bold drop-shadow-lg">
                      {PowerMini}
                    </div>
                  </div>
                </div>
                {/* 装饰性光效 */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-orange-300 rounded-full opacity-40"></div>
              </div>
            </div>
          </div>
          {/* 右 */}
          <div className="user_top_right flex-1 text-slate-600">
            <div className="space-y-3">
              {/* 道号 */}
              <div className="flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <span className=" text-sm">👤</span>
                <span className=" font-medium">道号：{player.名号}</span>
              </div>

              {/* QQ */}
              <div className="flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <span className=" text-sm">💬</span>
                <span className="font-medium">QQ：{user_id}</span>
              </div>

              {/* 性别 */}
              <div className="flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <span className=" text-sm">⚧</span>
                <span className=" font-medium">
                  性别：({genders[player.sex]})
                </span>
              </div>

              {/* 生命值 */}
              <div className="bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className=" text-sm">❤️</span>
                  <span className="font-medium ">生命</span>
                </div>
                {/* 血条 - 使用Tailwind CSS */}
                <div className="relative w-72 text-white h-8 bg-gray-800/80 rounded-xl shadow-lg overflow-hidden border-2 border-l-yellow-300/50">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-lg transition-all duration-300 ease-out shadow-inner"
                    style={strand_hp.style}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-sm drop-shadow-lg">
                      {player.当前血量?.toFixed(0)}/
                      {player.血量上限?.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 灵石 */}
              <div className="flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <span className=" text-sm">💰</span>
                <span className="text-white font-medium">灵石：{lingshi}</span>
              </div>

              {/* 宗门 */}
              <div className="flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <span className=" text-sm">🏛️</span>
                <span className="  font-medium">
                  宗门：【{this_association.宗门名称}】
                  {this_association.宗门名称 !== '无' &&
                    `[${this_association.职位}]`}
                </span>
              </div>

              {/* 道宣 */}
              <div className="flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <span className=" text-sm">📜</span>
                <span className="font-medium">道宣：{player.宣言}</span>
              </div>
            </div>
          </div>
        </div>
        {/* 下 */}
        <div className="card_box">
          <div className="use_data">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-700">【基础信息】</h2>
            </div>
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
                <div className="item_title font_left">修炼加成：{talent}%</div>
                <div className="item_title font_left">职业：[{occupation}]</div>
                <div className="item_title font_left">道侣[{婚姻状况}]</div>
              </div>
            </div>
            <div className="user_font wupin">
              <div className="item">
                <div className="item_title font_left">
                  {rank_lianqi}
                  {player.修为 >= expmax_lianqi && '[UP]'}
                </div>
                {/* 练气进度条 - 使用Tailwind CSS */}
                <div className="item_int">
                  <div className="relative w-full h-6 bg-gray-700 rounded-lg overflow-hidden border border-gray-600">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-300 ease-out shadow-inner"
                      style={strand_lianqi.style}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-xs drop-shadow-lg">
                        {strand_lianqi.num}%
                      </span>
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
                {/* 炼体进度条 - 使用Tailwind CSS */}
                <div className="item_int">
                  <div className="relative w-full h-6 bg-gray-700 rounded-lg overflow-hidden border border-gray-600">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-lg transition-all duration-300 ease-out shadow-inner"
                      style={strand_llianti.style}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-xs drop-shadow-lg">
                        {strand_llianti.num}%
                      </span>
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
                  {/* 炼丹进度条 - 使用Tailwind CSS */}
                  <div className="item_int">
                    <div className="relative w-full h-6 bg-gray-700 rounded-lg overflow-hidden border border-gray-600">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg transition-all duration-300 ease-out shadow-inner"
                        style={strand_liandan.style}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs drop-shadow-lg">
                          {strand_liandan.num}%
                        </span>
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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <span className="text-lg">🐈‍⬛</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-700">仙宠</h2>
            </div>
            <div className="user_font wupin">{PetsReander}</div>
          </div>
        </div>
        <div className="user_bottom2"></div>
      </div>
    </HTML>
  )
}

export default Player
