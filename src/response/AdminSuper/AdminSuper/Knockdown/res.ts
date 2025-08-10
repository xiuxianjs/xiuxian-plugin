import { Text, useSend, useMention } from 'alemonjs'

import { existplayer, readPlayer, writePlayer } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)打落凡间.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  {
    if (!e.IsMaster) return false
    const Mentions = (await useMention(e)[0].find({ IsBot: false })).data
    if (!Mentions || Mentions.length === 0) {
      return // @ 提及为空
    }
    // 查找用户类型的 @ 提及，且不是 bot
    const User = Mentions.find(item => !item.IsBot)
    if (!User) {
      return // 未找到用户Id
    }

    //对方qq
    const qq = User.UserId
    //检查存档
    const ifexistplay = await existplayer(qq)
    if (!ifexistplay) {
      Send(Text('没存档你打个锤子！'))
      return false
    }
    const player = await readPlayer(qq)
    player.power_place = 1
    Send(Text('已打落凡间！'))
    await writePlayer(qq, player)
    return false
  }
})
