import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import { readPlayer } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?拒绝双修$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const player = await readPlayer(usr_qq)
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':couple', 1)
  Send(Text(player.名号 + '开启了拒绝模式'))
})
