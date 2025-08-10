import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import { existplayer, readPlayer, addCoin } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?(采矿$)|(采矿(.*)(分|分钟)$)/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId //用户qq
  if (!(await existplayer(usr_qq))) return false
  //获取游戏状态
  const game_action: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':game_action'
  )
  //防止继续其他娱乐行为
  if (game_action == 1) {
    Send(Text('修仙：游戏进行中...'))
    return false
  }
  const player = await readPlayer(usr_qq)
  if (player.occupation != '采矿师') {
    Send(Text('你挖矿许可证呢？非法挖矿，罚款200灵石'))
    await addCoin(usr_qq, -200)
    return false
  }
  //获取时间
  let time: any = e.MessageText.replace(/^(#|＃|\/)?采矿/, '')
  time = time.replace('分钟', '')
  if (parseInt(time) == parseInt(time)) {
    time = parseInt(time)
    const y = 30 //时间
    const x = 24 //循环次数
    //如果是 >=16*33 ----   >=30
    for (let i = x; i > 0; i--) {
      if (time >= y * i) {
        time = y * i
        break
      }
    }
    //如果<30，修正。
    if (time < 30) {
      time = 30
    }
  } else {
    //不设置时间默认30分钟
    time = 30
  }
  //查询redis中的人物动作
  let action: any = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action')
  action = JSON.parse(action)
  if (action != null) {
    //人物有动作查询动作结束时间
    const action_end_time = action.end_time
    const now_time = new Date().getTime()
    if (now_time <= action_end_time) {
      const m = Math.floor((action_end_time - now_time) / 1000 / 60)
      const s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000)
      Send(Text('正在' + action.action + '中，剩余时间:' + m + '分' + s + '秒'))
      return false
    }
  }

  const action_time = time * 60 * 1000 //持续时间，单位毫秒
  const arr: any = {
    action: '采矿', //动作
    end_time: new Date().getTime() + action_time, //结束时间
    time: action_time, //持续时间
    plant: '1', //采药-开启
    mine: '0', //采药-开启
    shutup: '1', //闭关状态-开启
    working: '1', //降妖状态-关闭
    Place_action: '1', //秘境状态---关闭
    Place_actionplus: '1', //沉迷---关闭
    power_up: '1', //渡劫状态--关闭
    mojie: '1', //魔界状态---关闭
    xijie: '1' //洗劫状态开启
  }
  if (e.name === 'message.create') {
    arr.group_id = e.ChannelId
  }

  await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr)) //redis设置动作
  Send(Text(`现在开始采矿${time}分钟`))
})
