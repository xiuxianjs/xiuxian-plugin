import { Text, useMessage, useSend } from 'alemonjs'

import { redis } from '@src/api/api'
import { existplayer, readPlayer } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?(梭哈)|(投入.*)$/
import '../game'

export default onResponse(selects, async e => {
  const [message] = useMessage(e)

  let usr_qq = e.UserId
  //获取当前时间戳
  let now_time = new Date().getTime()
  //文档
  let ifexistplay = await existplayer(usr_qq)
  //得到此人的状态
  //判断是否是投入用户
  let game_action: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':game_action'
  )

  if (!ifexistplay || !game_action) {
    //不是就返回
    return false
  }

  //梭哈|投入999。如果是投入。就留下999
  const num = e.MessageText.replace(/#|＃|\/|梭哈|投入/g, '')
  //去掉投入，发现得到的是梭哈
  //梭哈，全部灵石
  if (e.MessageText.includes('梭哈')) {
    let player = await readPlayer(usr_qq)
    //得到投入金额
    global.yazhu[usr_qq] = player.灵石 - 1
    global.gane_key_user[usr_qq] = true
    message.send(format(Text('媚娘：梭哈完成,发送[大]或[小]')))
    return false
  }

  //不是梭哈，看看是不是数字
  //判断是不是输了个数字，看看投入多少

  if (parseInt(num) == parseInt(num)) {
    let player = await readPlayer(usr_qq)
    //判断灵石
    if (player.灵石 >= parseInt(num)) {
      //得到投入数
      global.yazhu[usr_qq] = parseInt(num)
      //这里限制一下，至少押1w
      let money = 10000
      //如果投入的数大于0
      if (global.yazhu[usr_qq] >= money) {
        //如果押的钱不够
        //值未真。并记录此人信息
        global.gane_key_user[usr_qq] = true
        message.send(format(Text('媚娘：投入完成,发送[大]或[小]')))
        return
      } else {
        //直接清除，并记录
        //重新记录本次时间
        await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time) //存入缓存
        //清除游戏状态
        await redis.del('xiuxian@1.3.0:' + usr_qq + ':game_action')
        //清除未投入判断
        //清除金额
        global.yazhu[usr_qq] = 0
        //清除游戏定时检测CD
        clearTimeout(global.gametime[usr_qq])
        message.send(format(Text('媚娘：钱不够也想玩？')))
        return
      }
    }
  }
})
