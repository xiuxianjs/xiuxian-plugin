import { Text, useSend } from 'alemonjs'

import { data, redis, config } from '@src/api/api'
import {
  Go,
  Read_player,
  isNotNull,
  exist_najie_thing,
  Add_najie_thing,
  Add_灵石
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?镇守仙境.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let flag = await Go(e)
  if (!flag) {
    return false
  }
  let player = await Read_player(usr_qq)
  let didian = e.MessageText.replace('(#|＃|/)?镇守仙境', '')
  didian = didian.trim()
  let weizhi = await data.Fairyrealm_list.find(item => item.name == didian)
  if (!isNotNull(weizhi)) {
    return false
  }
  if (player.灵石 < weizhi.Price) {
    Send(Text('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~'))
    return false
  }
  let now_level_id
  now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  if (now_level_id < 42 && player.lunhui == 0) {
    return false
  }
  let dazhe = 1
  if (
    (await exist_najie_thing(usr_qq, '杀神崖通行证', '道具')) &&
    player.魔道值 < 1 &&
    (player.灵根.type == '转生' || player.level_id > 41) &&
    didian == '杀神崖'
  ) {
    dazhe = 0
    Send(Text(player.名号 + '使用了道具杀神崖通行证,本次仙境免费'))
    await Add_najie_thing(usr_qq, '杀神崖通行证', '道具', -1)
  } else if (
    (await exist_najie_thing(usr_qq, '仙境优惠券', '道具')) &&
    player.魔道值 < 1 &&
    (player.灵根.type == '转生' || player.level_id > 41)
  ) {
    dazhe = 0.5
    Send(Text(player.名号 + '使用了道具仙境优惠券,本次消耗减少50%'))
    await Add_najie_thing(usr_qq, '仙境优惠券', '道具', -1)
  }
  let Price = weizhi.Price * dazhe
  await Add_灵石(usr_qq, -Price)
  const cf = config.getConfig('xiuxian', 'xiuxian')
  const time = cf.CD.secretplace //时间（分钟）
  let action_time = 60000 * time //持续时间，单位毫秒
  let arr: any = {
    action: '历练', //动作
    end_time: new Date().getTime() + action_time, //结束时间
    time: action_time, //持续时间
    shutup: '1', //闭关
    working: '1', //降妖
    Place_action: '0', //秘境状态---开启
    Place_actionplus: '1', //沉迷秘境状态---关闭
    power_up: '1', //渡劫状态--关闭
    mojie: '1', //魔界状态---关闭
    xijie: '1', //洗劫状态开启
    plant: '1', //采药-开启
    mine: '1', //采矿-开启
    //这里要保存秘境特别需要留存的信息
    Place_address: weizhi
  }
  if (e.name == 'message.create') {
    arr.group_id = e.ChannelId
  }
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr))
  Send(Text('开始镇守' + didian + ',' + time + '分钟后归来!'))
})
