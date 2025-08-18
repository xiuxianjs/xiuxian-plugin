import { Image, Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import { existplayer } from '@src/model/index'
import { BossIsAlive, SortPlayer } from '../../boss'
import { KEY_RECORD } from '@src/model/constants'
import { screenshot } from '@src/image'

export const selects = onSelects(['message.create'])
export const regular = /^(#|＃|\/)?妖王贡献榜$/

interface WorldBossStatus {
  Reward?: number
  Health?: number
}
interface PlayerRecordData {
  QQ: Array<string | number>
  TotalDamage: number[]
  Name: string[]
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
  const PlayerRecord = parseJson<PlayerRecordData>(await redis.get(KEY_RECORD))
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
  let CurrentQQ: number | undefined
  const temp = []
  for (let i = 0; i < PlayerList.length && i < 20; i++) {
    const idx = PlayerList[i]
    const dmg = PlayerRecord.TotalDamage[idx] || 0
    let Reward = Math.trunc((dmg / TotalDamage) * rewardBase)
    if (Reward < 200000) Reward = 200000
    // msg.push(
    //   `第${i + 1}名:` +
    //     `\n名号:${PlayerRecord.Name[idx]}` +
    //     `\n总伤害:${dmg}` +
    //     `\n${bossDead ? '已得到灵石' : '预计得到灵石'}:${Reward}`
    // )
    temp[i] = {
      power: dmg,
      qq: PlayerRecord.QQ[idx],
      name: PlayerRecord.Name[idx],
      sub: [
        {
          label: bossDead ? '已得到灵石' : '预计得到灵石',
          value: Reward
        }
      ],
      level_id: 0
    }
    if (PlayerRecord.QQ[idx] == e.UserId) CurrentQQ = i + 1
  }
  if (CurrentQQ) {
    const idx = PlayerList[CurrentQQ - 1]
    Send(
      Text(
        `你在妖王周本贡献排行榜中排名第${CurrentQQ}，造成伤害${PlayerRecord.TotalDamage[idx] || 0}，再接再厉！`
      )
    )
  }

  // 生成截图
  const image = await screenshot('immortal_genius', user_qq, {
    allplayer: temp,
    title: '妖王贡献榜',
    label: '上海'
  })

  if (Buffer.isBuffer(image)) {
    Send(Image(image))
    return
  }

  Send(Text('图片生产失败'))

  return false
})
