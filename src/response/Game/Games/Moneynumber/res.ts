import { Text, useSend } from 'alemonjs'
import { config, data, redis } from '@src/model/api'
import { Go } from '@src/model/index'
import { selects } from '@src/response/index'
import { game } from '../game'

export const regular = /^(#|＃|\/)?金银坊$/
export default onResponse(selects, async e => {
  const Send = useSend(e)
  const cf = config.getConfig('xiuxian', 'xiuxian')
  //金银坊开关
  const gameswitch = cf.switch.Moneynumber
  if (gameswitch != true) return false
  const usr_qq = e.UserId
  const flag = await Go(e)
  if (!flag) return false
  //用户信息查询
  const player = await data.getData('player', usr_qq)
  const now_time = Date.now()
  const money = 10000
  //判断灵石
  if (player.灵石 < money) {
    //直接清除，并记录
    //重新记录本次时间
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time) //存入缓存
    //清除游戏状态
    await redis.del('xiuxian@1.3.0:' + usr_qq + ':game_action')
    //清除未投入判断
    //清除金额
    game.yazhu[usr_qq] = 0
    //清除游戏定时检测CD
    clearTimeout(game.game_time[usr_qq])
    Send(Text('媚娘：钱不够也想玩？'))
    return false
  }
  //
  let last_game_time = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':last_game_time'
  )
  last_game_time = parseInt(last_game_time)
  const transferTimeout = cf.CD.gambling * 1000 // 10秒CD

  if (now_time < last_game_time + transferTimeout) {
    const left = last_game_time + transferTimeout - now_time
    const game_s = Math.ceil(left / 1000) // 剩余秒数向上取整，体验更好
    Send(Text(`每30秒游玩一次。\ncd: ${game_s}秒`))
    //存在CD。直接返回
    return false
  }
  //记录本次执行时间
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time)
  //判断是否已经在进行
  const game_action = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':game_action'
  )
  //为0，就是在进行了
  if (game_action == 1) {
    //在进行
    Send(Text(`媚娘：猜大小正在进行哦!`))
    return false
  }
  //不为0   没有参与投入和梭哈
  Send(Text(`媚娘：发送[#投入+数字]或[#梭哈]`))
  //写入游戏状态为真-在进行了
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':game_action', 1)
  return false
})
