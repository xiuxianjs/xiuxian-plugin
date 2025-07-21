import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { data } from 'api/api'
import { existplayer, Read_player, isNotNull, Write_player } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)猎户转.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let player = await Read_player(usr_qq)
  if (player.occupation != '猎户') {
    Send(Text('你不是猎户,无法自选职业'))
    return false
  }
  let occupation = e.MessageText.replace('#猎户转', '')
  let x = data.occupation_list.find(item => item.name == occupation)
  if (!isNotNull(x)) {
    Send(Text(`没有[${occupation}]这项职业`))
    return false
  }
  player.occupation = occupation
  await Write_player(usr_qq, player)
  Send(Text(`恭喜${player.名号}转职为[${occupation}]`))
})
