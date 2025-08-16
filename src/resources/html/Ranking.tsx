import React from 'react'
import classNames from 'classnames'
import HTML from './HTML'
import stateURL from '@src/resources/img/state.jpg'
import user_stateURL from '@src/resources/img/user_state2.png'

const Ranking = ({
  user_id,
  messages = [],
  title,
  values
}: {
  user_id?: string
  messages?: React.ReactNode
  title?: string
  values?: React.ReactNode[]
}) => {
  const getRankStyles = (index: number) => {
    switch (index) {
      case 0: // 第一名 - 金属金色至尊
        return {
          container:
            'border-yellow-400/60 bg-gradient-to-r from-yellow-900/40 to-amber-900/30 shadow-yellow-500/30 shadow-lg',
          rank: 'bg-gradient-to-r from-yellow-400 to-amber-300 text-yellow-900',
          glow: 'shadow-yellow-400/50',
          icon: 'text-yellow-400'
        }
      case 1: // 第二名 - 紫色仙君
        return {
          container:
            'border-purple-300/60 bg-gradient-to-r from-purple-800/40 to-violet-800/30 shadow-purple-400/30 shadow-lg',
          rank: 'bg-gradient-to-r from-purple-300 to-violet-200 text-purple-800',
          glow: 'shadow-purple-300/50',
          icon: 'text-purple-300'
        }
      case 2: // 第三名 - 青色真人
        return {
          container:
            'border-cyan-600/60 bg-gradient-to-r from-cyan-900/40 to-blue-900/30 shadow-cyan-600/30 shadow-lg',
          rank: 'bg-gradient-to-r from-cyan-400 to-blue-300 text-cyan-900',
          glow: 'shadow-cyan-400/50',
          icon: 'text-cyan-400'
        }
      default: // 其他名次 - 蓝玉修士
        return {
          container:
            'border-blue-500/40 bg-gradient-to-r from-blue-900/30 to-indigo-900/20 shadow-blue-500/20 shadow-md',
          rank: 'bg-gradient-to-r from-blue-400 to-indigo-300 text-blue-900',
          glow: 'shadow-blue-400/30',
          icon: 'text-blue-400'
        }
    }
  }

  return (
    <HTML
      className=" bg-cover bg-center flex flex-col items-center justify-center p-4 font-serif relative overflow-hidden"
      style={{ backgroundImage: `url(${stateURL})` }}
    >
      {/* 背景装饰层 - 蓝紫色调 */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-purple-900/20 to-blue-800/40 pointer-events-none"></div>

      {/* 飘浮的仙气粒子效果 - 蓝紫色调 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-300/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-indigo-300/40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-purple-300/30 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-violet-300/40 rounded-full animate-pulse delay-1500"></div>
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-cyan-300/30 rounded-full animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-blue-300/40 rounded-full animate-float delay-2000"></div>
      </div>

      <div className="h-8 w-full"></div>

      {/* 用户信息区域 */}
      {user_id && (
        <div className="relative z-10 flex flex-col md:flex-row justify-center items-center px-5 w-full max-w-5xl gap-8 mb-8 animate-fade-in">
          {/* 头像区域 - 仙气缭绕 */}
          <div className="relative flex items-center justify-center w-56 h-56 flex-shrink-0">
            {/* 外圈光环 - 多层旋转 */}
            <div className="absolute w-56 h-56 rounded-full border-2 border-blue-400/30 animate-spin-slow"></div>
            <div
              className="absolute w-52 h-52 rounded-full border-2 border-indigo-300/40 animate-spin-slow"
              style={{ animationDirection: 'reverse', animationDuration: '8s' }}
            ></div>
            <div
              className="absolute w-48 h-48 rounded-full border-2 border-purple-200/50 animate-spin-slow"
              style={{ animationDuration: '12s' }}
            ></div>

            {/* 头像 */}
            <div className="relative w-44 h-44 rounded-full overflow-hidden shadow-2xl border-4 border-gradient-to-r from-blue-400 to-indigo-300">
              <img
                className="w-full h-full object-cover"
                src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`}
                alt="用户头像"
              />
              {/* 头像光晕效果 */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
            </div>

            {/* 修仙光环 */}
            <img
              className="w-56 h-56 rounded-full absolute animate-spin-slow opacity-60"
              src={user_stateURL}
              alt="修仙光环"
              style={{ animationDuration: '15s' }}
            />

            {/* 仙气装饰 */}
            <div className="absolute -top-4 -left-4 w-3 h-3 bg-blue-400/60 rounded-full animate-glow"></div>
            <div className="absolute -bottom-4 -right-4 w-2 h-2 bg-indigo-300/60 rounded-full animate-glow delay-1000"></div>
          </div>

          {/* 消息区域 - 仙卷样式 */}
          <div className="flex-1 relative animate-slide-up">
            {/* 卷轴装饰 */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-300 rounded-full shadow-lg animate-bounce-slow"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-br from-purple-400 to-violet-300 rounded-full shadow-lg animate-bounce-slow delay-500"></div>

            <div className="relative px-8 py-8 rounded-2xl shadow-2xl border-2 border-gradient-to-r from-blue-400/50 to-indigo-300/50 bg-gradient-to-br from-black/40 via-black/20 to-black/30 backdrop-blur-xl text-blue-50 overflow-hidden">
              {/* 内部装饰线条 */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent"></div>

              {/* 角落装饰 */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-blue-400/40 rounded-full"></div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-300/40 rounded-full"></div>
              <div className="absolute bottom-2 left-2 w-2 h-2 bg-purple-400/40 rounded-full"></div>
              <div className="absolute bottom-2 right-2 w-2 h-2 bg-violet-300/40 rounded-full"></div>

              <div className="flex flex-col gap-4 relative z-10">
                {messages}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 排行榜区域 */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center px-5 gap-6 animate-fade-in">
        {/* 标题区域 - 仙门牌匾 */}
        {title && (
          <div className="relative w-full animate-scale-in">
            {/* 牌匾装饰 */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gradient-to-r from-yellow-400 to-amber-300 rounded-full shadow-lg"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-orange-400 to-red-300 rounded-full shadow-md"></div>

            <div className="border-2 border-gradient-to-r from-yellow-400/60 to-amber-300/60 rounded-2xl w-full flex justify-center bg-gradient-to-br from-black/50 via-black/30 to-black/40 backdrop-blur-xl shadow-2xl py-6 relative overflow-hidden">
              {/* 背景装饰 */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-amber-300/5"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent"></div>

              {/* 牌匾装饰元素 */}
              <div className="absolute top-2 left-4 w-1 h-1 bg-yellow-400/60 rounded-full"></div>
              <div className="absolute top-2 right-4 w-1 h-1 bg-amber-300/60 rounded-full"></div>
              <div className="absolute bottom-2 left-4 w-1 h-1 bg-orange-400/60 rounded-full"></div>
              <div className="absolute bottom-2 right-4 w-1 h-1 bg-red-300/60 rounded-full"></div>

              <span
                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-100 to-yellow-200 tracking-widest relative z-10"
                style={{
                  textShadow: '0 4px 8px rgba(0,0,0,0.8)',
                  filter: 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.3))'
                }}
              >
                {title}
              </span>
            </div>
          </div>
        )}

        {/* 排行榜列表 */}
        {values && values.length > 0 ? (
          <div className="w-full flex flex-col gap-5">
            {values.map((item, index) => {
              const styles = getRankStyles(index)
              return (
                <div
                  key={index}
                  className={classNames(
                    'relative backdrop-blur-xl shadow-xl border-2 p-6 flex gap-6 items-center transition-all duration-500 rounded-2xl',
                    styles.container,
                    styles.glow
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* 内容区域 */}
                  <div className="flex-1 text-white/95 text-lg leading-relaxed">
                    {item}
                  </div>

                  {/* 装饰元素 */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-blue-400 to-indigo-300 rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-gradient-to-br from-purple-400 to-violet-300 rounded-full opacity-40 animate-pulse delay-1000"></div>

                  {/* 边框装饰 */}
                  <div className="absolute top-0 left-0 w-4 h-1 bg-gradient-to-r from-blue-400/40 to-transparent"></div>
                  <div className="absolute top-0 right-0 w-4 h-1 bg-gradient-to-l from-indigo-300/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-1 bg-gradient-to-r from-purple-400/40 to-transparent"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-1 bg-gradient-to-l from-violet-300/40 to-transparent"></div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="w-full text-center py-12 animate-fade-in">
            <div className="text-2xl text-blue-200/70 font-medium">
              暂无排行数据
            </div>
            <div className="text-lg text-blue-200/50 mt-2">
              修仙之路，始于足下
            </div>
          </div>
        )}
      </div>

      <div className="h-8 w-full"></div>
    </HTML>
  )
}

export default Ranking
