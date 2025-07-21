import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { redis } from '@src/api/api'
import { existplayer, Read_player } from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)(梭哈)|(投入.*)$/
import '../game'

export default onResponse(selects, async e => {
  const Send = useSend(e)
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
  if (!ifexistplay || +game_action == 1) {
    //不是就返回
    return false
  }
  //梭哈|投入999。如果是投入。就留下999
  let es = e.MessageText.replace('#投入', '').trim()
  //去掉投入，发现得到的是梭哈
  //梭哈，全部灵石
  if (es == '#梭哈') {
    let player = await Read_player(usr_qq)
    //得到投入金额
    global.yazhu[usr_qq] = player.灵石 - 1
    Send(Text('媚娘：梭哈完成,发送[大]或[小]'))
    return false
  }
  //不是梭哈，看看是不是数字
  //判断是不是输了个数字，看看投入多少
  if (parseInt(es) == parseInt(es)) {
    let player = await Read_player(usr_qq)
    //判断灵石
    if (player.灵石 >= parseInt(es)) {
      //得到投入数
      global.yazhu[usr_qq] = parseInt(es)
      //这里限制一下，至少押1w
      let money = 10000
      //如果投入的数大于0
      if (global.yazhu[usr_qq] >= money) {
        //如果押的钱不够
        //值未真。并记录此人信息
        global.gane_key_user[usr_qq]
        Send(Text('媚娘：投入完成,发送[大]或[小]'))
        return false
      } else {
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
    }
  }
})
