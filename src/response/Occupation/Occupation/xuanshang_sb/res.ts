import { Text, useSend } from 'alemonjs'

import { pushInfo, redis } from '@src/model/api'
import {
  existplayer,
  readPlayer,
  convert2integer,
  writePlayer
} from '@src/model/index'

import { selects } from '@src/response/index'
import { getRedisKey } from '@src/model/key'
import { KEY_AUCTION_GROUP_LIST } from '@src/model/constants'
export const regular = /^(#|＃|\/)?悬赏.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)

  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) {
    return false
  }

  const player = await readPlayer(usr_qq)
  if (!player) {
    Send(Text('玩家数据读取失败'))
    return false
  }
  const rest = e.MessageText.replace(/^(#|＃|\/)?悬赏/, '').trim()
  if (!rest) {
    Send(Text('格式: 悬赏qq号*金额 (例:#悬赏123456*300000)'))
    return false
  }
  const code = rest.split('*')
  const targetQQ = code[0].trim()
  if (!/^\d{5,}$/.test(targetQQ)) {
    Send(Text('目标QQ格式不正确'))
    return false
  }
  let money = await convert2integer(code[1])
  if (!Number.isFinite(money)) money = 0
  const MIN_BOUNTY = 300000
  if (money < MIN_BOUNTY) money = MIN_BOUNTY
  if (money > 1000000000) money = 1000000000

  if ((player.灵石 || 0) < money) {
    Send(Text('您手头这点灵石,似乎在说笑'))
    return false
  }

  if (!(await existplayer(targetQQ))) {
    Send(Text('世间没有这人'))
    return false
  }
  const player_B = await readPlayer(targetQQ)
  if (!player_B) {
    Send(Text('查询目标玩家数据失败'))
    return false
  }

  const bountyRecord = { 名号: player_B.名号, QQ: targetQQ, 赏金: money }
  // todo
  const actionKey = getRedisKey('1', 'shangjing')
  const raw = await redis.get(actionKey)
  let list: Array<{ 名号: string; QQ: string; 赏金: number }> = []
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed))
        list = parsed.filter(v => v && typeof v === 'object')
    } catch {
      list = []
    }
  }
  list.push(bountyRecord)

  player.灵石 = (player.灵石 || 0) - money
  await writePlayer(usr_qq, player)
  await redis.set(actionKey, JSON.stringify(list))

  Send(Text('悬赏成功!'))
  const msg = `【全服公告】${player_B.名号}被悬赏了${money}灵石`
  const redisGlKey = KEY_AUCTION_GROUP_LIST
  const groupList = await redis.smembers(redisGlKey)
  for (const group of groupList) {
    pushInfo(group, true, msg)
  }
  return false
})
