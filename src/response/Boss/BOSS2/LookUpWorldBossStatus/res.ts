import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import { Boss2IsAlive, InitWorldBoss, LookUpWorldBossStatus } from '../../boss'

export const selects = onSelects(['message.create'])
export const regular = /^(#|＃|\/)?金角大王状态$/

interface WorldBossStatusInfo {
  Health: number
  Reward: number
  KilledTime: number
}
function parseJson<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== 'string' || raw === '') return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}
function formatNum(n: unknown) {
  const v = Number(n)
  return Number.isFinite(v) ? v.toLocaleString('zh-CN') : '0'
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!(await Boss2IsAlive())) {
    Send(Text('金角大王未开启！'))
    return false
  }

  const statusStr = await redis.get('Xiuxian:WorldBossStatus2')
  const status = parseJson<WorldBossStatusInfo | null>(statusStr, null)
  if (!status) {
    Send(Text('状态数据缺失，请联系管理员重新开启！'))
    return false
  }

  const now = Date.now()
  // 24h 内为刷新冷却期
  if (now - status.KilledTime < 86400000) {
    Send(Text('金角大王正在刷新,20点开启'))
    return false
  }
  // 如果已被击杀但冷却结束需要初始化
  if (status.KilledTime !== -1) {
    if ((await InitWorldBoss()) === false) await LookUpWorldBossStatus(e)
    return false
  }

  const reply = `----金角大王状态----\n攻击:????????????\n防御:????????????\n血量:${formatNum(status.Health)}\n奖励:${formatNum(status.Reward)}`
  Send(Text(reply))
  return false
})
