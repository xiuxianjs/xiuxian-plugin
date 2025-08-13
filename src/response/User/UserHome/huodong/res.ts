import { Text, useSend } from 'alemonjs'

import { data, redis } from '@src/model/api'
import { existplayer, addNajieThing } from '@src/model/index'
import type { NajieCategory } from '@src/types/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?活动兑换.*$/

// 兑换码结构类型
interface ExchangeThing {
  name: string
  class: string
  数量: number
}
interface ExchangeCode {
  name: string
  thing: ExchangeThing[]
}

function toInt(v, d = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : d
}
function parseJson<T>(raw): T | null {
  if (typeof raw !== 'string' || !raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}
const CATEGORY_SET: Set<NajieCategory> = new Set([
  '装备',
  '丹药',
  '道具',
  '功法',
  '草药',
  '材料',
  '仙宠',
  '仙宠口粮'
])
function normalizeCategory(c: string | undefined): NajieCategory {
  return CATEGORY_SET.has(c as NajieCategory) ? (c as NajieCategory) : '道具'
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false

  const codeInput = e.MessageText.replace(/^(#|＃|\/)?活动兑换/, '').trim()
  if (!codeInput) {
    Send(Text('请在指令后输入兑换码'))
    return false
  }

  const list = (data.duihuan || []) as ExchangeCode[]
  const codeObj = list.find(c => c.name === codeInput)
  if (!codeObj) {
    Send(Text('兑换码不存在!'))
    return false
  }

  const key = `xiuxian@1.3.0:${usr_qq}:duihuan`
  const usedList = parseJson<string[]>(await redis.get(key)) || []
  if (usedList.includes(codeInput)) {
    Send(Text('你已经兑换过该兑换码了'))
    return false
  }

  // 标记已使用 (先写入，防并发重复领取)
  usedList.push(codeInput)
  await redis.set(key, JSON.stringify(usedList))

  const msg: string[] = []
  for (const t of codeObj.thing || []) {
    const qty = toInt(t.数量, 0)
    if (!t.name || qty <= 0) continue
    const cate = normalizeCategory(t.class)
    await addNajieThing(usr_qq, t.name, cate, qty)
    msg.push(`\n${t.name}x${qty}`)
  }
  if (!msg.length) {
    Send(Text('该兑换码没有有效奖励内容'))
    return false
  }
  Send(Text('恭喜获得:' + msg.join('')))
  return false
})
