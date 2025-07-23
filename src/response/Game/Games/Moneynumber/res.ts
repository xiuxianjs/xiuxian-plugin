import { Text, useSend } from 'alemonjs'

import { config, data, redis } from '@src/api/api'
import { Go } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)金银坊$/
import '../game'

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const cf = config.getConfig('xiuxian', 'xiuxian')
  //金银坊开关
  let gameswitch = cf.switch.Moneynumber
  if (gameswitch != true) return false
  let usr_qq = e.UserId
  let flag = await Go(e)
  if (!flag) return false
  //用户信息查询
  let player = data.getData('player', usr_qq)
  let now_time = new Date().getTime()
  let money = 10000
  //判断灵石
  if (player.灵石 < money) {
    //直接清除，并记录
    //重新记录本次时间
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time) //存入缓存
    //清除游戏状态
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':game_action', 1)
    //清除未投入判断
    //清除金额
    global.yazhu[usr_qq] = 0
    //清除游戏定时检测CD
    clearTimeout(global.gametime[usr_qq])
    Send(Text('媚娘：钱不够也想玩？'))
    return false
  }
  //设置
  let time: any = cf.CD.gambling //
  //获取当前时间
  //最后的游戏时间
  //last_game_time
  //获得时间戳
  let last_game_time: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':last_game_time'
  )
  last_game_time = parseInt(last_game_time)
  let transferTimeout = Math.floor(60000 * time)
  if (now_time < last_game_time + transferTimeout) {
    let game_m = Math.trunc(
      (last_game_time + transferTimeout - now_time) / 60 / 1000
    )
    let game_s = Math.trunc(
      ((last_game_time + transferTimeout - now_time) % 60000) / 1000
    )
    Send(
      Text(
        `每${transferTimeout / 1000 / 60}分钟游玩一次。` +
          `cd: ${game_m}分${game_s}秒`
      )
    )
    //存在CD。直接返回
    return false
  }
  //记录本次执行时间
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time)
  //判断是否已经在进行
  let game_action: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':game_action'
  )
  //为0，就是在进行了
  if (game_action == 0) {
    //在进行
    Send(Text(`媚娘：猜大小正在进行哦!`))
    return false
  }
  //不为0   没有参与投入和梭哈
  Send(Text(`媚娘：发送[#投入+数字]或[#梭哈]`))
  //写入游戏状态为真-在进行了
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':game_action', 0)
  return false
})
