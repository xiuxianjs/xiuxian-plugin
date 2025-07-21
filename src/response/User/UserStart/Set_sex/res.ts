import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { data } from 'api/api'
import { existplayer, Read_player } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)设置性别.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)

  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let player: any = await Read_player(usr_qq)
  if (player.sex != 0) {
    Send(Text('每个存档仅可设置一次性别！'))
    return
  }
  //命令判断
  let msg = e.MessageText.replace('#设置性别', '')
  if (msg != '男' && msg != '女') {
    Send(Text('请发送#设置性别男 或 #设置性别女'))
    return
  }
  player.sex = msg == '男' ? 2 : 1
  await data.setData('player', usr_qq, player)
  Send(Text(`${player.名号}的性别已成功设置为 ${msg}。`))
})
