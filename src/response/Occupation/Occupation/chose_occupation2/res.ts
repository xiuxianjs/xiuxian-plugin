import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import {
  Go,
  existplayer,
  keys,
  readPlayer,
  writePlayer
} from '@src/model/index'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?转换副职$/

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  // 校验当前是否可进行操作
  const flag = await Go(e)
  if (!flag) {
    return false
  }
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false

  const player = await readPlayer(usr_qq)
  // 获取副职
  const actionStr = await redis.get(keys.fuzhi(usr_qq))
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
  ;(action as Fuzhi).职业名 = player.occupation as string
  ;(action as Fuzhi).职业经验 = player.occupation_exp as number
  ;(action as Fuzhi).职业等级 = player.occupation_level as number
  player.occupation = a
  player.occupation_exp = b
  player.occupation_level = c
  await redis.set(keys.fuzhi(usr_qq), JSON.stringify(action))
  await writePlayer(usr_qq, player)
  Send(
    Text(
      `恭喜${player.名号}转职为[${player.occupation}],您的副职为${action.职业名}`
    )
  )
})
import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
