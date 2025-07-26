import { Text, useSend } from 'alemonjs'

import { redis } from '@src/api/api'
import { __PATH, writeDuanlu } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?全体清空锻炉/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) return false
  await writeDuanlu([])

  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  for (let player_id of playerList) {
    let action: any = null
    await redis.set(
      'xiuxian@1.3.0:' + player_id + ':action10',
      JSON.stringify(action)
    )
  }
  Send(Text('清除完成'))
})
