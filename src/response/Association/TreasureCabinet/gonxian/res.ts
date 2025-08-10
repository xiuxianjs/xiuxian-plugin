import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import { notUndAndNull } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?我的贡献$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  //用户不存在
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) return false
  const player = await data.getData('player', usr_qq)
  //无宗门
  if (!notUndAndNull(player.宗门)) {
    Send(Text('你尚未加入宗门'))
    return false
  }
  if (!notUndAndNull(player.宗门.lingshi_donate)) {
    player.宗门.lingshi_donate = 0
  }
  if (0 > player.宗门.lingshi_donate) {
    player.宗门.lingshi_donate = 0
  }
  //贡献值为捐献灵石除10000
  const gonxianzhi = Math.trunc(player.宗门.lingshi_donate / 10000)
  Send(
    Text(
      '你为宗门的贡献值为[' +
        gonxianzhi +
        '],可以在#宗门藏宝阁 使用贡献值兑换宗门物品,感谢您对宗门做出的贡献'
    )
  )
})
