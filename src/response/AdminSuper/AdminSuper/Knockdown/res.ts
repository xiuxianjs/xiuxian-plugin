import { Text, useSend, useMention, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { existplayer, Read_player, Write_player } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)打落凡间.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  {
    if (!e.IsMaster) return false
    const Mentions = await useMention(e)
    if (!Mentions || Mentions.length === 0) {
      return // @ 提及为空
    }
    // 查找用户类型的 @ 提及，且不是 bot
    const User = Mentions.find(item => !item.IsBot)
    if (!User) {
      return // 未找到用户Id
    }

    //对方qq
    let qq = User.UserId
    //检查存档
    let ifexistplay = await existplayer(qq)
    if (!ifexistplay) {
      Send(Text('没存档你打个锤子！'))
      return false
    }
    let player = await Read_player(qq)
    player.power_place = 1
    Send(Text('已打落凡间！'))
    await Write_player(qq, player)
    return false
  }
})
