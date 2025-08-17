import { Text, useSend } from 'alemonjs'
import * as _ from 'lodash-es'
import {
  Boss2IsAlive,
  InitWorldBoss2,
  SetWorldBOSSBattleUnLockTimer,
  SortPlayer,
  WorldBossBattle,
  WorldBossBattleInfo
} from '../../boss'
import { redis, data, pushInfo } from '@src/model/api'
import { zdBattle, Harm } from '@src/model/battle'
import { sleep } from '@src/model/common'
import { addHP, addCoin } from '@src/model/economy'

import { selects } from '@src/response/index'
import { existplayer } from '@src/model'
import { getRedisKey } from '@src/model/key'
import { KEY_RECORD_TWO, KEY_WORLD_BOOS_STATUS_TWO } from '@src/model/settions'
export const regular = /^(#|＃|\/)?讨伐金角大王$/

interface PlayerRecordData {
  QQ: string[]
  TotalDamage: number[]
  Name: string[]
}
interface WorldBossStatusInfo {
  Health: number
  Healthmax: number
  Reward: number
  KilledTime: number
}
interface ActionState {
  end_time?: number
  action?: string
}

function parseJson<T>(raw, fallback: T): T {
  if (typeof raw !== 'string' || raw === '') return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}
function toInt(v, d = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : d
}

export default onResponse(selects, async e => {
  const Send = useSend(e)

  const user_qq = e.UserId //用户qq
  //有无存档
  if (!(await existplayer(user_qq))) return false

  if (!(await Boss2IsAlive())) {
    Send(Text('金角大王未开启！'))
    return false
  }
  const usr_qq = e.UserId
  const now = Date.now()
  const fightCdMs = 5 * 60000
  const lastTimeRaw = await redis.get(getRedisKey(usr_qq, 'BOSSCD'))
  const lastTime = toInt(lastTimeRaw)
  if (now < lastTime + fightCdMs) {
    const remain = lastTime + fightCdMs - now
    const m = Math.trunc(remain / 60000)
    const s = Math.trunc((remain % 60000) / 1000)
    Send(Text(`正在CD中，剩余cd:  ${m}分 ${s}秒`))
    return false
  }

  if (!(await data.existData('player', usr_qq))) {
    Send(Text('区区凡人，也想参与此等战斗中吗？'))
    return false
  }
  const player = await data.getData('player', usr_qq)
  // 限制：22~41 且 未轮回 (推测原逻辑)
  if (player.level_id > 41 || player.lunhui > 0) {
    Send(Text('仙人不得下凡'))
    return false
  }
  if (player.level_id < 22) {
    Send(Text('修为至少达到化神初期才能参与挑战'))
    return false
  }

  const actionRaw = await redis.get(getRedisKey(usr_qq, 'action'))
  const action = parseJson<ActionState | null>(actionRaw, null)
  if (action && action.end_time && Date.now() <= action.end_time) {
    const remain = action.end_time - Date.now()
    const m = Math.floor(remain / 60000)
    const s = Math.floor((remain % 60000) / 1000)
    Send(Text(`正在${action.action}中,剩余时间:${m}分${s}秒`))
    return false
  }
  if (player.当前血量 <= player.血量上限 * 0.1) {
    Send(Text('还是先疗伤吧，别急着参战了'))
    return false
  }
  if (WorldBossBattleInfo.CD[usr_qq]) {
    const seconds = Math.trunc(
      (300000 - (Date.now() - WorldBossBattleInfo.CD[usr_qq])) / 1000
    )
    if (seconds <= 300 && seconds >= 0) {
      Send(
        Text(`刚刚一战消耗了太多气力，还是先歇息一会儿吧~(剩余${seconds}秒)`)
      )
      return false
    }
  }

  const statusStr = await redis.get(KEY_WORLD_BOOS_STATUS_TWO)
  const recordStr = await redis.get(KEY_RECORD_TWO)
  const WorldBossStatus = parseJson<WorldBossStatusInfo | null>(statusStr, null)
  if (!WorldBossStatus) {
    Send(Text('状态数据缺失, 请联系管理员重新开启!'))
    return false
  }
  if (Date.now() - WorldBossStatus.KilledTime < 86400000) {
    Send(Text('金角大王正在刷新,20点开启'))
    return false
  } else if (WorldBossStatus.KilledTime !== -1) {
    if ((await InitWorldBoss2()) === false) await WorldBossBattle(e)
    return false
  }

  // 玩家伤害记录
  let PlayerRecordJSON: PlayerRecordData
  let userIdx = 0
  if (!recordStr || recordStr === '0') {
    PlayerRecordJSON = { QQ: [usr_qq], TotalDamage: [0], Name: [player.名号] }
  } else {
    PlayerRecordJSON = parseJson<PlayerRecordData>(recordStr, {
      QQ: [],
      TotalDamage: [],
      Name: []
    })
    userIdx = PlayerRecordJSON.QQ.indexOf(usr_qq)
    if (userIdx === -1) {
      PlayerRecordJSON.QQ.push(usr_qq)
      PlayerRecordJSON.Name.push(player.名号)
      PlayerRecordJSON.TotalDamage.push(0)
      userIdx = PlayerRecordJSON.QQ.length - 1
    }
  }

  // Boss 幻影（统一命名）
  const bossName = '金角大王幻影'
  const Boss = {
    名号: bossName,
    攻击: Math.floor(player.攻击 * (0.8 + 0.4 * Math.random())),
    防御: Math.floor(player.防御 * (0.8 + 0.4 * Math.random())),
    当前血量: Math.floor(player.血量上限 * (0.8 + 0.4 * Math.random())),
    暴击率: player.暴击率,
    灵根: player.灵根,
    法球倍率: player.灵根.法球倍率
  }
  player.法球倍率 = player.灵根.法球倍率

  if (WorldBossBattleInfo.UnLockTimer) {
    clearTimeout(WorldBossBattleInfo.UnLockTimer)
    WorldBossBattleInfo.setUnLockTimer(null)
  }
  SetWorldBOSSBattleUnLockTimer(e)
  if (WorldBossBattleInfo.Lock !== 0) {
    Send(
      Text('好像有人正在和金角大王激战，现在去怕是有未知的凶险，还是等等吧！')
    )
    return false
  }
  WorldBossBattleInfo.setLock(1)

  const Data_battle = await zdBattle(player, Boss)
  const msg = Data_battle.msg
  const A_win = `${player.名号}击败了${Boss.名号}`
  const B_win = `${Boss.名号}击败了${player.名号}`
  if (msg.length <= 60) {
    Send(Text(msg.join('\n')))
  } else {
    const shortMsg = _.cloneDeep(msg)
    shortMsg.length = 60
    Send(Text(shortMsg.join('\n')))
    Send(Text('战斗过长，仅展示部分内容'))
  }
  await sleep(1000)

  if (!WorldBossStatus.Healthmax) {
    Send(Text('请联系管理员重新开启!'))
    WorldBossBattleInfo.setLock(0)
    return false
  }

  let dealt = 0
  const playerWin = msg.includes(A_win)
  const bossWin = msg.includes(B_win)
  if (playerWin) {
    dealt = Math.trunc(
      WorldBossStatus.Healthmax * 0.06 +
        Harm(player.攻击 * 0.85, Boss.防御) * 10
    )
    WorldBossStatus.Health -= dealt
    Send(
      Text(`${player.名号}击败了[${Boss.名号}],重创[金角大王],造成伤害${dealt}`)
    )
  } else if (bossWin) {
    dealt = Math.trunc(
      WorldBossStatus.Healthmax * 0.04 + Harm(player.攻击 * 0.85, Boss.防御) * 6
    )
    WorldBossStatus.Health -= dealt
    Send(
      Text(
        `${player.名号}被[${Boss.名号}]击败了,只对[金角大王]造成了${dealt}伤害`
      )
    )
  }
  await addHP(usr_qq, Data_battle.A_xue)
  await sleep(1000)
  const random = Math.random()
  if (random < 0.05 && playerWin) {
    Send(Text('这场战斗重创了[金角大王]，金角大王使用了古典秘籍,血量回复了10%'))
    WorldBossStatus.Health += Math.trunc(WorldBossStatus.Healthmax * 0.1)
  } else if (random > 0.95 && bossWin) {
    const extra = Math.trunc(WorldBossStatus.Health * 0.15)
    dealt += extra
    WorldBossStatus.Health -= extra
    Send(
      Text(
        `危及时刻,万先盟-韩立前来助阵,对[金角大王]造成${extra}伤害,并治愈了你的伤势`
      )
    )
    await addHP(usr_qq, player.血量上限)
  }

  await sleep(1000)
  PlayerRecordJSON.TotalDamage[userIdx] += dealt
  await redis.set(KEY_RECORD_TWO, JSON.stringify(PlayerRecordJSON))
  await redis.set(KEY_WORLD_BOOS_STATUS_TWO, JSON.stringify(WorldBossStatus))

  if (WorldBossStatus.Health <= 0) {
    Send(Text('金角大王被击杀！玩家们可以根据贡献获得奖励！'))
    await sleep(1000)
    const killMsg = `【全服公告】${player.名号}亲手结果了金角大王的性命,为民除害,额外获得500000灵石奖励！`
    const glKey = 'xiuxian:AuctionofficialTask_GroupList'
    const groups = await redis.smembers(glKey)
    for (const g of groups) {
      await pushInfo(g, true, killMsg)
    }
    await addCoin(usr_qq, 500000)
    logger.info(`[金角大王] 结算:${usr_qq}增加奖励500000`)

    WorldBossStatus.KilledTime = Date.now()
    await redis.set(KEY_WORLD_BOOS_STATUS_TWO, JSON.stringify(WorldBossStatus))

    const PlayerList = await SortPlayer(PlayerRecordJSON)
    Send(
      Text(
        '正在进行存档有效性检测，如果长时间没有回复请联系主人修复存档并手动按照贡献榜发放奖励'
      )
    )

    for (const idx of PlayerList) {
      await data.getData('player', PlayerRecordJSON.QQ[idx])
    }

    const showMax = Math.min(PlayerList.length, 20)
    let topSum = 0
    for (let i = 0; i < showMax; i++)
      topSum += PlayerRecordJSON.TotalDamage[PlayerList[i]]
    if (topSum <= 0) topSum = showMax

    const Rewardmsg: string[] = ['****金角大王周本贡献排行榜****']
    for (let i = 0; i < PlayerList.length; i++) {
      const idx = PlayerList[i]
      const qq = PlayerRecordJSON.QQ[idx]
      const cur = await data.getData('player', qq)
      if (i < showMax) {
        let reward = Math.trunc(
          (PlayerRecordJSON.TotalDamage[idx] / topSum) * WorldBossStatus.Reward
        )
        if (!Number.isFinite(reward) || reward < 200000) reward = 200000
        Rewardmsg.push(
          `第${i + 1}名:\n名号:${cur.名号}\n伤害:${PlayerRecordJSON.TotalDamage[idx]}\n获得灵石奖励${reward}`
        )
        cur.灵石 += reward
        data.setData('player', qq, cur)
        logger.info(`[金角大王周本] 结算:${qq}增加奖励${reward}`)
      } else {
        cur.灵石 += 200000
        data.setData('player', qq, cur)
        logger.info(`[金角大王周本] 结算:${qq}增加奖励200000`)
        if (i === PlayerList.length - 1)
          Rewardmsg.push('其余参与的修仙者均获得200000灵石奖励！')
      }
    }
    Send(Text(Rewardmsg.join('\n')))
  }

  WorldBossBattleInfo.setCD(usr_qq, Date.now())
  WorldBossBattleInfo.setLock(0)
  return false
})
