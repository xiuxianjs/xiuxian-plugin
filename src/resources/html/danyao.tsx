import React from 'react'
import HTML from './HTML'
import playerURL from '@src/resources/img/player.jpg'
import playerFooterURL from '@src/resources/img/player_footer.png'
import { getAvatar } from './core'
import { Avatar } from './Avatar'

interface DanyaoItem {
  name: string
  type: string
  HP?: number | string
  exp?: number | string
  xueqi?: number | string
  xingyun?: number
  出售价: number
}

const Danyao = ({
  nickname,
  user_id,
  danyao_have = [],
  danyao2_have = [],
  danyao_need = []
}: {
  nickname: string
  user_id: string
  danyao_have?: DanyaoItem[]
  danyao2_have?: DanyaoItem[]
  danyao_need?: DanyaoItem[]
}) => {
  const renderEffect = (item: DanyaoItem) => {
    const effects = []
    if (item.HP) effects.push(item.HP)
    if (item.exp) effects.push(item.exp)
    if (item.xueqi) effects.push(item.xueqi)
    if (item.xingyun > 0) effects.push(`${(item.xingyun * 100).toFixed(1)}%`)
    return effects.join('')
  }

  return (
    <HTML
      className="w-full text-center p-4 md:p-8 bg-top bg-no-repeat min-h-screen"
      style={{
        backgroundImage: `url(${playerURL}), url(${playerFooterURL})`,
        backgroundRepeat: 'no-repeat, repeat',
        backgroundSize: '100%, auto'
      }}
    >
      {/* 背景加仙气渐变遮罩 + 边角光晕 */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/50 via-emerald-700/30 to-red-900/50 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none"></div>

      <main className="relative max-w-5xl mx-auto space-y-12 z-10">
        {/* 头像 + 标题 */}
        <header className="space-y-6 flex flex-col items-center">
          <div className="relative">
            <Avatar src={getAvatar(user_id)} />
          </div>
        </header>

        {/* 已拥有 */}
        {(danyao_have.length > 0 || danyao2_have.length > 0) && (
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-emerald-800/10 rounded-3xl blur-2xl"></div>
            <div className="relative rounded-3xl bg-white/8 backdrop-blur-xl ring-2 ring-emerald-400/30 p-6 md:p-8 shadow-2xl space-y-6 border border-emerald-300/20">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-emerald-400/30 rounded-full flex items-center justify-center">
                  <span className="text-emerald-300 text-lg">💊</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold tracking-wider text-emerald-200 drop-shadow-lg">
                  【已拥有】
                </h2>
                <div className="w-8 h-8 bg-emerald-400/30 rounded-full flex items-center justify-center">
                  <span className="text-emerald-300 text-lg">💊</span>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...danyao_have, ...danyao2_have].map((item, index) => (
                  <article
                    key={index}
                    className="relative rounded-2xl bg-gradient-to-br from-emerald-900/40 to-emerald-700/30 p-5 shadow-xl border border-emerald-400/30 backdrop-blur-md"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-t-2xl"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-400/50 rounded-full"></div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-300 text-lg">🧪</span>
                        <h3 className="text-lg font-bold tracking-wide text-emerald-100 drop-shadow">
                          {item.name}
                        </h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-white/90">
                          <span className="text-emerald-300">📋</span>
                          <span>类型：</span>
                          <span className="font-semibold text-emerald-200">
                            {item.type}
                          </span>
                        </div>
                        <div className="flex items-start space-x-2 text-white/90">
                          <span className="text-emerald-300 mt-0.5">⚡</span>
                          <span>效果：</span>
                          <span className="font-semibold text-emerald-200">
                            {renderEffect(item)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-white/90">
                          <span className="text-amber-300">💰</span>
                          <span>价格：</span>
                          <span className="font-bold text-amber-300 text-lg">
                            {item.出售价.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 未拥有 */}
        {danyao_need.length > 0 && (
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-800/10 rounded-3xl blur-2xl"></div>
            <div className="relative rounded-3xl bg-white/8 backdrop-blur-xl ring-2 ring-red-400/30 p-6 md:p-8 shadow-2xl space-y-6 border border-red-300/20">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-red-400/30 rounded-full flex items-center justify-center">
                  <span className="text-red-300 text-lg">❌</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold tracking-wider text-red-200 drop-shadow-lg">
                  【未拥有】
                </h2>
                <div className="w-8 h-8 bg-red-400/30 rounded-full flex items-center justify-center">
                  <span className="text-red-300 text-lg">❌</span>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {danyao_need.map((item, index) => (
                  <article
                    key={index}
                    className="relative rounded-2xl bg-gradient-to-br from-red-900/40 to-red-700/30 p-5 shadow-xl border border-red-400/30 backdrop-blur-md"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-300 rounded-t-2xl"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 bg-red-400/50 rounded-full"></div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-300 text-lg">🧪</span>
                        <h3 className="text-lg font-bold tracking-wide text-red-100 drop-shadow">
                          {item.name}
                        </h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-white/90">
                          <span className="text-red-300">📋</span>
                          <span>类型：</span>
                          <span className="font-semibold text-red-200">
                            {item.type}
                          </span>
                        </div>
                        <div className="flex items-start space-x-2 text-white/90">
                          <span className="text-red-300 mt-0.5">⚡</span>
                          <span>效果：</span>
                          <span className="font-semibold text-red-200">
                            {renderEffect(item)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-white/90">
                          <span className="text-amber-300">💰</span>
                          <span>价格：</span>
                          <span className="font-bold text-amber-300 text-lg">
                            {item.出售价.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 底部装饰 */}
        <div className="flex justify-center space-x-4 pt-8">
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-400/50 to-transparent rounded-full"></div>
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400/30 to-red-400/30 rounded-full flex items-center justify-center">
            <span className="text-white/70 text-sm">🔥</span>
          </div>
          <div className="w-16 h-1 bg-gradient-to-l from-red-400/50 to-transparent rounded-full"></div>
        </div>
      </main>
    </HTML>
  )
}

export default Danyao
