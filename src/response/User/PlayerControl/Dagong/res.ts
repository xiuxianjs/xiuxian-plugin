import { Text, useSend } from 'alemonjs'

// 直接 redis.get 改为 helper
import { existplayer, readPlayer } from '@src/model'

import { selects } from '@src/response/index'
import { setDataByUserId } from '@src/model/Redis'
import { getString, getJSON, userKey } from '@src/model/utils/redisHelper'
import type { ActionState } from '@src/types/action'
export const regular = /^(#|＃|\/)?(降妖$)|(降妖(.*)(分|分钟)$)/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId //用户qq
  //有无存档
  if (!(await existplayer(usr_qq))) {
    return false
  }
  //获取游戏状态
  const game_action = await getString(userKey(usr_qq, 'game_action'))
  //防止继续其他娱乐行为
  if (game_action === '1') {
    Send(Text('修仙：游戏进行中...'))
    return false
  }
  //获取时间
  let timeStr = e.MessageText.replace(/^(#|＃|\/)?/, '')
  timeStr = timeStr.replace('降妖', '').replace('分', '').replace('钟', '')
  let time: number
  if (!Number.isNaN(parseInt(timeStr, 10))) {
    time = parseInt(timeStr, 10) //你选择的时间
    const y = 15 //固定时间
    const x = 48 //循环次数
    //如果是 >=16*33 ----   >=30
    for (let i = x; i > 0; i--) {
      if (time >= y * i) {
        time = y * i
        break
      }
    }
    //如果<30，修正。
    if (time < 15) {
      time = 15
    }
  } else {
    //不设置时间默认60分钟
    time = 30
  }

  const player = await readPlayer(usr_qq)
  if (player.当前血量 < 200) {
    Send(Text('你都伤成这样了,先去疗伤吧'))
    return false
  }
  //查询redis中的人物动作

  const action = await getJSON<ActionState>(userKey(usr_qq, 'action'))
  if (action != null) {
    //人物有动作查询动作结束时间
    const action_end_time = action.end_time
    const now_time = new Date().getTime()
    if (now_time <= action_end_time) {
      const m = Math.floor((action_end_time - now_time) / 1000 / 60)
      const s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000)
      Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'))
      return false
    }
  }
  const action_time = time * 60 * 1000 //持续时间，单位毫秒
  const arr = {
    action: '降妖', //动作
    end_time: new Date().getTime() + action_time, //结束时间
    time: action_time, //持续时间
    plant: '1', //采药-关闭
    shutup: '1', //闭关状态-关闭
    working: '0', //降妖状态-开启
    Place_action: '1', //秘境状态---关闭
    Place_actionplus: '1', //沉迷---关闭
    power_up: '1', //渡劫状态--关闭
    mojie: '1', //魔界状态---关闭
    xijie: '1', //洗劫状态开启
    mine: '1' //采矿-开启
  }
  await setDataByUserId(usr_qq, 'action', JSON.stringify(arr))
  Send(Text(`现在开始降妖${time}分钟`))
})
