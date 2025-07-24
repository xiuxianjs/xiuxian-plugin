import { config, data, pushInfo, redis } from '@src/api/api'
import {
  player_efficiency,
  isNotNull,
  Read_danyao,
  exist_najie_thing,
  Add_najie_thing,
  Add_修为,
  Add_血气,
  setFileValue,
  Write_danyao
} from '@src/model'

import { selects } from '@src/response/index'
import { DataMention, Mention } from 'alemonjs'
export const regular = /^(#|＃|\/)?出关$/

export default onResponse(selects, async e => {
  let action: any = await getPlayerAction(e.UserId)
  if (action.shutup == 1) return false

  //结算
  let end_time = action.end_time
  let start_time = action.end_time - action.time
  let now_time = new Date().getTime()
  let time

  const cf = config.getConfig('xiuxian', 'xiuxian')

  let y = cf.biguan.time //固定时间
  let x = cf.biguan.cycle //循环次数

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
    if (time < y) {
      time = 0
    }
  }

  if (e.isGroup) {
    await biguan_jiesuan(e.UserId, time, false, e.group_id) //提前闭关结束不会触发随机事件
  } else {
    await biguan_jiesuan(e.UserId, time, false) //提前闭关结束不会触发随机事件
  }
  let arr = action
  //把状态都关了
  arr.shutup = 1 //闭关状态
  arr.working = 1 //降妖状态
  arr.power_up = 1 //渡劫状态
  arr.Place_action = 1 //秘境
  arr.end_time = new Date().getTime() //结束的时间也修改为当前时间
  delete arr.group_id //结算完去除group_id

  await redis.set('xiuxian@1.3.0:' + e.UserId + ':action', JSON.stringify(arr))
})
async function getPlayerAction(usr_qq) {
  let action: any = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action')
  action = JSON.parse(action) //转为json格式数据
  return action
}
/**
 * 闭关结算
 * @param usr_qq
 * @param time持续时间(单位用分钟)
 * @param is_random是否触发随机事件  true,false
 * @param group_id  回复消息的地址，如果为空，则私聊
 * @return  falses {Promise<void>}
 */
async function biguan_jiesuan(user_id, time, is_random, group_id?) {
  let usr_qq = user_id
  await player_efficiency(usr_qq)
  let player = data.getData('player', usr_qq)
  let now_level_id
  if (!isNotNull(player.level_id)) {
    return false
  }
  now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  //闭关收益倍率计算 倍率*境界id*天赋*时间
  const cf = config.getConfig('xiuxian', 'xiuxian')
  let size = cf.biguan.size
  //增加的修为
  let xiuwei = Math.floor(size * now_level_id * (player.修炼效率提升 + 1))
  //恢复的血量
  let blood = Math.floor(player.血量上限 * 0.02)
  //额外修为
  let other_xiuwei = 0

  let msg: Array<DataMention | string> = [Mention(usr_qq)]
  //炼丹师丹药修正
  let transformation = '修为'
  let xueqi = 0
  let dy = await Read_danyao(usr_qq)
  if (dy.biguan > 0) {
    dy.biguan--
    if (dy.biguan == 0) {
      dy.biguanxl = 0
    }
  }
  if (dy.lianti > 0) {
    transformation = '血气'
    dy.lianti--
  }
  //随机事件预留空间
  if (is_random) {
    let rand = Math.random()
    //顿悟
    if (rand < 0.2) {
      rand = Math.trunc(rand * 10) + 45
      other_xiuwei = rand * time
      xueqi = Math.trunc(rand * time * dy.beiyong4)
      if (transformation == '血气') {
        msg.push('\n本次闭关顿悟,受到炼神之力修正,额外增加血气:' + xueqi)
      } else {
        msg.push('\n本次闭关顿悟,额外增加修为:' + rand * time)
      }
    }
    //走火入魔
    else if (rand > 0.8) {
      rand = Math.trunc(rand * 10) + 5
      other_xiuwei = -1 * rand * time
      xueqi = Math.trunc(rand * time * dy.beiyong4)
      if (transformation == '血气') {
        msg.push(
          '\n,由于你闭关时隔壁装修,导致你差点走火入魔,受到炼神之力修正,血气下降' +
            xueqi
        )
      } else {
        msg.push(
          '\n由于你闭关时隔壁装修,导致你差点走火入魔,修为下降' + rand * time
        )
      }
    }
  }
  let other_x = 0
  let qixue = 0
  if (
    (await exist_najie_thing(usr_qq, '魔界秘宝', '道具')) &&
    player.魔道值 > 999
  ) {
    other_x = Math.trunc(xiuwei * 0.15 * time)
    await Add_najie_thing(usr_qq, '魔界秘宝', '道具', -1)
    msg.push('\n消耗了道具[魔界秘宝],额外增加' + other_x + '修为')
    await Add_修为(usr_qq, other_x)
  }
  if (
    (await exist_najie_thing(usr_qq, '神界秘宝', '道具')) &&
    player.魔道值 < 1 &&
    (player.灵根.type == '转生' || player.level_id > 41)
  ) {
    qixue = Math.trunc(xiuwei * 0.1 * time)
    await Add_najie_thing(usr_qq, '神界秘宝', '道具', -1)
    msg.push('\n消耗了道具[神界秘宝],额外增加' + qixue + '血气')
    await Add_血气(usr_qq, qixue)
  }
  //设置修为，设置血量

  await setFileValue(usr_qq, blood * time, '当前血量')

  //给出消息提示
  if (transformation == '血气') {
    await setFileValue(
      usr_qq,
      (xiuwei * time + other_xiuwei) * dy.beiyong4,
      transformation
    ) //丹药修正
    msg.push(
      '\n受到炼神之力的影响,增加血气:' + xiuwei * time * dy.beiyong4,
      '  获得治疗,血量增加:' + blood * time
    )
  } else {
    await setFileValue(usr_qq, xiuwei * time + other_xiuwei, transformation)
    if (is_random) {
      msg.push(
        '\n增加气血:' + xiuwei * time,
        '  获得治疗,血量增加:' + blood * time + '炼神之力消散了'
      )
    } else {
      msg.push(
        '\n增加修为:' + xiuwei * time,
        '  获得治疗,血量增加:' + blood * time
      )
    }
  }

  if (group_id) {
    await pushInfo('', group_id, true, msg)
  } else {
    await pushInfo('', usr_qq, false, msg)
  }
  if (dy.lianti <= 0) {
    dy.lianti = 0
    dy.beiyong4 = 0
  }
  //炼丹师修正结束
  await Write_danyao(usr_qq, dy)
  return false
}
