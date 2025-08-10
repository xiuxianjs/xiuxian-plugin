import { Text, useSend } from 'alemonjs'

import { data, redis } from '@src/api/api'
import {
  Go,
  convert2integer,
  notUndAndNull,
  readPlayer,
  existNajieThing,
  addNajieThing,
  addCoin
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?沉迷仙境.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let flag = await Go(e)
  if (!flag) {
    return false
  }
  let didian = e.MessageText.replace(/^(#|＃|\/)?沉迷仙境/, '')
  let code = didian.split('*')
  didian = code[0]
  let i = await convert2integer(code[1])
  if (i > 12) {
    return false
  }
  let weizhi = await data.Fairyrealm_list.find(item => item.name == didian)
  if (!notUndAndNull(weizhi)) {
    return false
  }
  let player = await readPlayer(usr_qq)
  if (player.灵石 < weizhi.Price * 10 * i) {
    Send(Text('没有灵石寸步难行,攒到' + weizhi.Price * 10 * i + '灵石才够哦~'))
    return false
  }
  let now_level_id
  if (didian == '仙界矿场') {
    Send(Text('打工本不支持沉迷哦'))
    return false
  }
  player = await readPlayer(usr_qq)
  now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  if (now_level_id < 42 && player.lunhui == 0) {
    return false
  }
  let number = await existNajieThing(usr_qq, '秘境之匙', '道具')
  if (notUndAndNull(number) && number >= i) {
    await addNajieThing(usr_qq, '秘境之匙', '道具', -i)
  } else {
    Send(Text('你没有足够数量的秘境之匙'))
    return false
  }
  let Price = weizhi.Price * 10 * i
  await addCoin(usr_qq, -Price)
  const time = i * 10 * 5 + 10 //时间（分钟）
  let action_time = 60000 * time //持续时间，单位毫秒
  let arr: any = {
    action: '历练', //动作
    end_time: new Date().getTime() + action_time, //结束时间
    time: action_time, //持续时间
    shutup: '1', //闭关
    working: '1', //降妖
    Place_action: '1', //秘境状态---开启
    Place_actionplus: '0', //沉迷秘境状态---关闭
    power_up: '1', //渡劫状态--关闭
    mojie: '1', //魔界状态---关闭
    xijie: '1', //洗劫状态开启
    plant: '1', //采药-开启
    mine: '1', //采矿-开启
    cishu: 10 * i,
    //这里要保存秘境特别需要留存的信息
    Place_address: weizhi
  }
  if (e.name === 'message.create') {
    arr.group_id = e.ChannelId
  }
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr))
  Send(Text('开始镇守' + didian + ',' + time + '分钟后归来!'))
})
