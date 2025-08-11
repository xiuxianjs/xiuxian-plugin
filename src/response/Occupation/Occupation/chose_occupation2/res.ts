import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import { Go, existplayer, readPlayer, writePlayer } from '@src/model/index'
import type { AnyMessageEvent } from '@src/model/common'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?转换副职$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  // Go 需要 AnyMessageEvent，e 框架事件此处显式断言为兼容结构
  const flag = await Go(e as unknown MessageEvent)
  if (!flag) {
    return false
  }
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false

  const player = await readPlayer(usr_qq)
  const actionStr = await redis.get('xiuxian:player:' + usr_qq + ':fuzhi') //副职
  if (!actionStr) {
    Send(Text(`您还没有副职哦`))
    return false
  }
  interface Fuzhi {
    职业名: string
    职业经验: number
    职业等级: number
  }
  const action = JSON.parse(actionStr) as Partial<Fuzhi>
  if (!action || !action.职业名) {
    Send(Text(`您还没有副职哦`))
    return false
  }
  const a = action.职业名 as string
  const b = action.职业经验 as number
  const c = action.职业等级 as number
  ;(action as Fuzhi).职业名 = player.occupation as unknown as string
  ;(action as Fuzhi).职业经验 = player.occupation_exp as unknown as number
  ;(action as Fuzhi).职业等级 = player.occupation_level as unknown as number
  player.occupation = a
  player.occupation_exp = b
  player.occupation_level = c
  await redis.set('xiuxian:player:' + usr_qq + ':fuzhi', JSON.stringify(action))
  await writePlayer(usr_qq, player)
  Send(
    Text(
      `恭喜${player.名号}转职为[${player.occupation}],您的副职为${action.职业名}`
    )
  )
})
