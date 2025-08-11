import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './adminset.css'
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
  value
  unit?: string
}) => (
  <div>
    {label}：{value}
    {unit}
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
  <div className="user_bottom1">
    <div className="use_data">
      <div className="use_data_head">
        <div className="user_font">{title}</div>
        <div className="user_font">{children}</div>
      </div>
    </div>
  </div>
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
    body {
      transform: scale(1);
      width: 100%;
      text-align: center;
      background-image: url('${stateURL}');
      background-size: 100% auto;
    }
    .user_top_img_bottom {
      margin: auto;
      background-image: url('${user_state}');
      background-size: 100% auto;
      width: 280px;
      height: 280px;
    }
  `
  return (
    <html>
      <head>
        <LinkStyleSheet src={cssURL} />
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body>
        <div>
          <div className="user_bottom1">
            <div className="use_data">
              <div className="use_data_head">
                <div className="user_font">#修仙设置</div>
              </div>
            </div>
          </div>

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

          <div className="user_bottom2"></div>
        </div>
      </body>
    </html>
  )
}

export default XiuxianSettings
