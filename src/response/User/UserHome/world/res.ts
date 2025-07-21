import { Text, useSend, createSelects } from 'alemonjs'
import fs from 'fs'
import { createEventName } from '@src/response/util'
import { data } from 'api/api'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)修仙世界$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let playerList = []
  let files = fs
    .readdirSync('./resources/data/xiuxian_player')
    .filter(file => file.endsWith('.json'))
  for (let file of files) {
    file = file.replace('.json', '')
    playerList.push(file)
  }
  let num = [0, 0, 0, 0]
  for (let player_id of playerList) {
    let usr_qq = player_id
    let player = await data.getData('player', usr_qq)
    if (player.魔道值 > 999) num[3]++
    else if ((player.lunhui > 0 || player.level_id > 41) && player.魔道值 < 1)
      num[0]++
    else if (player.lunhui > 0 || player.level_id > 41) num[1]++
    else num[2]++
  }
  const n = num[0] + num[1] + num[2]
  let msg =
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
