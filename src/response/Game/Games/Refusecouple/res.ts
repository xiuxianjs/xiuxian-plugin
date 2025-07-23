import { Text, useSend } from 'alemonjs'

import { redis } from '@src/api/api'
import { Read_player } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)拒绝双修$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let player = await Read_player(usr_qq)
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':couple', 1)
  Send(Text(player.名号 + '开启了拒绝模式'))
})
