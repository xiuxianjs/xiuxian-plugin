import { Text, useSend } from 'alemonjs'

import { data, redis } from '@src/model/api'
import {
  Go,
  existplayer,
  readPlayer,
  notUndAndNull,
  existNajieThing,
  addNajieThing,
  writePlayer
} from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?转职.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const flag = await Go(e)
  if (!flag) {
    return false
  }
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false

  const occupation = e.MessageText.replace(/^(#|＃|\/)?转职/, '')
  const player = await readPlayer(usr_qq)
  const player_occupation = player.occupation
  const x = data.occupation_list.find(item => item.name == occupation)
  if (!notUndAndNull(x)) {
    Send(Text(`没有[${occupation}]这项职业`))
    return false
  }
  const now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  if (now_level_id < 17 && occupation == '采矿师') {
    Send(Text('包工头:就你这小身板还来挖矿？再去修炼几年吧'))
    return false
  }
  const thing_name = occupation + '转职凭证'
  const thing_class = '道具'
  const n = -1
  const thing_quantity = await existNajieThing(usr_qq, thing_name, thing_class)
  if (!thing_quantity) {
    //没有
    Send(Text(`你没有【${thing_name}】`))
    return false
  }
  if (player_occupation == occupation) {
    Send(Text(`你已经是[${player_occupation}]了，可使用[职业转化凭证]重新转职`))
    return false
  }
  await addNajieThing(usr_qq, thing_name, thing_class, n)
  if (player.occupation.length == 0) {
    player.occupation = occupation
    player.occupation_level = 1
    player.occupation_exp = 0
    await writePlayer(usr_qq, player)
    Send(Text(`恭喜${player.名号}转职为[${occupation}]`))
    return false
  }
  let action: any = await redis.get('xiuxian:player:' + usr_qq + ':fuzhi') //副职
  action = await JSON.parse(action)
  if (action == null) {
    action = []
  }
  const arr = {
    职业名: player.occupation,
    职业经验: player.occupation_exp,
    职业等级: player.occupation_level
  }
  action = arr
  await redis.set('xiuxian:player:' + usr_qq + ':fuzhi', JSON.stringify(action))
  player.occupation = occupation
  player.occupation_level = 1
  player.occupation_exp = 0
  await writePlayer(usr_qq, player)
  Send(Text(`恭喜${player.名号}转职为[${occupation}],您的副职为${arr.职业名}`))
})
