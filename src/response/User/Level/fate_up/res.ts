import { Text, useSend } from 'alemonjs'

import { dujie, LevelTask } from '@src/model/cultivation'
import { existplayer, readPlayer, writePlayer } from '@src/model/xiuxian_impl'
import { data } from '@src/model/api'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?渡劫$/
let dj = 0 // 同时仅允许一个玩家进行渡劫（简单内存锁）

// 常量配置
const MIN_HP_RATIO = 0.9
const BASE_N = 1380
const RANGE_P = 280
const STRIKE_DELAY_MS = 60_000 // 每道雷间隔 60s

function buildLinggenFactor(type: string): number {
  switch (type) {
    case '伪灵根':
      return 3
    case '真灵根':
      return 6
    case '天灵根':
      return 9
    case '体质':
      return 10
    case '转生':
    case '魔头':
      return 21
    case '转圣':
      return 26
    default:
      return 12
  }
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false

  const player = await readPlayer(usr_qq)
  if (!player) return false

  const levelInfo = data.Level_list.find(l => l.level_id === player.level_id)
  if (!levelInfo) {
    Send(Text('境界数据缺失'))
    return false
  }

  if (levelInfo.level !== '渡劫期') {
    Send(Text('你非渡劫期修士！'))
    return false
  }
  if (player.linggenshow === 1) {
    Send(Text('你灵根未开，不能渡劫！'))
    return false
  }
  if (player.power_place === 0) {
    Send(Text('你已度过雷劫，请感应仙门#登仙'))
    return false
  }

  const baseHpNeed = Number(levelInfo.基础血量) || 0
  if (Number(player.当前血量) < baseHpNeed * MIN_HP_RATIO) {
    player.当前血量 = 1
    await writePlayer(usr_qq, player)
    Send(Text(`${player.名号}血量亏损，强行渡劫后晕倒在地！`))
    return false
  }

  const needExp = levelInfo.exp
  if (player.修为 < needExp) {
    Send(Text(`修为不足,再积累${needExp - player.修为}修为后方可突破`))
    return false
  }

  // 计算雷抗系数
  const x = await dujie(usr_qq)
  const y = buildLinggenFactor(player.灵根.type)
  const n = BASE_N
  const p = RANGE_P

  if (x <= n) {
    player.当前血量 = 0
    player.修为 -= Math.floor(needExp / 4)
    if (player.修为 < 0) player.修为 = 0
    await writePlayer(usr_qq, player)
    Send(Text('天空一声巨响，未降下雷劫，就被天道的气势震死了。'))
    return false
  }

  if (dj > 0) {
    Send(Text('已经有人在渡劫了,建议打死他'))
    return false
  }
  dj++

  // 成功率计算
  const denominator = p + y * 0.1
  const lRatio = denominator > 0 ? ((x - n) / denominator) * 100 : 0
  const percent = lRatio.toFixed(2)

  Send(Text('天道：就你，也敢逆天改命？'))
  Send(
    Text(
      `【${player.名号}】\n雷抗：${x}\n成功率：${percent}%\n灵根：${player.灵根.type}\n需渡${y}道雷劫\n将在1分钟后落下\n[温馨提示]\n请把其他渡劫期打死后再渡劫！`
    )
  )

  let strikeIndex = 1
  let active = true

  const doStrike = async () => {
    if (!active) return
    const stillPlayer = await readPlayer(usr_qq)
    if (!stillPlayer) {
      release('玩家数据缺失')
      return
    }
    // 若玩家死亡/非渡劫期/已登仙则终止
    if (stillPlayer.当前血量 <= 0 || stillPlayer.power_place === 0) {
      release('状态结束')
      return
    }

    const publicEvent = e as import('alemonjs').EventsMessageCreateEnum
    const cont = await LevelTask(publicEvent, n, n + p, y, strikeIndex)
    strikeIndex++
    if (!cont || strikeIndex > y) {
      release('流程结束')
      return
    }
    setTimeout(doStrike, STRIKE_DELAY_MS)
  }

  const release = (_reason: string) => {
    if (!active) return
    active = false
    dj = 0
    // 可选调试: console.debug('渡劫结束:', usr_qq, reason)
  }

  setTimeout(doStrike, STRIKE_DELAY_MS)
  return false
})
