import { Text, useSend } from 'alemonjs'

import { data, redis } from '@src/api/api'
import {
  Go,
  readPlayer,
  isNotNull,
  convert2integer,
  existNajieThing,
  addNajieThing,
  Add_灵石,
  Add_修为
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?沉迷禁地.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let flag = await Go(e)
  if (!flag) {
    return false
  }
  let player = await readPlayer(usr_qq)
  let now_level_id
  if (!isNotNull(player.level_id)) {
    Send(Text('请先#同步信息'))
    return false
  }
  if (!isNotNull(player.power_place)) {
    Send(Text('请#同步信息'))
    return false
  }
  now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  if (now_level_id < 22) {
    Send(Text('没有达到化神之前还是不要去了'))
    return false
  }
  let didian = await e.MessageText.replace(/^(#|＃|\/)?沉迷禁地/, '')
  let code = didian.split('*')
  didian = code[0]
  let i = await convert2integer(code[1])
  if (i > 12) {
    return false
  }
  let weizhi = await data.forbiddenarea_list.find(item => item.name == didian)
  if (!isNotNull(weizhi)) {
    return false
  }
  if (player.灵石 < weizhi.Price * 10 * i) {
    Send(Text('没有灵石寸步难行,攒到' + weizhi.Price * 10 * i + '灵石才够哦~'))
    return false
  }
  if (player.修为 < weizhi.experience * 10 * i) {
    Send(
      Text(
        '你需要积累' + weizhi.experience * 10 * i + '修为，才能抵抗禁地魔气！'
      )
    )
    return false
  }
  let number = await existNajieThing(usr_qq, '秘境之匙', '道具')
  if (isNotNull(number) && number >= i) {
    await addNajieThing(usr_qq, '秘境之匙', '道具', -i)
  } else {
    Send(Text('你没有足够数量的秘境之匙'))
    return false
  }
  let Price = weizhi.Price * 10 * i
  let Exp = weizhi.experience * 10 * i
  await Add_灵石(usr_qq, -Price)
  await Add_修为(usr_qq, -Exp)
  const time = i * 10 * 5 + 10 //时间（分钟）
  let action_time = 60000 * time //持续时间，单位毫秒
  let arr: any = {
    action: '禁地', //动作
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
  Send(Text('正在前往' + weizhi.name + ',' + time + '分钟后归来!'))
})
