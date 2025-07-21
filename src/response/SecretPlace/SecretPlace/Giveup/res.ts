import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { redis } from 'api/api'
import { existplayer } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)逃离/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) {
    Send(Text('没存档你逃个锤子!'))
    return false
  }
  //获取游戏状态
  let game_action: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':game_action'
  )
  //防止继续其他娱乐行为
  if (+game_action == 0) {
    Send(Text('修仙：游戏进行中...'))
    return false
  }
  //查询redis中的人物动作
  let action: any = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action')
  action = JSON.parse(action)
  //不为空，有状态
  if (action != null) {
    //是在秘境状态
    if (
      action.Place_action == '0' ||
      action.Place_actionplus == '0' ||
      action.mojie == '0'
    ) {
      //把状态都关了
      let arr = action
      arr.is_jiesuan = 1 //结算状态
      arr.shutup = 1 //闭关状态
      arr.working = 1 //降妖状态
      arr.power_up = 1 //渡劫状态
      arr.Place_action = 1 //秘境
      arr.Place_actionplus = 1 //沉迷状态
      arr.mojie = 1
      arr.end_time = new Date().getTime() //结束的时间也修改为当前时间
      delete arr.group_id //结算完去除group_id
      await redis.set(
        'xiuxian@1.3.0:' + usr_qq + ':action',
        JSON.stringify(arr)
      )
      Send(Text('你已逃离！'))
      return false
    }
  }
})
