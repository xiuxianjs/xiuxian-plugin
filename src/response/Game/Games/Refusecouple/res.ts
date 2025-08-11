import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import { readPlayer, existplayer } from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?拒绝双修$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) {
    return false
  }
  const player = await readPlayer(usr_qq)
  if (!player) {
    Send(Text('玩家数据读取失败'))
    return false
  }
  await redis.set(`xiuxian@1.3.0:${usr_qq}:couple`, 1)
  Send(Text(`${player.名号}开启了拒绝模式`))
  return false
})
