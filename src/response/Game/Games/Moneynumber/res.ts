import { Text, useSend } from 'alemonjs'
import { config, redis } from '@src/model/api'
import { Go, existplayer, readPlayer } from '@src/model/index'
import { selects } from '@src/response/index'
import { game } from '../game'

export const regular = /^(#|＃|\/)?金银坊$/
export default onResponse(selects, async e => {
  const Send = useSend(e)

  const usr_qq = e.UserId
  // 基础进入校验
  if (!(await existplayer(usr_qq))) {
    return false
  }

  const cf = config.getConfig('xiuxian', 'xiuxian')
  const gameswitch = cf?.switch?.Moneynumber
  if (gameswitch !== true) return false

  const flag = await Go(e)
  if (!flag) return false

  // 玩家数据
  const player = await readPlayer(usr_qq)
  if (!player) {
    Send(Text('玩家数据读取失败'))
    return false
  }

  const toInt = (v, d = 0) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : d
  }

  const BASE_COST = 10000 // 进入最低灵石
  const playerCoin = toInt(player.灵石)

  // 灵石不足处理，清理游戏状态
  if (playerCoin < BASE_COST) {
    const now_time = Date.now()
    await redis.set(`xiuxian@1.3.0:${usr_qq}:last_game_time`, now_time)
    await redis.del(`xiuxian@1.3.0:${usr_qq}:game_action`)
    game.yazhu[usr_qq] = 0
    if (game.game_time[usr_qq]) clearTimeout(game.game_time[usr_qq])
    Send(Text('媚娘：钱不够也想玩？'))
    return false
  }

  const now_time = Date.now()
  const last_game_time_raw = await redis.get(
    `xiuxian@1.3.0:${usr_qq}:last_game_time`
  )
  let last_game_time = Number(last_game_time_raw)
  if (!Number.isFinite(last_game_time)) last_game_time = 0

  const transferTimeout = toInt(cf?.CD?.gambling, 30) * 1000 // 默认30s
  if (now_time < last_game_time + transferTimeout) {
    const left = last_game_time + transferTimeout - now_time
    const game_s = Math.ceil(left / 1000)
    Send(Text(`每${transferTimeout / 1000}秒游玩一次。\ncd: ${game_s}秒`))
    return false
  }

  // 记录本次时间
  await redis.set(`xiuxian@1.3.0:${usr_qq}:last_game_time`, now_time)

  const game_action = await redis.get(`xiuxian@1.3.0:${usr_qq}:game_action`)
  if (Number(game_action) === 1) {
    Send(Text('媚娘：猜大小正在进行哦!'))
    return false
  }

  Send(Text('媚娘：发送[#投入+数字]或[#梭哈]'))
  await redis.set(`xiuxian@1.3.0:${usr_qq}:game_action`, 1)
  return false
})
