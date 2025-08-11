import { Text, useMention, useSend } from 'alemonjs'

import { existplayer, readPlayer, zdBattle } from '@src/model/index'
import type { Player } from '@src/types'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?以武会友$/

function isPlayer(v: unknown): v is Player {
  return !!v && typeof v === 'object' && '名号' in v && '血量上限' in v
}

function extractFaQiu(lg: unknown): number | undefined {
  if (!lg || typeof lg !== 'object') return undefined
  const o = lg as Record<string, unknown>
  const v = o.法球倍率
  return typeof v === 'number' ? v : undefined
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const A = e.UserId
  if (!(await existplayer(A))) return false

  const mentionsApi = useMention(e)[0]
  const Mentions = (await mentionsApi.find({ IsBot: false })).data
  if (!Mentions || Mentions.length === 0) return false
  const target = Mentions.find(item => !item.IsBot)
  if (!target) return false
  const B = target.UserId

  if (A === B) {
    Send(Text('你还跟自己修炼上了是不是?'))
    return false
  }
  if (!(await existplayer(B))) {
    Send(Text('修仙者不可对凡人出手!'))
    return false
  }

  let A_player: Player
  let B_player: Player
  try {
    A_player = await readPlayer(A)
    B_player = await readPlayer(B)
  } catch (_err) {
    Send(Text('读取玩家数据失败'))
    return false
  }
  if (!isPlayer(A_player) || !isPlayer(B_player)) {
    Send(Text('玩家数据异常'))
    return false
  }

  // 复制（避免副作用）
  const a = { ...A_player }
  const b = { ...B_player }
  if (a.灵根) {
    const v = extractFaQiu(a.灵根)
    if (v !== undefined) a.法球倍率 = v
  }
  if (b.灵根) {
    const v = extractFaQiu(b.灵根)
    if (v !== undefined) b.法球倍率 = v
  }
  a.当前血量 = a.血量上限
  b.当前血量 = b.血量上限

  try {
    const Data_battle = await zdBattle(a, b)
    const battleMsg = Array.isArray(Data_battle.msg)
      ? Data_battle.msg.join('\n')
      : '战斗结束'
    const header = `${A_player.名号}向${B_player.名号}发起了切磋。\n`
    Send(Text(header + battleMsg))
  } catch (_err) {
    Send(Text('战斗过程出现异常'))
  }
  return false
})
