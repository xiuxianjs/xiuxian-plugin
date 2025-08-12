import React from 'react'
import cssURL from '@src/resources/styles/player.scss'
import HTML from './HTML'
import { Avatar } from './Avatar'

const PlayerCopy = ({
  user_id,
  nickname,
  player_nowHP,
  player_maxHP,
  levelMax,
  xueqi,
  need_xueqi,
  lingshi,
  association,
  learned_gongfa
}) => {
  return (
    <HTML className="p-0 m-0 w-full text-center" linkStyleSheets={[cssURL]}>
      <div className="relative z-10 w-full max-w-3xl mx-auto bg-gradient-to-br from-green-200/60 via-green-100/80 to-red-100/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(46,204,64,0.25)] p-10 mt-12 border-2 border-green-400/60">
        {/* 玻璃装饰与线条 */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 900 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <rect
              x="30"
              y="30"
              width="840"
              height="340"
              rx="40"
              fill="rgba(255,255,255,0.08)"
              stroke="#2ecc40"
              strokeWidth="2"
            />
            <line
              x1="60"
              y1="100"
              x2="840"
              y2="100"
              stroke="#2ecc40"
              strokeDasharray="8 8"
              strokeWidth="1.5"
            />
            <line
              x1="60"
              y1="300"
              x2="840"
              y2="300"
              stroke="#ff4e50"
              strokeDasharray="12 6"
              strokeWidth="1.5"
            />
            <circle cx="120" cy="60" r="18" fill="#2ecc40" fillOpacity="0.18" />
            <circle
              cx="780"
              cy="340"
              r="14"
              fill="#ff4e50"
              fillOpacity="0.18"
            />
          </svg>
        </div>
        {/* 头像区 */}
        <div className="flex items-center gap-8 mb-8 relative z-10">
          <div className="relative">
            <Avatar
              src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`}
              rootClassName="w-36 h-36 rounded-full ring-4"
              className="w-28 h-28 rounded-full"
            />
            <span className="absolute left-1/2 -bottom-4 -translate-x-1/2 bg-gradient-to-r from-green-500 to-red-400 text-white text-xs px-3 py-1 rounded-full shadow-lg border border-green-300">
              QQ:{user_id}
            </span>
          </div>
          <div className="flex flex-col justify-center items-start bg-gradient-to-r from-green-300/80 via-green-100/80 to-red-100/60 px-6 py-4 rounded-xl shadow-lg border border-green-200">
            <div className="text-3xl font-extrabold text-green-700 tracking-wide mb-2 drop-shadow-lg">
              道号：{nickname}
            </div>
            <div className="text-lg text-green-600 font-semibold">
              体境：{levelMax}
            </div>
          </div>
        </div>

        {/* 数据区 */}
        <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
          <div className="bg-gradient-to-br from-green-300/80 to-green-500/40 rounded-xl p-6 text-green-900 shadow-lg border border-green-200">
            <div className="font-bold text-lg mb-1 tracking-wide">血量</div>
            <div className="text-2xl font-extrabold">
              {player_nowHP} / {player_maxHP}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-300/80 to-green-500/40 rounded-xl p-6 text-green-900 shadow-lg border border-green-200">
            <div className="font-bold text-lg mb-1 tracking-wide">气血</div>
            <div className="text-2xl font-extrabold">
              {xueqi} / {need_xueqi}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-200/80 to-green-400/40 rounded-xl p-6 text-green-900 shadow-lg border border-green-200">
            <div className="font-bold text-lg mb-1 tracking-wide">灵石</div>
            <div className="text-xl font-bold">{lingshi}</div>
          </div>
          <div className="bg-gradient-to-br from-red-200/80 to-green-300/40 rounded-xl p-6 text-green-900 shadow-lg border border-green-200">
            <div className="font-bold text-lg mb-1 tracking-wide">宗门</div>
            <div className="text-xl font-bold">
              {association?.宗门名称 || '无'}
            </div>
            <div className="text-xs text-green-700">
              {association?.职位 || ''}
            </div>
          </div>
        </div>

        {/* 已学功法 */}
        <div className="mb-6 relative z-10">
          <div className="text-2xl font-extrabold text-green-700 mb-3 tracking-wider drop-shadow-lg border-b-2 border-green-300 pb-2">
            【已学功法】
          </div>
          <div className="flex flex-wrap gap-3">
            {learned_gongfa?.length === 0 ? (
              <span className="px-4 py-2 bg-gradient-to-r from-green-200 via-green-100 to-red-100 text-green-700 rounded-full shadow font-bold border border-green-200 text-lg tracking-wide opacity-70">
                暂无功法
              </span>
            ) : (
              learned_gongfa?.map((item, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 via-green-300 to-red-300 text-green-900 rounded-full shadow-lg font-bold border border-green-300 animate-pulse text-lg tracking-wide"
                  style={{ textShadow: '0 2px 8px rgba(46,204,64,0.2)' }}
                >
                  《{item}》
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </HTML>
  )
}

export default PlayerCopy
