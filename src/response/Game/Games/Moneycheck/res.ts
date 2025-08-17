import { getRedisKey } from '@src/model/key'
import { Text, useMessage } from 'alemonjs'

import { redis } from '@src/model/api'
import { existplayer, readPlayer } from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?((梭哈)|(投入\d+))$/
import { game } from '../game'

export default onResponse(selects, async e => {
  const [message] = useMessage(e)

  const usr_qq = e.UserId
  //获取当前时间戳
  const now_time = Date.now()
  //文档
  const ifexistplay = await existplayer(usr_qq)
  //得到此人的状态
  //判断是否是投入用户
  const game_action = await redis.get(getRedisKey(usr_qq, 'game_action'))

  if (!ifexistplay || !game_action) {
    //不是就返回
    return false
  }

  //梭哈|投入999。如果是投入。就留下999
  const num = e.MessageText.replace(/#|＃|\/|梭哈|投入/g, '')
  //去掉投入，发现得到的是梭哈
  //梭哈，全部灵石
  if (e.MessageText.includes('梭哈')) {
    const player = await readPlayer(usr_qq)
    //得到投入金额
    game.yazhu[usr_qq] = player.灵石 - 1
    game.game_key_user[usr_qq] = true
    message.send(format(Text('媚娘：梭哈完成,发送[大|小|1-6]')))
    return false
  }

  if (parseInt(num) <= 0 || isNaN(parseInt(num))) {
    message.send(format(Text('媚娘：请输入正确的投入金额')))
    return false
  }

  const player = await readPlayer(usr_qq)
  //判断灵石
  if (player.灵石 >= parseInt(num)) {
    //得到投入数
    game.yazhu[usr_qq] = parseInt(num)
    //这里限制一下，至少押1w
    const money = 10000
    //如果投入的数大于0
    if (game.yazhu[usr_qq] >= money) {
      //如果押的钱不够
      //值未真。并记录此人信息
      game.game_key_user[usr_qq] = true
      message.send(format(Text('媚娘：投入完成,发送[大|小|1-6]')))
      return
    } else {
      //直接清除，并记录
      //重新记录本次时间
      await redis.set(getRedisKey(usr_qq, 'last_game_time'), now_time) //存入缓存
      //清除游戏状态
      await redis.del(getRedisKey(usr_qq, 'game_action'))
      //清除未投入判断
      //清除金额
      game.yazhu[usr_qq] = 0
      //清除游戏定时检测CD
      clearTimeout(game.game_time[usr_qq])
      message.send(format(Text('媚娘：钱不够也想玩？')))
      return
    }
  }
})
