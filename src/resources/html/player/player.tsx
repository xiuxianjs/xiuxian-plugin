import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from './tailwindcss.css'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import playerURL from '@src/resources/img/player.jpg'
import playerFooterURL from '@src/resources/img/player_footer.png'
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
  const genders = ['未知', '女', '男', '扶她']
  return (
    <html lang="zh-CN">
      <head>
        <LinkStyleSheet src={cssURL} />
        <meta httpEquiv="content-type" content="text/html;charset=utf-8" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face { font-family: 'tttgbnumber'; src: url('${tttgbnumberURL}'); font-weight: normal; font-style: normal; }
              body { font-family: 'tttgbnumber', system-ui, sans-serif; }
            `
          }}
        />
      </head>
        <div
          className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
          style={{
            backgroundImage: `url('${playerURL}'), url('${playerFooterURL}')`
          }}
        >
          {/* 头部 */}
          <div className="w-full max-w-4xl mx-auto mt-8">
            <div className="flex gap-8 items-center">
              <div className="relative flex flex-col items-center">
                <div
                  className="w-72 h-72 rounded-full bg-cover bg-center flex items-center justify-center"
                  style={{ backgroundImage: `url('${user_stateURL}')` }}
                >
                  <img
                    className="w-56 h-56 rounded-full border-4 border-white shadow-lg object-cover"
                    src={avatar}
                    alt="头像"
                  />
                </div>
                <div className="mt-2 text-lg font-bold text-blue-900">
                  战力 {PowerMini}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2 text-gray-800">
                <div className="font-bold text-xl">道号：{player.名号}</div>
                <div className="text-base">QQ：{user_id}</div>
                <div className="text-base">性别：({genders[player.sex]})</div>
                <div className="text-base flex items-center gap-2">
                  <span>生命：</span>
                  <div className="flex flex-col items-start">
                    <div className="w-40 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-4 rounded-full bg-red-400"
                        style={strand_hp.style}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {player.当前血量.toFixed(0)}/{player.血量上限.toFixed(0)}
                    </div>
                  </div>
                </div>
                <div className="text-base">灵石：{lingshi}</div>
                <div className="text-base">
                  宗门：【{this_association.宗门名称}】
                  {this_association.宗门名称 !== '无' &&
                    `[${this_association.职位}]`}
                </div>
                <div className="text-base">道宣：{player.宣言}</div>
              </div>
            </div>
            {/* 基础信息 */}
            <div className="mt-8 bg-white/80 rounded-xl shadow-lg p-6">
              <div className="text-lg font-bold text-blue-700 mb-4">
                [基础信息]
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="font-semibold">
                    攻击：{player_atk}
                    <sup>{player_atk2}</sup>
                  </div>
                  <div className="font-semibold">
                    防御：{player_def}
                    <sup>{player_def2}</sup>
                  </div>
                  <div className="font-semibold">暴击：{bao}</div>
                  <div className="font-semibold">
                    暴伤：{(player.暴击伤害 * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="font-semibold">
                    攻击加成：{攻击加成}
                    <sup>{攻击加成_t}</sup>
                  </div>
                  <div className="font-semibold">
                    防御加成：{防御加成}
                    <sup>{防御加成_t}</sup>
                  </div>
                  <div className="font-semibold">
                    生命加成：{生命加成}
                    <sup>{生命加成_t}</sup>
                  </div>
                </div>
                <div>
                  <div className="font-semibold">修炼加成：{talent}%</div>
                  <div className="font-semibold">职业：[{occupation}]</div>
                  <div className="font-semibold">道侣[{婚姻状况}]</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="font-semibold">
                    {rank_lianqi}
                    {player.修为 >= expmax_lianqi && '[UP]'}
                  </div>
                  <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden my-1">
                    <div
                      className="h-3 rounded-full bg-blue-400"
                      style={strand_lianqi.style}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600">
                    {strand_lianqi.num}%
                  </div>
                  <div className="text-xs text-gray-600">
                    {player.修为}/{expmax_lianqi}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">
                    {rank_llianti}
                    {player.血气 >= expmax_llianti && '[UP]'}
                  </div>
                  <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden my-1">
                    <div
                      className="h-3 rounded-full bg-green-400"
                      style={strand_llianti.style}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600">
                    {strand_llianti.num}%
                  </div>
                  <div className="text-xs text-gray-600">
                    {player.血气}/{expmax_llianti}
                  </div>
                </div>
                <div>
                  {player.occupation.length == 0 ? (
                    <>
                      <div className="font-semibold">职业：</div>
                      <div className="font-semibold">无业游民</div>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold">
                        {rank_liandan}
                        {player.occupation_exp >= expmax_liandan && '[UP]'}
                      </div>
                      <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden my-1">
                        <div
                          className="h-3 rounded-full bg-yellow-400"
                          style={strand_liandan.style}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600">
                        {strand_liandan.num}%
                      </div>
                      <div className="text-xs text-gray-600">
                        {player.occupation_exp}/{expmax_liandan}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <div className="font-semibold">
                  灵根：【{player.灵根?.type}】
                  {player.灵根?.type !== '无' && (
                    <>
                      {player.灵根?.name}
                      <br />
                      被动：【额外增伤】攻击+
                      {(player.灵根?.法球倍率 * 100).toFixed(1)}%
                    </>
                  )}
                </div>
                <div className="font-semibold">
                  镇妖：【{player.镇妖塔层数}层】
                </div>
                <div className="font-semibold">
                  神魂：【{player.神魄段数}层】
                </div>
                <div className="font-semibold">
                  幸运:【{(player.幸运 * 100).toFixed(1)}%】
                </div>
                <div className="font-semibold">魔道值:【{player.魔道值}】</div>
                <div className="font-semibold">内丹:【{neidan}】</div>
                <div className="font-semibold">状态：【{player_action}】</div>
              </div>
            </div>
            {/* 仙宠 */}
            <div className="mt-8 bg-white/80 rounded-xl shadow-lg p-6">
              <div className="text-lg font-bold text-blue-700 mb-4">[仙宠]</div>
              {!player.仙宠 || player.仙宠.length == 0 ? (
                <div className="text-gray-500">暂无仙宠</div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="font-semibold">
                    【{player.仙宠.品级}】{player.仙宠.name}
                  </div>
                  <div className="font-semibold">等级：{player.仙宠.等级}</div>
                  {player.仙宠.type === '战斗' ? (
                    <div className="font-semibold">
                      三维加成{player.仙宠.atk}
                    </div>
                  ) : (
                    <div className="font-semibold">
                      {player.仙宠.type}加成:
                      {(player.仙宠.加成 * 100).toFixed(1)}%
                    </div>
                  )}
                  <div className="font-semibold">
                    绑定：{player.仙宠.灵魂绑定 === 1 ? '有' : '无'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

export default Player
