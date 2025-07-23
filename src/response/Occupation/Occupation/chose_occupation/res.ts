import { Text, useSend } from 'alemonjs'

import { data, redis } from '@src/api/api'
import {
  Go,
  existplayer,
  Read_player,
  isNotNull,
  exist_najie_thing,
  Add_najie_thing,
  Write_player
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?转职.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let flag = await Go(e)
  if (!flag) {
    return false
  }
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false

  let occupation = e.MessageText.replace(/^(#|＃|\/)?转职/, '')
  let player = await Read_player(usr_qq)
  let player_occupation = player.occupation
  let x = data.occupation_list.find(item => item.name == occupation)
  if (!isNotNull(x)) {
    Send(Text(`没有[${occupation}]这项职业`))
    return false
  }
  let now_level_id
  now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  if (now_level_id < 17 && occupation == '采矿师') {
    Send(Text('包工头:就你这小身板还来挖矿？再去修炼几年吧'))
    return false
  }
  let thing_name = occupation + '转职凭证'
  let thing_class = '道具'
  let n = -1
  let thing_quantity = await exist_najie_thing(usr_qq, thing_name, thing_class)
  if (!thing_quantity) {
    //没有
    Send(Text(`你没有【${thing_name}】`))
    return false
  }
  if (player_occupation == occupation) {
    Send(Text(`你已经是[${player_occupation}]了，可使用[职业转化凭证]重新转职`))
    return false
  }
  await Add_najie_thing(usr_qq, thing_name, thing_class, n)
  if (player.occupation.length == 0) {
    player.occupation = occupation
    player.occupation_level = 1
    player.occupation_exp = 0
    await Write_player(usr_qq, player)
    Send(Text(`恭喜${player.名号}转职为[${occupation}]`))
    return false
  }
  let action: any = await redis.get('xiuxian:player:' + usr_qq + ':fuzhi') //副职
  action = await JSON.parse(action)
  if (action == null) {
    action = []
  }
  let arr = {
    职业名: player.occupation,
    职业经验: player.occupation_exp,
    职业等级: player.occupation_level
  }
  action = arr
  await redis.set('xiuxian:player:' + usr_qq + ':fuzhi', JSON.stringify(action))
  player.occupation = occupation
  player.occupation_level = 1
  player.occupation_exp = 0
  await Write_player(usr_qq, player)
  Send(Text(`恭喜${player.名号}转职为[${occupation}],您的副职为${arr.职业名}`))
})
