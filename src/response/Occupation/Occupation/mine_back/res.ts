import { redis } from '@src/model/api'
import { getPlayerAction } from '@src/model/index'
import { mine_jiesuan } from '../../api'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?结束采矿$/

export default onResponse(selects, async e => {
  const action: any = await getPlayerAction(e.UserId)
  if (action.action == '空闲') return

  if (action.mine == 1) return false
  //结算
  const end_time = action.end_time
  const start_time = action.end_time - action.time
  const now_time = new Date().getTime()
  let time
  const y = 30 //时间
  const x = 24 //循环次数
  if (end_time > now_time) {
    //属于提前结束
    time = Math.floor((new Date().getTime() - start_time) / 1000 / 60)

    //超过就按最低的算，即为满足30分钟才结算一次
    //如果是 >=16*33 ----   >=30
    for (let i = x; i > 0; i--) {
      if (time >= y * i) {
        time = y * i
        break
      }
    }
    //如果<15，不给收益
    if (time < y) {
      time = 0
    }
  } else {
    //属于结束了未结算
    time = Math.floor(action.time / 1000 / 60)
    //超过就按最低的算，即为满足30分钟才结算一次
    //如果是 >=16*33 ----   >=30
    for (let i = x; i > 0; i--) {
      if (time >= y * i) {
        time = y * i
        break
      }
    }
    //如果<15，不给收益
    if (time < y) {
      time = 0
    }
  }

  if (e.name === 'message.create') {
    await mine_jiesuan(e.UserId, time, e.ChannelId) //提前闭关结束不会触发随机事件
  } else {
    await mine_jiesuan(e.UserId, time) //提前闭关结束不会触发随机事件
  }

  const arr: any = action
  arr.is_jiesuan = 1 //结算状态
  arr.mine = 1 //采药状态
  arr.plant = 1 //采药状态
  arr.shutup = 1 //闭关状态
  arr.working = 1 //降妖状态
  arr.power_up = 1 //渡劫状态
  arr.Place_action = 1 //秘境
  //结束的时间也修改为当前时间
  arr.end_time = new Date().getTime()
  delete arr.group_id //结算完去除group_id
  await redis.set('xiuxian@1.3.0:' + e.UserId + ':action', JSON.stringify(arr))
})
