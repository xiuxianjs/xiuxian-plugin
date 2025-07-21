import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { redis } from '@src/api/api'
import { sleep } from '@src/model'
import { BossIsAlive, SortPlayer } from '../../boss'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)金角大王贡献榜$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (await BossIsAlive()) {
    let PlayerRecord: any = await redis.get('xiuxian@1.3.0Record2')
    let WorldBossStatusStr: any = await redis.get('Xiuxian:WorldBossStatus2')
    WorldBossStatusStr = JSON.parse(WorldBossStatusStr)
    PlayerRecord = JSON.parse(PlayerRecord)
    let PlayerList = await SortPlayer(PlayerRecord)
    if (!PlayerRecord?.Name) {
      Send(Text('还没人挑战过金角大王'))
      return false
    }
    let CurrentQQ
    let TotalDamage = 0
    for (let i = 0; i < (PlayerList.length <= 20 ? PlayerList.length : 20); i++)
      TotalDamage += PlayerRecord.TotalDamage[PlayerList[i]]
    let msg = ['****金角大王周本贡献排行榜****']
    for (let i = 0; i < PlayerList.length; i++) {
      if (i < 20) {
        let Reward = Math.trunc(
          (PlayerRecord.TotalDamage[PlayerList[i]] / TotalDamage) *
            WorldBossStatusStr.Reward
        )
        Reward = Reward < 200000 ? 200000 : Reward
        msg.push(
          '第' +
            `${i + 1}` +
            '名:\n' +
            `名号:${PlayerRecord.Name[PlayerList[i]]}` +
            '\n' +
            `总伤害:${PlayerRecord.TotalDamage[PlayerList[i]]}` +
            `\n${
              WorldBossStatusStr.Health == 0 ? `已得到灵石` : `预计得到灵石`
            }:${Reward}`
        )
      }
      if (PlayerRecord.QQ[PlayerList[i]] == e.UserId) CurrentQQ = i + 1
    }
    // await ForwardMsg(e, msg)
    Send(Text(msg.join('\n')))

    await sleep(1000)
    if (CurrentQQ)
      Send(
        Text(
          `你在金角大王周本贡献排行榜中排名第${CurrentQQ}，造成伤害${
            PlayerRecord.TotalDamage[PlayerList[CurrentQQ - 1]]
          }，再接再厉！`
        )
      )
  } else Send(Text('金角大王未开启！'))
})
