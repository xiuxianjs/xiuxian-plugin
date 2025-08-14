import { Text, useMention, useSend } from 'alemonjs'

import {
  existplayer,
  addCoin,
  addExp,
  addExp2,
  foundthing,
  addNajieThing
} from '@src/model/index'

import { selects } from '@src/response/index'
// 允许：#发 灵石*100 | #发 修为*5000 | #发 血气*300 | #发 剑*优*1
export const regular = /^(#|＃|\/)?发\S+(?:\*\S+){1,2}$/

function toInt(v, def = 0): number {
  const n = Number(v)
  return Number.isFinite(n) ? Math.floor(n) : def
}
const PINJI_MAP: Record<string, number> = {
  劣: 0,
  普: 1,
  优: 2,
  精: 3,
  极: 4,
  绝: 5,
  顶: 6
}
function parsePinji(raw: string | undefined): number | undefined {
  if (!raw) return undefined
  if (raw in PINJI_MAP) return PINJI_MAP[raw]
  const n = Number(raw)
  if (Number.isInteger(n) && n >= 0 && n <= 6) return n
  return undefined
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) return false

  // 解析 @ 目标
  let targetQQ: string | undefined
  try {
    const mention = useMention(e)[0]
    const res = await mention.find({ IsBot: false })
    const list = res?.data || []
    const user = list.find(i => !i.IsBot)
    if (user) targetQQ = user.UserId
  } catch {
    // ignore
  }
  if (!targetQQ) return false

  if (!(await existplayer(targetQQ))) {
    Send(Text('对方无踏入仙途'))
    return false
  }

  // 去掉前缀“发”
  const raw = e.MessageText.replace(/^(#|＃|\/)?发/, '')
  const parts = raw
    .split('*')
    .map(s => s.trim())
    .filter(Boolean)
  if (parts.length < 2) {
    Send(Text('格式错误，应为: 发 资源名*数量 或 发 装备名*品级*数量'))
    return false
  }
  const thingName = parts[0]

  // 三类基础资源直接发放
  if (thingName === '灵石' || thingName === '修为' || thingName === '血气') {
    const amount = toInt(parts[1], 1)
    if (amount <= 0) {
      Send(Text('数量需为正整数'))
      return false
    }
    if (thingName === '灵石') await addCoin(targetQQ, amount)
    else if (thingName === '修为') await addExp(targetQQ, amount)
    else await addExp2(targetQQ, amount)
    Send(Text(`发放成功: ${thingName} x ${amount}`))
    return false
  }

  // 其他物品
  const thingDef = await foundthing(thingName)
  if (!thingDef) {
    Send(Text(`这方世界没有[${thingName}]`))
    return false
  }
  const itemClass = String(thingDef.class || '道具') as Parameters<
    typeof addNajieThing
  >[2]

  let pinji: number | undefined
  let amountStr: string | undefined
  if (itemClass === '装备') {
    // 可能格式： 名称*品级*数量 / 名称*数量
    const maybePinji = parsePinji(parts[1])
    if (maybePinji !== undefined) {
      pinji = maybePinji
      amountStr = parts[2]
    } else {
      amountStr = parts[1]
    }
  } else {
    amountStr = parts[1]
  }

  const amount = toInt(amountStr, 1)
  if (amount <= 0) {
    Send(Text('数量需为正整数'))
    return false
  }

  await addNajieThing(targetQQ, thingName, itemClass, amount, pinji)
  Send(
    Text(
      `发放成功, 增加${thingName} x ${amount}${pinji !== undefined ? ` (品级:${pinji})` : ''}`
    )
  )
  return false
})
