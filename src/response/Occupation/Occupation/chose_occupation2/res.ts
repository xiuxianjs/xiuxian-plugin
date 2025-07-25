import { Text, useSend } from 'alemonjs'

import { redis } from '@src/api/api'
import { Go, existplayer, readPlayer, writePlayer } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?转换副职$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let flag = await Go(e)
  if (!flag) {
    return false
  }
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false

  let player = await readPlayer(usr_qq)
  let action: any = await redis.get('xiuxian:player:' + usr_qq + ':fuzhi') //副职
  action = await JSON.parse(action)
  if (action == null) {
    action = []
    Send(Text(`您还没有副职哦`))
    return false
  }
  let a, b, c
  a = action.职业名
  b = action.职业经验
  c = action.职业等级
  action.职业名 = player.occupation
  action.职业经验 = player.occupation_exp
  action.职业等级 = player.occupation_level
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
