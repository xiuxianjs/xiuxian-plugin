import { config, data, pushInfo, redis } from '@src/api/api'
import { getPlayerAction, isNotNull, setFileValue } from '@src/model'

import { selects } from '@src/response/index'
import { Mention } from 'alemonjs'
export const regular = /^(#|＃|\/)?降妖归来$/

export default onResponse(selects, async e => {
  let action: any = await getPlayerAction(e.UserId)
  if (action.action == '空闲') return
  if (action.working == 1) return false
  //结算
  let end_time = action.end_time
  let start_time = action.end_time - action.time
  let now_time = new Date().getTime()
  let time
  const cf = config.getConfig('xiuxian', 'xiuxian')
  let y = cf.work.time //固定时间
  let x = cf.work.cycle //循环次数

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
  if (e.name === 'message.create' || e.name === 'interaction.create') {
    await dagong_jiesuan(e.UserId, time, false, e.group_id) //提前闭关结束不会触发随机事件
  } else {
    await dagong_jiesuan(e.UserId, time, false) //提前闭关结束不会触发随机事件
  }

  let arr = action
  arr.is_jiesuan = 1 //结算状态
  arr.shutup = 1 //闭关状态
  arr.working = 1 //降妖状态
  arr.power_up = 1 //渡劫状态
  arr.Place_action = 1 //秘境
  //结束的时间也修改为当前时间
  arr.end_time = new Date().getTime()
  delete arr.group_id //结算完去除group_id
  await redis.set('xiuxian@1.3.0:' + e.UserId + ':action', JSON.stringify(arr))
})

/**
 * 降妖结算
 * @param usr_qq
 * @param time持续时间(单位用分钟)
 * @param is_random是否触发随机事件  true,false
 * @param group_id  回复消息的地址，如果为空，则私聊
 * @return  falses {Promise<void>}
 */
async function dagong_jiesuan(user_id, time, is_random, group_id?) {
  let usr_qq = user_id
  let player = data.getData('player', usr_qq)
  let now_level_id
  if (!isNotNull(player.level_id)) {
    return false
  }
  now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  const cf = config.getConfig('xiuxian', 'xiuxian')
  let size = cf.work.size
  let lingshi = Math.floor(
    size * now_level_id * (1 + player.修炼效率提升) * 0.5
  )
  let other_lingshi = 0 //额外的灵石
  let Time = time
  let msg: any[] = [Mention(usr_qq)]
  if (is_random) {
    //随机事件预留空间
    let rand = Math.random()
    if (rand < 0.2) {
      rand = Math.trunc(rand * 10) + 40
      other_lingshi = rand * Time
      msg.push('\n本次增加灵石' + rand * Time)
    } else if (rand > 0.8) {
      rand = Math.trunc(rand * 10) + 5
      other_lingshi = -1 * rand * Time
      msg.push(
        '\n由于你的疏忽,货物被人顺手牵羊,老板大发雷霆,灵石减少' + rand * Time
      )
    }
  }
  let get_lingshi = Math.trunc(lingshi * time + other_lingshi * 1.5) //最后获取到的灵石

  //设置灵石
  await setFileValue(usr_qq, get_lingshi, '灵石')

  //给出消息提示
  if (is_random) {
    msg.push('\n增加灵石' + get_lingshi)
  } else {
    msg.push('\n增加灵石' + get_lingshi)
  }

  if (group_id) {
    await pushInfo('', group_id, true, msg)
  } else {
    await pushInfo('', usr_qq, false, msg)
  }

  return false
}
