import { Text, useSend } from 'alemonjs'

import { redis, data } from '@src/api/api'
import {
  existplayer,
  shijianc,
  Read_shop,
  Write_shop,
  Read_player,
  Write_player
} from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)洗劫.*$/

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
  let now_time = new Date().getTime()
  if (action != null) {
    //人物有动作查询动作结束时间
    let action_end_time = action.end_time
    if (now_time <= action_end_time) {
      let m = Math.floor((action_end_time - now_time) / 1000 / 60)
      let s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000)
      Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'))
      return false
    }
  }
  let lastxijie_time: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':lastxijie_time'
  )
  lastxijie_time = parseInt(lastxijie_time)
  if (now_time < lastxijie_time + 7200000) {
    let lastxijie_m = Math.trunc(
      (lastxijie_time + 7200000 - now_time) / 60 / 1000
    )
    let lastxijie_s = Math.trunc(
      ((lastxijie_time + 7200000 - now_time) % 60000) / 1000
    )
    Send(
      Text(
        `每120分钟洗劫一次，正在CD中，` +
          `剩余cd: ${lastxijie_m}分${lastxijie_s}秒`
      )
    )
    return false
  }
  //判断是否在开启时段
  let Today = await shijianc(now_time)
  if (Today.h > 19 && Today.h < 21) {
    Send(Text(`每日20-21点商店修整中,请过会再来`))
    return false
  }
  let didian = e.MessageText.replace('#洗劫', '')
  didian = didian.trim()
  let shop
  try {
    shop = await Read_shop()
  } catch {
    await Write_shop(data.shop_list)
    shop = await Read_shop()
  }
  let i
  for (i = 0; i < shop.length; i++) {
    if (shop[i].name == didian) {
      break
    }
  }
  if (i == shop.length) {
    return false
  }
  if (shop[i].state == 1) {
    Send(Text(didian + '已经戒备森严了,还是不要硬闯好了'))
    return false
  }
  let msg = ''
  let player = await Read_player(usr_qq)
  let Price = shop[i].price * shop[i].Grade
  let buff = shop[i].Grade + 1
  if (player.灵石 < Price) {
    Send(Text('灵石不足,无法进行强化'))
    return false
  } else {
    player.灵石 -= Price
    msg +=
      '你消费了' +
      Price +
      '灵石,防御力和生命值提高了' +
      Math.trunc((buff - buff / (1 + shop[i].Grade * 0.05)) * 100) +
      '%'
  }
  //开始准备洗劫
  player.魔道值 += 25 * shop[i].Grade
  await Write_player(usr_qq, player)

  shop[i].state = 1
  await Write_shop(shop)
  if (player.灵根 == null || player.灵根 == undefined) {
    player.修炼效率提升 += 0
  }
  //锁定属性
  let A_player = {
    名号: player.名号,
    攻击: parseInt(player.攻击),
    防御: Math.floor(player.防御 * buff),
    当前血量: Math.floor(player.血量上限 * buff),
    暴击率: player.暴击率,
    灵根: player.灵根,
    法球倍率: player.灵根.法球倍率,
    魔值: 0
  }
  if (player.魔道值 > 999) {
    A_player.魔值 = 1
  }
  let time: any = 15 //时间（分钟）
  let action_time = 60000 * time //持续时间，单位毫秒
  let arr = {
    action: '洗劫', //动作
    end_time: new Date().getTime() + action_time, //结束时间
    time: action_time, //持续时间
    shutup: '1', //闭关
    working: '1', //降妖
    Place_action: '1', //秘境状态---关闭
    mojie: '1', //魔界状态---关闭
    Place_actionplus: '1', //沉迷秘境状态---关闭
    power_up: '1', //渡劫状态--关闭
    xijie: '0', //洗劫状态开启
    plant: '1', //采药-开启
    mine: '1', //采矿-开启
    //这里要保存秘境特别需要留存的信息
    Place_address: shop[i],
    A_player: A_player
  }
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr))
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':lastxijie_time', now_time)
  msg += '\n开始前往' + didian + ',祝你好运!'
  Send(Text(msg))
})
