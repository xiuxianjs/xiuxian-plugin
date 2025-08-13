import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import { existplayer, sleep } from '@src/model/index'
import { BossIsAlive, SortPlayer } from '../../boss'

export const selects = onSelects(['message.create'])
export const regular = /^(#|＃|\/)?妖王贡献榜$/

interface WorldBossStatus {
  Reward?: number
  Health?: number
  [k: string]: any
}
interface PlayerRecordData {
  QQ: Array<string | number>
  TotalDamage: number[]
  Name: string[]
  [k: string]: any
}

function parseJson<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export default onResponse(selects, async e => {
  const Send = useSend(e)

  const user_qq = e.UserId //用户qq
  //有无存档
  if (!(await existplayer(user_qq))) return false
  if (!(await BossIsAlive())) {
    Send(Text('妖王未开启！'))
    return false
  }
  const PlayerRecord = parseJson<PlayerRecordData>(
    await redis.get('xiuxian@1.3.0Record')
  )
  const WorldBossStatusStr = parseJson<WorldBossStatus>(
    await redis.get('Xiuxian:WorldBossStatus')
  )
  if (!PlayerRecord || !Array.isArray(PlayerRecord.Name)) {
    Send(Text('还没人挑战过妖王'))
    return false
  }
  const PlayerList = await SortPlayer(PlayerRecord)
  if (!Array.isArray(PlayerList) || PlayerList.length === 0) {
    Send(Text('还没人挑战过妖王'))
    return false
  }
  let TotalDamage = 0
  const limit = Math.min(PlayerList.length, 20)
  for (let i = 0; i < limit; i++) {
    const idx = PlayerList[i]
    TotalDamage += PlayerRecord.TotalDamage[idx] || 0
  }
  if (TotalDamage <= 0) TotalDamage = 1 // 防止除 0
  const rewardBase = WorldBossStatusStr?.Reward || 0
  const bossDead = (WorldBossStatusStr?.Health || 0) === 0
  const msg: string[] = ['****妖王周本贡献排行榜****']
  let CurrentQQ: number | undefined
  for (let i = 0; i < PlayerList.length && i < 20; i++) {
    const idx = PlayerList[i]
    const dmg = PlayerRecord.TotalDamage[idx] || 0
    let Reward = Math.trunc((dmg / TotalDamage) * rewardBase)
    if (Reward < 200000) Reward = 200000
    msg.push(
      `第${i + 1}名:` +
        `\n名号:${PlayerRecord.Name[idx]}` +
        `\n总伤害:${dmg}` +
        `\n${bossDead ? '已得到灵石' : '预计得到灵石'}:${Reward}`
    )
    if (PlayerRecord.QQ[idx] == e.UserId) CurrentQQ = i + 1
  }
  Send(Text(msg.join('\n')))
  await sleep(1000)
  if (CurrentQQ) {
    const idx = PlayerList[CurrentQQ - 1]
    Send(
      Text(
        `你在妖王周本贡献排行榜中排名第${CurrentQQ}，造成伤害${PlayerRecord.TotalDamage[idx] || 0}，再接再厉！`
      )
    )
  }
  return false
})
