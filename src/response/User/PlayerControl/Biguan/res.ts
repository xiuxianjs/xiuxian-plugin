import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { redis } from 'api/api'
import { existplayer } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)(闭关$)|(闭关(.*)(分|分钟)$)/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false
  let game_action: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':game_action'
  )
  //防止继续其他娱乐行为
  if (game_action == 0) {
    Send(Text('修仙：游戏进行中...'))
    return false
  }

  //获取时间
  let time: any = e.MessageText.replace('#', '')
  time = time.replace('闭关', '')
  time = time.replace('分', '')
  time = time.replace('钟', '')
  if (parseInt(time) == parseInt(time)) {
    time = parseInt(time)
    let y = 30 //时间
    let x = 240 //循环次数
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
    //不设置时间默认60分钟
    time = 30
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

  let action_time = time * 60 * 1000 //持续时间，单位毫秒
  let arr = {
    action: '闭关', //动作
    end_time: new Date().getTime() + action_time, //结束时间
    time: action_time, //持续时间
    plant: '1', //采药-关闭
    shutup: '0', //闭关状态-开启
    working: '1', //降妖状态-关闭
    Place_action: '1', //秘境状态---关闭
    Place_actionplus: '1', //沉迷---关闭
    power_up: '1', //渡劫状态--关闭
    mojie: '1', //魔界状态---关闭
    xijie: '1', //洗劫状态开启
    mine: '1' //采矿-开启
  }

  await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr)) //redis设置动作
  Send(Text(`现在开始闭关${time}分钟,两耳不闻窗外事了`))
})
