import { Text, useSend } from 'alemonjs'

import { data, redis, config } from '@src/api/api'
import {
  Go,
  readPlayer,
  notUndAndNull,
  existHunyin,
  findQinmidu,
  addQinmidu,
  addCoin
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?降临秘境.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let flag = await Go(e)
  if (!flag) {
    return false
  }
  let player = await readPlayer(usr_qq)
  let didian = e.MessageText.replace(/^(#|＃|\/)?降临秘境/, '')
  didian = didian.trim()
  let weizhi = await data.didian_list.find(item => item.name == didian)
  if (!notUndAndNull(weizhi)) {
    return false
  }
  if (player.灵石 < weizhi.Price) {
    Send(Text('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~'))
    return false
  }
  if (didian == '桃花岛') {
    let exist_B = await existHunyin(usr_qq)
    if (!exist_B) {
      Send(Text(`还请少侠找到道侣之后再来探索吧`))
      return false
    }
    let qinmidu = await findQinmidu(usr_qq, exist_B)
    if (qinmidu < 550) {
      Send(Text('少侠还是先和道侣再联络联络感情吧'))
      return false
    }
    await addQinmidu(usr_qq, exist_B, -50)
  }
  let Price = weizhi.Price
  await addCoin(usr_qq, -Price)
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
  if (e.name === 'message.create') {
    arr.group_id = e.ChannelId
  }
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr))
  Send(Text('开始降临' + didian + ',' + time + '分钟后归来!'))
})
