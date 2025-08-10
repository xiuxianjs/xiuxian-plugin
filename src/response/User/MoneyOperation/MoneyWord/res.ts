import { Text, useSend } from 'alemonjs'

import { existplayer, convert2integer, readPlayer, addCoin } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?交税[1-9]d*/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  //这是自己的
  const usr_qq = e.UserId
  //自己没存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  //获取发送灵石数量
  let lingshi: any = e.MessageText.replace(/^(#|＃|\/)?交税/, '')
  lingshi = await convert2integer(lingshi)
  const player = await readPlayer(usr_qq)
  if (player.灵石 <= lingshi) {
    Send(Text('醒醒，你没有那么多'))
    return false
  }
  await addCoin(usr_qq, -lingshi)
  Send(Text('成功交税' + lingshi))
})
