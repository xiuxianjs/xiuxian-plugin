import { Image, Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import {
  existplayer,
  shijianc,
  existNajieThing,
  addNajieThing,
  zdBattle,
  addCoin
} from '@src/model/index'
import {
  readTiandibang,
  Write_tiandibang,
  getLastbisai,
  TiandibangRow
} from '../tian'

import { selects } from '@src/response/index'
import { screenshot } from '@src/image'
export const regular = /^(#|＃|\/)?比试$/

// === 类型与工具 ===
type RankEntry = TiandibangRow
interface ActionState {
  action: string
  end_time: number
}
interface BattlePlayer {
  名号: string
  攻击: number
  防御: number
  当前血量: number
  暴击率: number
  学习的功法: any[]
  灵根: { 法球倍率?: number; name?: string; type?: string } & Record<
    string,
    unknown
  >
  法球倍率?: number
  [k: string]: any
}
const toNum = (v, d = 0) =>
  typeof v === 'number' && !isNaN(v)
    ? v
    : typeof v === 'string' && !isNaN(+v)
      ? +v
      : d
import { getRedisKey } from '@src/model/key'
const randomScale = () => 0.8 + 0.4 * Math.random()
function buildBattlePlayer(
  src: RankEntry,
  atkMul = 1,
  defMul = 1,
  hpMul = 1
): BattlePlayer {
  const lgRaw = src.灵根
  const linggenObj = lgRaw && typeof lgRaw === 'object' ? lgRaw : {}
  const linggen = linggenObj as {
    法球倍率?: number
    name?: string
    type?: string
  } & Record<string, unknown>
  return {
    名号: src.名号,
    攻击: Math.floor(toNum(src.攻击) * atkMul),
    防御: Math.floor(toNum(src.防御) * defMul),
    当前血量: Math.floor(toNum(src.当前血量) * hpMul),
    暴击率: toNum(src.暴击率),
    学习的功法: Array.isArray(src.学习的功法) ? src.学习的功法 : [],
    灵根: linggen,
    法球倍率:
      typeof src.法球倍率 === 'number' ? src.法球倍率 : toNum(src.法球倍率)
  }
}
function settleWin(
  self: RankEntry,
  isWild: boolean,
  lastMsg: string[],
  opponentName: string,
  win: boolean
) {
  // wild: k == -1
  if (win) {
    self.积分 += isWild ? 1500 : 2000
  } else {
    self.积分 += isWild ? 800 : 1000
  }
  self.次数 -= 1
  const lingshi = self.积分 * (isWild ? (win ? 8 : 6) : win ? 4 : 2)
  lastMsg.push(
    win
      ? `${self.名号}击败了[${opponentName}],当前积分[${self.积分}],获得了[${lingshi}]灵石`
      : `${self.名号}被[${opponentName}]打败了,当前积分[${self.积分}],获得了[${lingshi}]灵石`
  )
  return lingshi
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  //获取游戏状态
  const game_action = await redis.get(getRedisKey(usr_qq, 'game_action'))
  //防止继续其他娱乐行为
  if (+game_action == 1) {
    Send(Text('修仙：游戏进行中...'))
    return false
  }
  //查询redis中的人物动作
  let action: ActionState | null = null
  const actionStr = await redis.get(getRedisKey(usr_qq, 'action'))
  if (actionStr) {
    try {
      action = JSON.parse(actionStr)
    } catch {}
  }
  if (action) {
    //人物有动作查询动作结束时间
    const action_end_time = action.end_time
    const now_time = Date.now()
    if (now_time <= action_end_time) {
      const m = Math.floor((action_end_time - now_time) / 1000 / 60)
      const s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000)
      Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'))
      return false
    }
  }
  let tiandibang: RankEntry[] = []
  try {
    tiandibang = await readTiandibang()
  } catch {
    //没有表要先建立一个！
    await Write_tiandibang([])
  }
  const x = tiandibang.findIndex(item => String(item.qq) === usr_qq)
  if (x === -1) {
    Send(Text('请先报名!'))
    return
  }
  const last_msg: string[] = []
  let atk = 1
  let def = 1
  let blood = 1
  const now = new Date()
  const nowTime = now.getTime() //获取当前日期的时间戳
  const Today = await shijianc(nowTime)
  const lastbisai_time = await getLastbisai(usr_qq) //获得上次签到日期
  if (!lastbisai_time) {
    await redis.set(getRedisKey(usr_qq, 'lastbisai_time'), nowTime) //redis设置签到时间
    tiandibang[x].次数 = 3
  }
  if (
    lastbisai_time &&
    (Today.Y != lastbisai_time.Y ||
      Today.M != lastbisai_time.M ||
      Today.D != lastbisai_time.D)
  ) {
    await redis.set(getRedisKey(usr_qq, 'lastbisai_time'), nowTime) //redis设置签到时间
    tiandibang[x].次数 = 3
  }
  if (
    lastbisai_time &&
    Today.Y == lastbisai_time.Y &&
    Today.M == lastbisai_time.M &&
    Today.D == lastbisai_time.D &&
    tiandibang[x].次数 < 1
  ) {
    const zbl = await existNajieThing(usr_qq, '摘榜令', '道具')
    if (typeof zbl === 'number' && zbl > 0) {
      tiandibang[x].次数 = 1
      await addNajieThing(usr_qq, '摘榜令', '道具', -1)
      last_msg.push(`${tiandibang[x].名号}使用了摘榜令\n`)
    } else {
      Send(Text('今日挑战次数用光了,请明日再来吧'))
      return false
    }
  }
  await Write_tiandibang(tiandibang)
  let lingshi = 0
  tiandibang = await readTiandibang()
  if (x != 0) {
    let k
    for (k = x - 1; k >= 0; k--) {
      if (tiandibang[x].境界 > 41) break
      else {
        if (tiandibang[k].境界 > 41) {
          continue
        } else break
      }
    }
    let B_player: BattlePlayer
    if (k != -1) {
      if (tiandibang[k].攻击 / tiandibang[x].攻击 > 2) {
        atk = 2
        def = 2
        blood = 2
      } else if (tiandibang[k].攻击 / tiandibang[x].攻击 > 1.6) {
        atk = 1.6
        def = 1.6
        blood = 1.6
      } else if (tiandibang[k].攻击 / tiandibang[x].攻击 > 1.3) {
        atk = 1.3
        def = 1.3
        blood = 1.3
      }
      B_player = buildBattlePlayer(tiandibang[k])
    }
    const A_player = buildBattlePlayer(tiandibang[x], atk, def, blood)
    if (k == -1) {
      atk = randomScale()
      def = randomScale()
      blood = randomScale()
      B_player = buildBattlePlayer(tiandibang[x], atk, def, blood)
      B_player.名号 = '灵修兽'
    }
    const Data_battle = await zdBattle(A_player, B_player)
    const msg: string[] = Data_battle.msg || []
    const A_win = `${A_player.名号}击败了${B_player.名号}`
    const B_win = `${B_player.名号}击败了${A_player.名号}`
    if (msg.includes(A_win)) {
      lingshi = settleWin(tiandibang[x], k == -1, last_msg, B_player.名号, true)
      await Write_tiandibang(tiandibang as TiandibangRow[])
    } else if (msg.includes(B_win)) {
      lingshi = settleWin(
        tiandibang[x],
        k == -1,
        last_msg,
        B_player.名号,
        false
      )
      await Write_tiandibang(tiandibang as TiandibangRow[])
    } else {
      Send(Text(`战斗过程出错`))
      return false
    }
    await addCoin(usr_qq, lingshi)
    Send(Text(last_msg.join('\n')))
    const img = await screenshot('CombatResult', ``, {
      msg: msg,
      playerA: {
        id: A_player.qq,
        name: A_player.名号,
        power: A_player.攻击,
        hp: A_player.当前血量,
        maxHp: A_player.血量上限
      },
      playerB: {
        id: B_player.qq,
        name: B_player.名号,
        power: B_player.攻击,
        hp: B_player.当前血量,
        maxHp: B_player.血量上限
      },
      result: msg.includes(A_win) ? 'A' : msg.includes(B_win) ? 'B' : 'draw'
    })
    if (Buffer.isBuffer(img)) {
      Send(Image(img))
    }
  } else {
    const A_player = buildBattlePlayer(tiandibang[x])
    atk = randomScale()
    def = randomScale()
    blood = randomScale()
    const B_player = buildBattlePlayer(tiandibang[x], atk, def, blood)
    B_player.名号 = '灵修兽'
    const Data_battle = await zdBattle(A_player, B_player)
    const msg: string[] = Data_battle.msg || []
    const A_win = `${A_player.名号}击败了${B_player.名号}`
    const B_win = `${B_player.名号}击败了${A_player.名号}`
    if (msg.includes(A_win)) {
      lingshi = settleWin(tiandibang[x], true, last_msg, B_player.名号, true)
      await Write_tiandibang(tiandibang as TiandibangRow[])
    } else if (msg.includes(B_win)) {
      lingshi = settleWin(tiandibang[x], true, last_msg, B_player.名号, false)
      await Write_tiandibang(tiandibang as TiandibangRow[])
    } else {
      Send(Text(`战斗过程出错`))
      return false
    }
    await addCoin(usr_qq, lingshi)
    Send(Text(last_msg.join('\n')))
    const img = await screenshot('CombatResult', ``, {
      msg: msg,
      playerA: {
        id: A_player.qq,
        name: A_player.名号,
        power: A_player.攻击,
        hp: A_player.当前血量,
        maxHp: A_player.血量上限
      },
      playerB: {
        id: B_player.qq,
        name: B_player.名号,
        power: B_player.攻击,
        hp: B_player.当前血量,
        maxHp: B_player.血量上限
      },
      result: msg.includes(A_win) ? 'A' : msg.includes(B_win) ? 'B' : 'draw'
    })
    if (Buffer.isBuffer(img)) {
      Send(Image(img))
    }
  }
  tiandibang = await readTiandibang()
  tiandibang.sort((a, b) => b.积分 - a.积分)
  await Write_tiandibang(tiandibang as TiandibangRow[])
})
