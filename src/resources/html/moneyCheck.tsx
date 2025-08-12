import React from 'react'
import HTML from './HTML'
import ningmenghomeBgURL from '@src/resources/img/fairyrealm.jpg'

const MoneyCheck = ({
  user_qq,
  victory,
  victory_num,
  defeated,
  defeated_num
}: {
  user_qq: string | number
  victory: number | string
  victory_num: number | string
  defeated: number | string
  defeated_num: number | string
}) => {
  return (
    <HTML
      className="min-h-screen w-full flex items-center justify-center p-6 md:p-12 relative bg-center bg-cover"
      style={{ backgroundImage: `url(${ningmenghomeBgURL})` }}
    >
      {/* 白色居中渐变叠加 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-blue-200/80 pointer-events-none"></div>

      <main
        className="relative max-w-md w-full bg-gradient-to-tr from-blue-100/60 to-blue-200/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 flex flex-col items-center gap-8
        hover:scale-[1.02] transition-transform duration-300"
      >
        <h1
          className="text-4xl md:text-5xl font-extrabold tracking-widest text-blue-900 drop-shadow-lg"
          style={{ textShadow: '0 0 6px rgba(0,0,80,0.7)' }}
        >
          金银坊记录
        </h1>

        <div className="text-lg text-blue-800 font-semibold tracking-wide select-none">
          QQ：{user_qq}
        </div>

        <div className="w-full grid grid-cols-2 gap-6 text-blue-900 font-semibold text-xl">
          <div className="flex flex-col items-center gap-1 p-4 rounded-xl bg-white/40 backdrop-blur-sm shadow-md border border-white/40">
            <div className="uppercase tracking-wider text-sm">胜场</div>
            <div className="text-3xl font-extrabold text-blue-700">
              {victory}
            </div>
            <div className="text-xs text-blue-600 mt-1">共卷走灵石</div>
            <div className="text-2xl font-bold text-blue-800">
              {victory_num}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 p-4 rounded-xl bg-white/40 backdrop-blur-sm shadow-md border border-white/40">
            <div className="uppercase tracking-wider text-sm">败场</div>
            <div className="text-3xl font-extrabold text-red-600">
              {defeated}
            </div>
            <div className="text-xs text-red-500 mt-1">共献祭灵石</div>
            <div className="text-2xl font-bold text-red-700">
              {defeated_num}
            </div>
          </div>
        </div>
      </main>
    </HTML>
  )
}

export default MoneyCheck
