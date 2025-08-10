import { Text, useSend } from 'alemonjs'
import { data, redis } from '@src/model/api'

import { selects } from '@src/response/index'
import { __PATH } from '@src/model/index'
export const regular = /^(#|＃|\/)?修仙世界$/

export default onResponse(selects, async e => {
  const Send = useSend(e)

  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))

  const num = [0, 0, 0, 0]
  for (const player_id of playerList) {
    const usr_qq = player_id
    const player = await await data.getData('player', usr_qq)
    if (player.魔道值 > 999) num[3]++
    else if ((player.lunhui > 0 || player.level_id > 41) && player.魔道值 < 1)
      num[0]++
    else if (player.lunhui > 0 || player.level_id > 41) num[1]++
    else num[2]++
  }
  const n = num[0] + num[1] + num[2]
  const msg =
    '___[修仙世界]___' +
    '\n人数：' +
    n +
    '\n神人：' +
    num[0] +
    '\n仙人：' +
    num[1] +
    '\n凡人：' +
    num[2] +
    '\n魔头：' +
    num[3]
  Send(Text(msg))
})
