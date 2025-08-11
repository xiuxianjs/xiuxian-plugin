import { Text, useSend } from 'alemonjs'

import { data, redis } from '@src/model/api'
import {
  notUndAndNull,
  shijianc,
  readDanyao,
  writeDanyao,
  addNajieThing
} from '@src/model/index'
import type { AssociationDetailData, Player } from '@src/types'
import type { DanyaoItem } from '@src/types/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?神兽赐福$/

interface PlayerGuildRef {
  宗门名称: string
  职位: string
}
function isPlayerGuildRef(v: unknown): v is PlayerGuildRef {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v
}
interface ExtAss extends AssociationDetailData {
  宗门神兽?: string
}
function isExtAss(v: unknown): v is ExtAss {
  return !!v && typeof v === 'object' && 'power' in v
}
interface DateParts {
  Y: number
  M: number
  D: number
}
function isDateParts(v: unknown): v is DateParts {
  return !!v && typeof v === 'object' && 'Y' in v && 'M' in v && 'D' in v
}
interface NamedClassItem {
  name: string
  class?: string
}
function toNamedList(arr: unknown): NamedClassItem[] {
  if (!Array.isArray(arr)) return []
  return arr
    .map(it => {
      if (it && typeof it === 'object') {
        const o = it as Record<string, unknown>
        if (typeof o.name === 'string') {
          return {
            name: o.name,
            class: typeof o.class === 'string' ? o.class : undefined
          }
        }
      }
      return undefined
    })
    .filter(v => v !== undefined) as NamedClassItem[]
}

// 从丹药列表中聚合旧字段逻辑 (示例: 以 name 匹配特殊药材影响概率)
function extractBlessProb(list: DanyaoItem[]): { bonus: number } {
  let bonus = 0
  for (const item of list) {
    if (item.name === '赐福之花' && item.count > 0) {
      bonus += 0.05 * item.count
      // 消耗 1 件
      if (item.count > 1) item.count -= 1
    }
  }
  return { bonus }
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await data.existData('player', usr_qq))) return false
  const player = (await data.getData('player', usr_qq)) as Player | null
  if (
    !player ||
    !notUndAndNull(player.宗门) ||
    !isPlayerGuildRef(player.宗门)
  ) {
    Send(Text('你尚未加入宗门'))
    return false
  }
  const assRaw = await data.getAssociation(player.宗门.宗门名称)
  if (assRaw === 'error' || !isExtAss(assRaw)) {
    Send(Text('宗门数据不存在'))
    return false
  }
  const ass = assRaw
  if (!ass.宗门神兽 || ass.宗门神兽 === '0' || ass.宗门神兽 === '无') {
    Send(Text('你的宗门还没有神兽的护佑，快去召唤神兽吧'))
    return false
  }

  const nowTime = Date.now()
  const Today = await shijianc(nowTime)
  const lastsign_time = await getLastsign_Bonus(usr_qq)
  if (isDateParts(Today) && isDateParts(lastsign_time)) {
    if (
      Today.Y === lastsign_time.Y &&
      Today.M === lastsign_time.M &&
      Today.D === lastsign_time.D
    ) {
      Send(Text('今日已经接受过神兽赐福了，明天再来吧'))
      return false
    }
  }

  await redis.set(`xiuxian@1.3.0:${usr_qq}:getLastsign_Bonus`, String(nowTime))

  let random = Math.random()
  const dyList = await readDanyao(usr_qq)
  const { bonus } = extractBlessProb(dyList)
  random += bonus
  await writeDanyao(usr_qq, dyList)

  if (random <= 0.7) {
    Send(Text(`${ass.宗门神兽}闭上了眼睛，表示今天不想理你`))
    return false
  }

  const beast = ass.宗门神兽
  const highProbLists: Record<string, NamedClassItem[]> = {
    麒麟: toNamedList(data.qilin),
    青龙: toNamedList(data.qinlong),
    玄武: toNamedList(data.xuanwu),
    朱雀: toNamedList(data.xuanwu), // 原逻辑同 xuanwu
    白虎: toNamedList(data.xuanwu)
  }
  const normalLists: Record<string, NamedClassItem[]> = {
    麒麟: toNamedList(data.danyao_list),
    青龙: toNamedList(data.gongfa_list),
    玄武: toNamedList(data.equipment_list),
    朱雀: toNamedList(data.equipment_list), // 原逻辑同 equipment
    白虎: toNamedList(data.equipment_list)
  }
  const highList = highProbLists[beast] || []
  const normalList = normalLists[beast] || []
  if (!highList.length && !normalList.length) {
    Send(Text('神兽奖励配置缺失'))
    return false
  }

  const randomB = Math.random()
  const fromList = randomB > 0.9 && highList.length ? highList : normalList
  const item = fromList[Math.floor(Math.random() * fromList.length)]
  if (!item) {
    Send(Text('本次赐福意外失败'))
    return false
  }
  const category = (item.class && typeof item.class === 'string'
    ? item.class
    : '道具') as unknown as import('@src/types').NajieCategory
  await addNajieThing(usr_qq, item.name, category, 1)
  if (randomB > 0.9) {
    Send(Text(`看见你来了, ${beast} 很高兴，仔细挑选了 ${item.name} 给你`))
  } else {
    Send(Text(`${beast} 今天心情不错，随手丢给了你 ${item.name}`))
  }
  return false
})

async function getLastsign_Bonus(usr_qq: string): Promise<DateParts | null> {
  const time = await redis.get(`xiuxian@1.3.0:${usr_qq}:getLastsign_Bonus`)
  if (time) {
    const parts = await shijianc(parseInt(time, 10))
    if (isDateParts(parts)) return parts
  }
  return null
}
