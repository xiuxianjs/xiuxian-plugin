import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import {
  existplayer,
  readPlayer,
  notUndAndNull,
  writePlayer
} from '@src/model/index'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?猎户转.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  const player = await readPlayer(usr_qq)
  if (player.occupation != '猎户') {
    Send(Text('你不是猎户,无法自选职业'))
    return false
  }
  const occupation = e.MessageText.replace(/^(#|＃|\/)?猎户转/, '')
  const x = data.occupation_list.find(item => item.name == occupation)
  if (!notUndAndNull(x)) {
    Send(Text(`没有[${occupation}]这项职业`))
    return false
  }
  player.occupation = occupation
  await writePlayer(usr_qq, player)
  Send(Text(`恭喜${player.名号}转职为[${occupation}]`))
})
