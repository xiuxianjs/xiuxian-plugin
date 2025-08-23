import React from 'react'
import HTML from './HTML'
import { Avatar } from './Avatar'
import { getAvatar } from '@src/model/utils/utilsx.js'

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
  learned_gongfa = []
}) => {
  return (
    <HTML className="p-0 m-0 w-full text-center">
      {/* 背景装饰层 */}
      <div className=" w-full max-w-4xl mx-auto">
        {/* 外层光晕效果 */}
        <div className="inset-0 bg-gradient-to-br from-green-400/20 via-yellow-300/15 to-red-400/20 rounded-[2rem] blur-3xl scale-110"></div>

        {/* 主容器 */}
        <div className=" z-10 w-full bg-gradient-to-br from-green-100/90 via-yellow-50/95 to-red-100/90 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_60px_0_rgba(46,204,64,0.3),0_0_100px_0_rgba(255,215,0,0.2)] p-6 sm:p-8 mt-8 border border-green-300/60">
          {/* 装饰性边框 */}
          <div className="relative inset-0 pointer-events-none z-0">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 外框装饰 */}
              <rect
                x="20"
                y="20"
                width="760"
                height="560"
                rx="40"
                fill="none"
                stroke="url(#borderGradient)"
                strokeWidth="3"
                strokeDasharray="20 10"
              />
              <rect
                x="30"
                y="30"
                width="740"
                height="540"
                rx="35"
                fill="none"
                stroke="url(#innerBorder)"
                strokeWidth="1"
                strokeDasharray="5 5"
              />

              {/* 四角装饰 */}
              <path
                d="M 40 40 L 80 40 L 80 80 L 40 80 Z"
                fill="url(#cornerGradient)"
                stroke="#2ecc40"
                strokeWidth="2"
              />
              <path
                d="M 720 40 L 760 40 L 760 80 L 720 80 Z"
                fill="url(#cornerGradient)"
                stroke="#2ecc40"
                strokeWidth="2"
              />
              <path
                d="M 40 520 L 80 520 L 80 560 L 40 560 Z"
                fill="url(#cornerGradient)"
                stroke="#2ecc40"
                strokeWidth="2"
              />
              <path
                d="M 720 520 L 760 520 L 760 560 L 720 560 Z"
                fill="url(#cornerGradient)"
                stroke="#2ecc40"
                strokeWidth="2"
              />

              {/* 云纹装饰 */}
              <path
                d="M 100 80 Q 150 60 200 80 T 300 80"
                stroke="#2ecc40"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M 500 80 Q 550 60 600 80 T 700 80"
                stroke="#2ecc40"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M 100 520 Q 150 540 200 520 T 300 520"
                stroke="#ff4e50"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M 500 520 Q 550 540 600 520 T 700 520"
                stroke="#ff4e50"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />

              {/* 仙气效果 */}
              <circle cx="150" cy="120" r="8" fill="#2ecc40" opacity="0.3" />
              <circle cx="650" cy="480" r="6" fill="#ff4e50" opacity="0.3" />
              <circle cx="200" cy="450" r="10" fill="#ffd700" opacity="0.2" />

              {/* 渐变定义 */}
              <defs>
                <linearGradient
                  id="borderGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#2ecc40" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#ffd700" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ff4e50" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient
                  id="innerBorder"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#2ecc40" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ff4e50" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient
                  id="cornerGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#2ecc40" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ffd700" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute top-0 w-full ">
              {/* 标题区域 */}
              <div className="relative z-10 mb-6 sm:mb-8">
                <div className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 mb-2 tracking-widest drop-shadow-lg">
                  ✧ 修仙者档案 ✧
                </div>
                <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 mx-auto rounded-full shadow-lg"></div>
              </div>

              {/* 头像和基本信息区 */}
              <div className="flex flex-col items-center gap-6 sm:gap-8 mb-8 sm:mb-10 relative z-10">
                {/* 头像容器 */}
                <div className="relative">
                  <div className="inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full p-1 shadow-2xl">
                    <Avatar
                      src={getAvatar(user_id)}
                      rootClassName="w-32 sm:w-40 h-32 sm:h-40 rounded-full ring-4 ring-white/80"
                      className="w-24 sm:w-32 h-24 sm:h-32 rounded-full"
                    />
                  </div>
                  {/* QQ标识 */}
                  <div className="text-sm text-gray-600">QQ: {user_id}</div>
                </div>

                {/* 道号信息 */}
                <div className="w-full max-w-2xl">
                  <div className="bg-gradient-to-r from-green-200/90 via-yellow-100/90 to-red-200/90 backdrop-blur-sm px-4 sm:px-8 py-4 sm:py-6 rounded-2xl shadow-2xl border border-green-300/60 relative overflow-hidden">
                    {/* 背景装饰 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-300/20 to-red-300/20"></div>
                    <div className="relative z-10 text-center">
                      <div className="text-xl sm:text-3xl font-black text-green-800 tracking-wider mb-2 sm:mb-3 drop-shadow-lg">
                        🏮 道号：{nickname} 🏮
                      </div>
                      <div className="text-lg sm:text-xl text-green-700 font-bold tracking-wide">
                        ⚔️ 体境：{levelMax} ⚔️
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 属性数据网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10 relative z-10">
            {/* 血量 */}
            <div className="bg-gradient-to-br from-red-200/90 via-red-100/90 to-red-300/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl border border-red-300/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-red-600/10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl sm:text-2xl">❤️</span>
                  <div className="font-black text-lg sm:text-xl text-red-800 tracking-wide">
                    血量
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-red-900 tracking-wider">
                  {player_nowHP} / {player_maxHP}
                </div>
                {/* 血量条 */}
                <div className="mt-3 bg-red-200/50 rounded-full h-2 sm:h-3 overflow-hidden border border-red-300/50">
                  <div
                    className="bg-gradient-to-r from-red-400 to-red-600 h-full rounded-full shadow-inner"
                    style={{ width: `${(player_nowHP / player_maxHP) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 气血 */}
            <div className="bg-gradient-to-br from-blue-200/90 via-blue-100/90 to-blue-300/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl border border-blue-300/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl sm:text-2xl">💙</span>
                  <div className="font-black text-lg sm:text-xl text-blue-800 tracking-wide">
                    气血
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-900 tracking-wider">
                  {xueqi} / {need_xueqi}
                </div>
                {/* 气血条 */}
                <div className="mt-3 bg-blue-200/50 rounded-full h-2 sm:h-3 overflow-hidden border border-blue-300/50">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full shadow-inner"
                    style={{ width: `${(xueqi / need_xueqi) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 灵石 */}
            <div className="bg-gradient-to-br from-yellow-200/90 via-yellow-100/90 to-yellow-300/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl border border-yellow-300/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl sm:text-2xl">💰</span>
                  <div className="font-black text-lg sm:text-xl text-yellow-800 tracking-wide">
                    灵石
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-yellow-900 tracking-wider">
                  {lingshi}
                </div>
                <div className="text-sm text-yellow-700 mt-2 font-semibold">
                  修炼资源
                </div>
              </div>
            </div>

            {/* 宗门 */}
            <div className="bg-gradient-to-br from-purple-200/90 via-purple-100/90 to-purple-300/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl border border-purple-300/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-purple-600/10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl sm:text-2xl">🏛️</span>
                  <div className="font-black text-lg sm:text-xl text-purple-800 tracking-wide">
                    宗门
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-purple-900 tracking-wider mb-1">
                  {association?.宗门名称 || '无'}
                </div>
                <div className="text-sm text-purple-700 font-semibold">
                  {association?.职位 || '散修'}
                </div>
              </div>
            </div>
          </div>

          {/* 已学功法区域 */}
          <div className="relative z-10">
            <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 mb-4 sm:mb-6 tracking-wider drop-shadow-lg flex items-center justify-center gap-3 sm:gap-4">
              <span className="text-xl sm:text-2xl">📚</span>
              【已学功法】
              <span className="text-xl sm:text-2xl">📚</span>
            </div>

            <div className="bg-gradient-to-br from-green-100/90 via-yellow-50/90 to-red-100/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl border border-green-300/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-300/10 to-red-300/10"></div>
              <div className="relative z-10">
                {!learned_gongfa || learned_gongfa.length === 0 ? (
                  <div className="flex items-center justify-center gap-3 py-6 sm:py-8">
                    <span className="text-xl sm:text-2xl">📖</span>
                    <span className="text-lg sm:text-xl font-bold text-green-700 tracking-wide opacity-70">
                      暂无功法
                    </span>
                    <span className="text-xl sm:text-2xl">📖</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                    {learned_gongfa.map((item, index) => (
                      <div
                        key={index}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-400/90 via-yellow-300/90 to-red-400/90 text-green-900 rounded-full shadow-xl font-black border-2 border-green-300/60 text-base sm:text-lg tracking-wide relative overflow-hidden"
                        style={{ textShadow: '0 2px 8px rgba(46,204,64,0.3)' }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                        <span className="relative z-10">《{item}》</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 底部装饰 */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full shadow-lg"></div>
          </div>
        </div>
      </div>
    </HTML>
  )
}

export default PlayerCopy
