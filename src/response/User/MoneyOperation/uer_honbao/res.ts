import { Text, useMention, useSend } from 'alemonjs'

import { data, redis, config } from '@src/model/api'
import { existplayer, addCoin } from '@src/model/index'

import { selects } from '@src/response/mw'
import { getRedisKey } from '@src/model/keys'
export const regular = /^(#|＃|\/)?抢红包$/

interface MentionUser {
  UserId: string
  IsBot?: boolean
}

function toInt(v, d = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : d
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false

  // 读取玩家（仅用于名字展示）
  const player = await data.getData('player', usr_qq)

  const now = Date.now()
  const lastKey = getRedisKey(usr_qq, 'last_getbung_time')
  const lastStr = await redis.get(lastKey)
  const lastTime = toInt(lastStr)
  const cf = (await config.getConfig('xiuxian', 'xiuxian')) || {}
  const cdMinutes = toInt(cf?.CD?.honbao, 1)
  const cdMs = cdMinutes * 60000
  if (now < lastTime + cdMs) {
    const remain = lastTime + cdMs - now
    const m = Math.trunc(remain / 60000)
    const s = Math.trunc((remain % 60000) / 1000)
    Send(Text(`每${cdMinutes}分钟抢一次，正在CD中，剩余cd: ${m}分${s}秒`))
    return false
  }

  // 提及对象
  const [mention] = useMention(e)
  const found = await mention.find({ IsBot: false })
  const list = (found && found.data) || []
  const target: MentionUser | undefined = list.find(u => !u.IsBot)
  if (!target) return false
  const honbao_qq = target.UserId
  if (honbao_qq === usr_qq) {
    Send(Text('不能抢自己的红包'))
    return false
  }
  if (!(await existplayer(honbao_qq))) return false

  // 使用原子操作检查并扣减红包数量
  const countKey = getRedisKey(honbao_qq, 'honbaoacount')
  const remainingCount = await redis.decr(countKey)
  
  // 如果扣减后小于0，说明红包已经被抢完
  if (remainingCount < 0) {
    // 恢复计数器（因为我们多扣了一次）
    await redis.incr(countKey)
    Send(Text('他的红包被光啦！'))
    return false
  }

  // 单个红包金额
  const valueKey = getRedisKey(honbao_qq, 'honbao')
  const valStr = await redis.get(valueKey)
  const lingshi = toInt(valStr)
  if (lingshi <= 0) {
    Send(Text('这个红包里居然是空的...'))
    // 设置CD时间（防刷机制）
    await redis.set(lastKey, now)
    return false
  }

  // 结算：增加用户灵石并设置CD
  await addCoin(usr_qq, lingshi)
  await redis.set(lastKey, now)

  Send(
    Text(`【全服公告】${player.名号 || usr_qq}抢到一个${lingshi}灵石的红包！`)
  )
  return false
})
