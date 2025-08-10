import { Text, useSend } from 'alemonjs'

import { data, redis, config } from '@src/model/api'
import { Go, readPlayer, notUndAndNull, addCoin, addExp } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?前往禁地.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const flag = await Go(e)
  if (!flag) {
    return false
  }
  const player = await readPlayer(usr_qq)
  // 当前境界 id
  if (!notUndAndNull(player.level_id)) {
    Send(Text('请先#同步信息'))
    return false
  }
  if (!notUndAndNull(player.power_place)) {
    Send(Text('请#同步信息'))
    return false
  }
  const now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  if (now_level_id < 22) {
    Send(Text('没有达到化神之前还是不要去了'))
    return false
  }
  let didian = await e.MessageText.replace(/^(#|＃|\/)?前往禁地/, '')
  didian = didian.trim()
  const weizhi = await data.forbiddenarea_list.find(item => item.name == didian)
  // if (player.power_place == 0 && weizhi.id != 666) {
  //     Send(Text("仙人不得下凡")
  //     return  false;
  //  }
  if (!notUndAndNull(weizhi)) {
    return false
  }
  if (player.灵石 < weizhi.Price) {
    Send(Text('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~'))
    return false
  }
  if (player.修为 < weizhi.experience) {
    Send(Text('你需要积累' + weizhi.experience + '修为，才能抵抗禁地魔气！'))
    return false
  }
  const Price = weizhi.Price
  await addCoin(usr_qq, -Price)
  await addExp(usr_qq, -weizhi.experience)
  const cf = config.getConfig('xiuxian', 'xiuxian')
  const time = cf.CD.forbiddenarea //时间（分钟）
  const action_time = 60000 * time //持续时间，单位毫秒
  const arr: any = {
    action: '禁地', //动作
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
  Send(Text('正在前往' + weizhi.name + ',' + time + '分钟后归来!'))
})
