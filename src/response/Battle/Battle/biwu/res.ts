import { Text, useMention, useSend } from 'alemonjs'

import { existplayer, readPlayer, zdBattle } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?^(以武会友)$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let A = e.UserId
  //先判断
  let ifexistplay_A = await existplayer(A)
  if (!ifexistplay_A) {
    return false
  }
  const Mentions = (await useMention(e)[0].find({ IsBot: false })).data
  if (!Mentions || Mentions.length === 0) {
    return // @ 提及为空
  }
  // 查找用户类型的 @ 提及，且不是 bot
  const User = Mentions.find(item => !item.IsBot)
  if (!User) {
    return // 未找到用户Id
  }
  let B = User.UserId //后手

  if (A == B) {
    Send(Text('你还跟自己修炼上了是不是?'))
    return false
  }
  let ifexistplay_B = await existplayer(B)
  if (!ifexistplay_B) {
    Send(Text('修仙者不可对凡人出手!'))
    return false
  }
  //这里前戏做完,确定要开打了
  let final_msg = []
  let A_player = await readPlayer(A)
  let B_player = await readPlayer(B)
  final_msg.push(`${A_player.名号}向${B_player.名号}发起了切磋。`)
  A_player.法球倍率 = A_player.灵根.法球倍率
  B_player.法球倍率 = B_player.灵根.法球倍率
  A_player.当前血量 = A_player.血量上限
  B_player.当前血量 = B_player.血量上限
  let Data_battle = await zdBattle(A_player, B_player)
  let msg = Data_battle.msg
  // await ForwardMsg(e, msg)
  Send(Text(msg))
  //最后发送消息
  Send(Text(final_msg.join('')))
})
