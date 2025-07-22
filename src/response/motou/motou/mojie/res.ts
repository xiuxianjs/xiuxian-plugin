import { Text, useSend } from 'alemonjs'

import { redis } from '@src/api/api'
import { existplayer, Read_player, Write_player } from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)堕入魔界$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //查看存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let game_action: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':game_action'
  )
  //防止继续其他娱乐行为
  if (game_action == 0) {
    Send(Text('修仙：游戏进行中...'))
    return false
  }
  //查询redis中的人物动作
  let action: any = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action')
  action = JSON.parse(action)
  if (action != null) {
    //人物有动作查询动作结束时间
    let action_end_time = action.end_time
    let now_time = new Date().getTime()
    if (now_time <= action_end_time) {
      let m = Math.floor((action_end_time - now_time) / 1000 / 60)
      let s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000)
      Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'))
      return false
    }
  }
  let player = await Read_player(usr_qq)
  if (player.魔道值 < 1000) {
    Send(Text('你不是魔头'))
    return false
  }
  if (player.修为 < 4000000) {
    Send(Text('修为不足'))
    return false
  }
  player.魔道值 -= 100
  player.修为 -= 4000000
  await Write_player(usr_qq, player)
  let time: any = 60 //时间（分钟）
  let action_time = 60000 * time //持续时间，单位毫秒
  let arr = {
    action: '魔界', //动作
    end_time: new Date().getTime() + action_time, //结束时间
    time: action_time, //持续时间
    shutup: '1', //闭关
    working: '1', //降妖
    Place_action: '1', //秘境状态---关闭
    mojie: '0', //魔界状态---关闭
    Place_actionplus: '1', //沉迷秘境状态---关闭
    power_up: '1', //渡劫状态--关闭
    xijie: '1', //洗劫状态开启
    plant: '1', //采药-开启
    mine: '1', //采矿-开启
    cishu: '10'
  }
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr))
  Send(Text('开始进入魔界,' + time + '分钟后归来!'))
})
