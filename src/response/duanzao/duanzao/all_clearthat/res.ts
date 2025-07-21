import { Text, useSend } from 'alemonjs'
import fs from 'fs'
import { createEventName } from '@src/response/util'
import { redis } from '@src/api/api'
import { Write_duanlu } from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)全体清空锻炉/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) return false
  await Write_duanlu([])
  let playerList = []
  let files = fs
    .readdirSync('./resources/data/xiuxian_player')
    .filter(file => file.endsWith('.json'))
  for (let file of files) {
    file = file.replace('.json', '')
    playerList.push(file)
  }
  for (let player_id of playerList) {
    let action: any = null
    await redis.set(
      'xiuxian@1.3.0:' + player_id + ':action10',
      JSON.stringify(action)
    )
  }
  Send(Text('清除完成'))
})
