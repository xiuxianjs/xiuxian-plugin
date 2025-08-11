import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import { sleep } from '@src/model/index'
import { BossIsAlive, SortPlayer } from '../../boss'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?金角大王贡献榜$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (await BossIsAlive()) {
    let PlayerRecord = await redis.get('xiuxian@1.3.0Record2')
    let WorldBossStatusStr = await redis.get('Xiuxian:WorldBossStatus2')
    WorldBossStatusStr = JSON.parse(WorldBossStatusStr)
    PlayerRecord = JSON.parse(PlayerRecord)
    const PlayerList = await SortPlayer(PlayerRecord)
    if (!PlayerRecord?.Name) {
      Send(Text('还没人挑战过金角大王'))
      return false
    }
    let CurrentQQ
    let TotalDamage = 0
    for (let i = 0; i < (PlayerList.length <= 20 ? PlayerList.length : 20); i++)
      TotalDamage += PlayerRecord.TotalDamage[PlayerList[i]]
    const msg = ['****金角大王周本贡献排行榜****']
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
