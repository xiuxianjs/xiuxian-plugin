import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import { Boss2IsAlive, InitWorldBoss, LookUpWorldBossStatus } from '../../boss'

export const selects = onSelects(['message.create'])
export const regular = /^(#|＃|\/)?金角大王状态$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (await Boss2IsAlive()) {
    let WorldBossStatusStr: any = await redis.get('Xiuxian:WorldBossStatus2')
    if (WorldBossStatusStr) {
      WorldBossStatusStr = JSON.parse(WorldBossStatusStr)
      if (new Date().getTime() - WorldBossStatusStr.KilledTime < 86400000) {
        Send(Text(`金角大王正在刷新,20点开启`))
        return false
      } else if (WorldBossStatusStr.KilledTime != -1) {
        if ((await InitWorldBoss()) == false) await LookUpWorldBossStatus(e)
        return false
      }
      const ReplyMsg = [
        `----金角大王状态----\n攻击:????????????\n防御:????????????\n血量:${WorldBossStatusStr.Health}\n奖励:${WorldBossStatusStr.Reward}`
      ]
      Send(Text(ReplyMsg.join('\n')))
    }
  } else Send(Text('金角大王未开启！'))
})
