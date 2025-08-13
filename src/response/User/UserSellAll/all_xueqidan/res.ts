import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import {
  existplayer,
  existNajieThing,
  addNajieThing,
  addExp2
} from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?一键服用血气丹$/

interface DanYaoItem {
  name: string
  type: string
  class: string | number
  xueqi?: number
}
interface NajieLike {
  丹药?: DanYaoItem[]
}

function num(v, d = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : d
}

function normalizeCategory(v): Parameters<typeof existNajieThing>[2] {
  return String(v) as Parameters<typeof existNajieThing>[2]
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false

  const najie = (await data.getData('najie', usr_qq)) as NajieLike | null
  const pills = Array.isArray(najie?.丹药) ? najie!.丹药! : []
  if (!pills.length) {
    Send(Text('纳戒内没有丹药'))
    return false
  }

  let totalGain = 0
  for (const pill of pills) {
    if (!pill || pill.type !== '血气') continue
    const category = normalizeCategory(pill.class)
    const qty = num(await existNajieThing(usr_qq, pill.name, category), 0)
    if (qty <= 0) continue
    const gain = num(pill.xueqi, 0) * qty
    if (gain > 0) {
      await addNajieThing(usr_qq, pill.name, category, -qty)
      totalGain += gain
    }
  }
  if (totalGain <= 0) {
    Send(Text('没有可服用的血气丹'))
    return false
  }
  await addExp2(usr_qq, totalGain)
  Send(Text(`服用成功，血气增加${totalGain}`))
  return false
})
