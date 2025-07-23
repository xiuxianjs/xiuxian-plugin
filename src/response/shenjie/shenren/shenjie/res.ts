import { Text, useSend } from 'alemonjs'

import { redis } from '@src/api/api'
import { existplayer, Read_player, shijianc, Write_player } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)踏入神界$/

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
  if (+game_action == 0) {
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
  let now = new Date()
  let nowTime = now.getTime() //获取当前日期的时间戳
  let Today = await shijianc(nowTime)
  let lastdagong_time = await getLastdagong(usr_qq) //获得上次签到日期
  if (
    (Today.Y != lastdagong_time.Y && Today.M != lastdagong_time.M) ||
    Today.D != lastdagong_time.D
  ) {
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':lastdagong_time', nowTime) //redis设置签到时间
    let n = 1
    if (player.灵根.name == '二转轮回体') {
      n = 2
    } else if (
      player.灵根.name == '三转轮回体' ||
      player.灵根.name == '四转轮回体'
    ) {
      n = 3
    } else if (
      player.灵根.name == '五转轮回体' ||
      player.灵根.name == '六转轮回体'
    ) {
      n = 4
    } else if (
      player.灵根.name == '七转轮回体' ||
      player.灵根.name == '八转轮回体'
    ) {
      n = 4
    } else if (player.灵根.name == '九转轮回体') {
      n = 5
    }
    player.神界次数 = n
    await Write_player(usr_qq, player)
  }
  player = await Read_player(usr_qq)
  if (
    player.魔道值 > 0 ||
    (player.灵根.type != '转生' && player.level_id < 42)
  ) {
    Send(Text('你没有资格进入神界'))
    return false
  }
  if (player.灵石 < 2200000) {
    Send(Text('灵石不足'))
    return false
  }
  player.灵石 -= 2200000
  if (
    Today.Y == lastdagong_time.Y &&
    Today.M == lastdagong_time.M &&
    Today.D == lastdagong_time.D &&
    player.神界次数 == 0
  ) {
    Send(Text('今日次数用光了,请明日再来吧'))
    return false
  } else {
    player.神界次数--
  }
  await Write_player(usr_qq, player)
  let time: any = 30 //时间（分钟）
  let action_time = 60000 * time //持续时间，单位毫秒
  let arr: any = {
    action: '神界', //动作
    end_time: new Date().getTime() + action_time, //结束时间
    time: action_time, //持续时间
    shutup: '1', //闭关
    working: '1', //降妖
    Place_action: '1', //秘境状态---关闭
    mojie: '-1', //魔界状态---关闭
    Place_actionplus: '1', //沉迷秘境状态---关闭
    power_up: '1', //渡劫状态--关闭
    xijie: '1', //洗劫状态开启
    plant: '1', //采药-开启
    mine: '1', //采矿-开启
    cishu: '5'
  }
  if (e.name === 'message.create') {
    arr.group_id = e.ChannelId
  }
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr))
  Send(Text('开始进入神界,' + time + '分钟后归来!'))
})
async function getLastdagong(usr_qq) {
  //查询redis中的人物动作
  let time: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':lastdagong_time'
  )
  logger.info(time)
  if (time != null) {
    let data = await shijianc(parseInt(time))
    return data
  }
  return false
}
