import { Text, useSend } from 'alemonjs'

import { redis } from '@src/api/api'
import { readPlayer } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?允许双修$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let player = await readPlayer(usr_qq)
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':couple', 0)
  Send(Text(player.名号 + '开启了允许模式'))
})
