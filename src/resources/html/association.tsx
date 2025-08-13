import React from 'react'
import playerURL from '@src/resources/img/player.jpg'
import playerFooterURL from '@src/resources/img/player_footer.png'
import HTML from './HTML'
import { Avatar } from './Avatar'

interface AssociationData {
  宗门名称?: string
  宗门等级?: number | string
  灵石池?: number | string
  所有成员?[]
  大阵血量?: number | string
  宗门建设等级?: number | string
  宗门神兽?: string
  创立时间?: [string, ...string[]] | string[]
}

interface AssociationProps {
  user_id: string | number
  ass: AssociationData
  mainname: string
  mainqq: string | number
  weizhi: string
  state: string
  xiulian: number | string
  level: number | string
  fuzong?: string[]
  zhanglao?: string[]
  neimen?: string[]
  waimen?: string[]
}

const BadgeList = ({ title, items }: { title: string; items?: string[] }) => (
  <section className="w-full text-white rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 md:p-6 shadow-card space-y-3">
    <h2 className="text-lg md:text-xl font-semibold  tracking-wider flex items-center gap-2">
      <span className="w-1.5 h-6 bg-brand-accent rounded-full" />
      {title}
    </h2>
    <div className="flex flex-wrap gap-2">
      {items?.length ? (
        items.map((it, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-full bg-brand-dark/60  text-sm font-medium shadow ring-1 ring-brand-accent/20"
          >
            {it}
          </span>
        ))
      ) : (
        <span className="/60 text-sm">暂无</span>
      )}
    </div>
  </section>
)

const InfoItem = ({
  label,
  value
}: {
  label: string
  value: React.ReactNode
}) => (
  <div className="flex items-center justify-between gap-4 px-4 py-2 rounded-lg bg-white/30  text-sm md:text-base">
    <span className="font-medium tracking-wide">{label}</span>
    <span className="font-semibold  break-all">{value}</span>
  </div>
)

const Association: React.FC<AssociationProps> = ({
  user_id,
  ass,
  mainname,
  mainqq,
  weizhi,
  state,
  xiulian,
  level,
  fuzong,
  zhanglao,
  neimen,
  waimen
}) => {
  return (
    <HTML
      className=" w-full text-center p-4 md:p-8 bg-top bg-no-repeat bg-[length:100%]"
      style={{
        backgroundImage: `url(${playerURL}), url(${playerFooterURL})`,
        backgroundRepeat: 'no-repeat, repeat',
        backgroundSize: '100%, auto'
      }}
    >
      <main className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex flex-col items-center gap-4">
            <Avatar
              src={`https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`}
              rootClassName="w-60 h-60"
              className="w-40 h-40"
            />
            <div className="px-5 py-1.5 rounded-2xl bg-black/40 text-white backdrop-blur  text-lg font-semibold shadow">
              QQ: {user_id}
            </div>
          </div>
          <div className="flex-1 flex w-full rounded-2xl bg-white/5 p-2 pt-5 pb-5  ring-white/10 backdrop-blur-md  shadow-card">
            <div className="flex-1 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <InfoItem label="名称" value={ass?.宗门名称 || '-'} />
              <InfoItem
                label="宗主"
                value={
                  <div>
                    {mainname}
                    <br />
                    {mainqq}
                  </div>
                }
              />
              <InfoItem label="等级" value={ass?.宗门等级 ?? '-'} />
              <InfoItem label="灵石" value={ass?.灵石池 ?? 0} />
              <InfoItem label="人数" value={ass?.所有成员?.length ?? 0} />
              <InfoItem label="宗门位置" value={weizhi || '-'} />
            </div>
          </div>
        </header>

        <section className="w-full rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 md:p-6 shadow-card space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold  tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-6 bg-brand-accent rounded-full" />
            信息
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="门派状态" value={state} />
            <InfoItem label="天赋加强" value={`${xiulian}%`} />
            <InfoItem label="大阵强度" value={ass?.大阵血量 ?? 0} />
            <InfoItem label="入宗门槛" value={level} />
            <InfoItem label="宗门建设等级" value={ass?.宗门建设等级 ?? '-'} />
            <InfoItem label="镇宗神兽" value={ass?.宗门神兽 ?? '-'} />
          </div>
        </section>

        <div className="grid gap-8 md:grid-cols-2">
          <BadgeList title="副宗主" items={fuzong} />
          <BadgeList title="长老" items={zhanglao} />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <BadgeList title="内门弟子" items={neimen} />
          <BadgeList title="外门弟子" items={waimen} />
        </div>

        <section className="w-full rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 md:p-6 shadow-card">
          <p className="/80 text-sm md:text-base tracking-wide">
            创立于: {ass?.创立时间?.[0] || '-'}
          </p>
        </section>
      </main>
    </HTML>
  )
}

export default Association
