import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from '@src/resources/styles/tw.scss'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'
import stateURL from '@src/resources/img/state.jpg'
import user_state from '@src/resources/img/user_state.png'

interface XiuxianSettingsProps {
  // 冷却时间设置
  CDassociation: number
  CDjoinassociation: number
  CDassociationbattle: number
  CDrob: number
  CDgambling: number
  CDcouple: number
  CDgarden: number
  CDlevel_up: number
  CDsecretplace: number
  CDtimeplace: number
  CDforbiddenarea: number
  CDreborn: number
  CDtransfer: number
  CDhonbao: number
  // 金银坊设置
  percentagecost: number
  percentageMoneynumber: number
  percentagepunishment: number
  sizeMoney: number
  // 开关设置
  switchplay: string
  switchMoneynumber: string
  switchcouple: string
  switchXiuianplay_key: string
  // 收益设置
  biguansize: number
  biguantime: number
  biguancycle: number
  worksize: number
  worktime: number
  workcycle: number
  // 出金概率
  SecretPlaceone: number
  SecretPlacetwo: number
  SecretPlacethree: number
}

// 设置项组件
const SettingItem = ({
  label,
  value,
  unit = ''
}: {
  label: string
  value: string | number
  unit?: string
}) => (
  <div className="flex items-center justify-between gap-4 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white text-sm md:text-base shadow-inner">
    <span className="font-medium tracking-wide">{label}</span>
    <span className="font-semibold text-brand-accent">
      {value}
      {unit}
    </span>
  </div>
)

// 设置区块组件
const SettingSection = ({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) => (
  <section className="w-full rounded-2xl bg-gradient-to-br from-white/5 to-white/10 shadow-card ring-1 ring-white/10 p-4 md:p-6 space-y-4">
    <h2 className="text-xl md:text-2xl font-semibold text-white tracking-wider flex items-center gap-2">
      <span className="inline-block w-1.5 h-6 bg-brand-accent rounded-full" />
      {title}
    </h2>
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  </section>
)

const XiuxianSettings: React.FC<XiuxianSettingsProps> = props => {
  // 配置数据结构化
  const cooldownSettings = [
    { label: '宗门维护', value: props.CDassociation, unit: '分' },
    { label: '退宗', value: props.CDjoinassociation, unit: '分' },
    { label: '宗门大战', value: props.CDassociationbattle, unit: '分' },
    { label: '打劫', value: props.CDrob, unit: '分' },
    { label: '金银坊', value: props.CDgambling, unit: '分' },
    { label: '双修', value: props.CDcouple, unit: '分' },
    { label: '药园', value: props.CDgarden, unit: '分' },
    { label: '突破', value: props.CDlevel_up, unit: '分' },
    { label: '秘境', value: props.CDsecretplace, unit: '分' },
    { label: '仙府', value: props.CDtimeplace, unit: '分' },
    { label: '禁地', value: props.CDforbiddenarea, unit: '分' },
    { label: '重生', value: props.CDreborn, unit: '分' },
    { label: '转账', value: props.CDtransfer, unit: '分' },
    { label: '抢红包', value: props.CDhonbao, unit: '分' }
  ]

  const gamblingSettings = [
    { label: '手续费', value: props.percentagecost },
    { label: '金银坊收益', value: props.percentageMoneynumber },
    { label: '出千收益', value: props.percentagepunishment },
    { label: '出千控制', value: props.sizeMoney, unit: '万' }
  ]

  const switchSettings = [
    { label: '怡红院', value: props.switchplay },
    { label: '金银坊', value: props.switchMoneynumber },
    { label: '双修', value: props.switchcouple },
    { label: '怡红院卡图', value: props.switchXiuianplay_key }
  ]

  const incomeSettings = [
    { label: '闭关倍率', value: props.biguansize },
    { label: '闭关最低时间', value: props.biguantime, unit: '分' },
    { label: '闭关周期', value: props.biguancycle },
    { label: '除妖倍率', value: props.worksize },
    { label: '除妖最低时间', value: props.worktime, unit: '分' },
    { label: '除妖周期', value: props.workcycle }
  ]

  const goldSettings = [
    { label: '第一概率', value: props.SecretPlaceone },
    { label: '第二概率', value: props.SecretPlacetwo },
    { label: '第三概率', value: props.SecretPlacethree }
  ]

  // 设置区块配置数组
  const settingSections = [
    { title: '冷却设置', settings: cooldownSettings },
    { title: '金银坊设置', settings: gamblingSettings },
    { title: '开关', settings: switchSettings },
    { title: '收益设置', settings: incomeSettings },
    { title: '出金设置', settings: goldSettings }
  ]

  const styles = `
    @font-face {
      font-family: 'tttgbnumber';
      src: url('${tttgbnumberURL}');
      font-weight: normal;
      font-style: normal;
    }
    body { font-family: 'tttgbnumber', system-ui, sans-serif; }
  `
  return (
    <html>
      <head>
        <LinkStyleSheet src={cssURL} />
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body
        className="min-h-screen w-full bg-cover bg-fixed bg-top text-center p-4 md:p-8 space-y-8"
        style={{ backgroundImage: `url(${stateURL})` }}
      >
        <main className="max-w-6xl mx-auto space-y-8">
          <header className="text-center space-y-4">
            <div
              className="mx-auto w-56 h-56 rounded-full bg-cover bg-center ring-4 ring-white/30 shadow-card"
              style={{ backgroundImage: `url(${user_state})` }}
            />
            <h1 className="inline-block px-6 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow">
              #修仙设置
            </h1>
          </header>

          <div className="flex flex-col gap-8">
            {settingSections.map((section, sectionIndex) => (
              <SettingSection key={sectionIndex} title={section.title}>
                {section.settings.map((setting, index) => (
                  <SettingItem
                    key={index}
                    label={setting.label}
                    value={setting.value}
                    unit={setting.unit}
                  />
                ))}
              </SettingSection>
            ))}
          </div>
        </main>
      </body>
    </html>
  )
}

export default XiuxianSettings
