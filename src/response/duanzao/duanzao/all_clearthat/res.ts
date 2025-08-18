import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import { __PATH, writeDuanlu } from '@src/model/index'
import { stopActionWithSuffix } from '@src/response/actionHelper'
import { setValue, userKey } from '@src/model/utils/redisHelper'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?全体清空锻炉/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) return false
  await writeDuanlu([])

  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  for (const player_id of playerList) {
    await stopActionWithSuffix(player_id, 'action10')
    await setValue(userKey(player_id, 'action10'), null)
  }
  Send(Text('清除完成'))
})
