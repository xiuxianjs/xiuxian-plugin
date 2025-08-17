import { getRedisKey } from '@src/model/key'
import { Text, useMention, useSend } from 'alemonjs'

import { redis, data, config } from '@src/model/api'
import { notUndAndNull } from '@src/model/common'
import { zdBattle } from '@src/model/battle'
import { addHP, addExp2, addCoin } from '@src/model/economy'
import { existNajieThing } from '@src/model/najie'
import { existplayer, readPlayer } from '@src/model/xiuxian_impl'
import type { Player } from '@src/types/player'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?比武$/

interface ActionState {
  end_time?: number
  action?: string
}

function toInt(v, d = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : d
}
function parseJson<T>(raw, fallback: T): T {
  if (typeof raw !== 'string' || raw === '') return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}
function formatRemain(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${m}分${s}秒`
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const A = e.UserId
  if (!(await existplayer(A))) return false

  // 猜大小占用检查
  const last_game_timeA = await redis.get(getRedisKey(A, 'last_game_time'))
  if (toInt(last_game_timeA) === 0) {
    Send(Text('猜大小正在进行哦!'))
    return false
  }

  // 目标 @
  const [mention] = useMention(e)
  const found = await mention.find({ IsBot: false })
  const user = found?.data?.find(u => !u.IsBot)
  if (!user) return false
  const B = user.UserId
  if (A === B) {
    Send(Text('咋的，自娱自乐？'))
    return false
  }

  if (!(await existplayer(B))) {
    Send(Text('不可对凡人出手!'))
    return false
  }

  // 读取双方玩家
  const A_player = (await readPlayer(A)) as Player
  const B_player = (await readPlayer(B)) as Player
  if (!A_player || !B_player) return false

  // 境界校验
  if (!notUndAndNull(A_player.level_id) || !notUndAndNull(B_player.level_id)) {
    Send(Text('请先#同步信息 / 对方为错误存档'))
    return false
  }

  // 忙碌状态检查
  const A_action = parseJson<ActionState | null>(
    await redis.get(getRedisKey(A, 'action')),
    null
  )
  if (A_action && A_action.end_time && Date.now() <= A_action.end_time) {
    Send(
      Text(
        `正在${A_action.action}中,剩余时间:${formatRemain(A_action.end_time - Date.now())}`
      )
    )
    return false
  }
  const B_action = parseJson<ActionState | null>(
    await redis.get(getRedisKey(B, 'action')),
    null
  )
  if (B_action && B_action.end_time && Date.now() <= B_action.end_time) {
    const hasHide = await existNajieThing(A, '剑xx', '道具')
    if (!hasHide) {
      Send(
        Text(
          `对方正在${B_action.action}中,剩余时间:${formatRemain(B_action.end_time - Date.now())}`
        )
      )
      return false
    }
  }

  // 猜大小状态检查 (对方)
  const last_game_timeB = await redis.get(getRedisKey(B, 'last_game_time'))
  if (toInt(last_game_timeB) === 0) {
    Send(Text('对方猜大小正在进行哦，等他结束再来比武吧!'))
    return false
  }

  const cf = await config.getConfig('xiuxian', 'xiuxian')
  const biwuCdMs = Math.floor(60000 * toInt(cf?.CD?.biwu, 5))
  const now = Date.now()
  const lastBiwuA = toInt(await redis.get(getRedisKey(A, 'last_biwu_time')))
  if (now < lastBiwuA + biwuCdMs) {
    Send(
      Text(`比武正在CD中，剩余cd:  ${formatRemain(lastBiwuA + biwuCdMs - now)}`)
    )
    return false
  }

  // 双修冷却(复用 couple 配置)
  const coupleMs = Math.floor(60000 * toInt(cf?.CD?.couple, 0))
  if (coupleMs > 0) {
    const lastA = lastBiwuA // 与比武 CD 存同 key
    if (now < lastA + coupleMs) {
      Send(Text(`比武冷却:  ${formatRemain(lastA + coupleMs - now)}`))
      return false
    }
    const lastB = toInt(await redis.get(getRedisKey(B, 'last_biwu_time')))
    if (now < lastB + coupleMs) {
      Send(Text(`对方比武冷却:  ${formatRemain(lastB + coupleMs - now)}`))
      return false
    }
  }

  // 血量必须接近满 (使用 5/6 ≈ 83%)
  const hpThreshold = 5 / 6
  if (B_player.当前血量 <= B_player.血量上限 * hpThreshold) {
    Send(Text(`${B_player.名号} 血量未满，不能趁人之危哦`))
    return false
  }
  if (A_player.当前血量 <= A_player.血量上限 * hpThreshold) {
    Send(Text('你血量未满，对方不想趁人之危'))
    return false
  }

  // 记录开始时间
  await redis.set(getRedisKey(A, 'last_biwu_time'), String(now))
  await redis.set(getRedisKey(B, 'last_biwu_time'), String(now))

  const final_msg: string[] = []
  final_msg.push(`${A_player.名号}向${B_player.名号}发起了比武！`)

  A_player.法球倍率 = Number(A_player.灵根.法球倍率) || 0
  B_player.法球倍率 = Number(B_player.灵根.法球倍率) || 0

  const Data_battle = await zdBattle(A_player, B_player)
  const msg = Data_battle.msg
  if (msg.length <= 35) {
    Send(Text(msg.join('\n')))
  }
  await addHP(A, Data_battle.A_xue)
  await addHP(B, Data_battle.B_xue)

  const A_win = `${A_player.名号}击败了${B_player.名号}`
  const B_win = `${B_player.名号}击败了${A_player.名号}`
  const aWin = msg.includes(A_win)
  const bWin = msg.includes(B_win)
  if (!aWin && !bWin) {
    Send(Text('战斗过程出错'))
    return false
  }

  const levelA =
    data.Level_list.find(l => l.level_id == A_player.level_id)?.level_id || 1
  const levelB =
    data.Level_list.find(l => l.level_id == B_player.level_id)?.level_id || 1

  if (aWin) {
    const qixueA = Math.trunc(1000 * levelB)
    const qixueB = Math.trunc(500 * levelA)
    const coin = Math.trunc(10 * levelA)
    await addExp2(A, qixueA)
    await addExp2(B, qixueB)
    await addCoin(A, coin)
    await addCoin(B, coin)
    const pA = await readPlayer(A)
    if (pA) {
      pA.魔道值 = (Number(pA.魔道值) || 0) + 1
      await import('@src/model/xiuxian_impl').then(m =>
        m.writePlayer(A, pA as Player)
      )
    }
    final_msg.push(
      ` 经过一番大战,${A_win}获得了胜利,${A_player.名号}获得${qixueA}气血，${B_player.名号}获得${qixueB}气血，双方都获得了${coin}的灵石。`
    )
  } else if (bWin) {
    const qixueA = Math.trunc(500 * levelB)
    const qixueB = Math.trunc(1000 * levelA)
    const coin = Math.trunc(10 * levelA)
    await addExp2(A, qixueA)
    await addExp2(B, qixueB)
    await addCoin(A, coin)
    await addCoin(B, coin)
    const pB = await readPlayer(B)
    if (pB) {
      pB.魔道值 = (Number(pB.魔道值) || 0) + 1
      await import('@src/model/xiuxian_impl').then(m =>
        m.writePlayer(B, pB as Player)
      )
    }
    final_msg.push(
      `经过一番大战,${B_win}获得了胜利,${B_player.名号}获得${qixueB}气血，${A_player.名号}获得${qixueA}气血，双方都获得了${coin}的灵石。`
    )
  }

  Send(Text(final_msg.join('')))
  return false
})
