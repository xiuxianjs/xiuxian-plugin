import { Text, useSend } from 'alemonjs'

import { data, redis, config } from '@src/api/api'
import {
  Go,
  Read_player,
  sleep,
  isNotNull,
  Add_灵石,
  exist_najie_thing,
  Add_najie_thing,
  Add_修为
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?探索仙府$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let flag = await Go(e)
  if (!flag) {
    return false
  }
  let player = await Read_player(usr_qq)
  let didianlist = ['无欲天仙', '仙遗之地']
  let suiji = Math.round(Math.random()) //随机一个地方
  let yunqi = Math.random() //运气随机数
  await sleep(1000)
  Send(Text('你在冲水堂发现有人上架了一份仙府地图'))
  let didian = didianlist[suiji] //赋值
  let now_level_id
  if (!isNotNull(player.level_id)) {
    Send(Text('请先#同步信息'))
    return false
  }
  await sleep(1000)
  if (yunqi > 0.9) {
    //10%寄
    if (player.灵石 < 50000) {
      Send(Text('还没看两眼就被看堂的打手撵了出去说:“哪来的穷小子,不买别看”'))
      return false
    }
    Send(
      Text(
        '价格为5w,你觉得特别特别便宜,赶紧全款拿下了,历经九九八十天,到了后发现居然是仙湖游乐场！'
      )
    )
    await Add_灵石(usr_qq, -50000)
    return false
  }
  now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  if (now_level_id < 21) {
    Send(Text('到了地图上的地点，结果你发现,你尚未达到化神,无法抵御灵气压制'))
    return false
  }
  let weizhi = await data.timeplace_list.find(item => item.name == didian)
  if (!isNotNull(weizhi)) {
    Send(Text('报错！地点错误，请找群主反馈'))
    return false
  }
  if (player.灵石 < weizhi.Price) {
    Send(Text('你发现标价是' + weizhi.Price + ',你买不起赶紧溜了'))
    return false
  }
  if (player.修为 < 100000) {
    Send(
      Text(
        '到了地图上的地点，发现洞府前有一句前人留下的遗言:‘至少有10w修为才能抵御仙威！’'
      )
    )
    return false
  }
  let dazhe = 1
  if (
    (await exist_najie_thing(usr_qq, '仙府通行证', '道具')) &&
    player.魔道值 < 1 &&
    (player.灵根.type == '转生' || player.level_id > 41)
  ) {
    dazhe = 0
    Send(Text(player.名号 + '使用了道具仙府通行证,本次仙府免费'))
    await Add_najie_thing(usr_qq, '仙府通行证', '道具', -1)
  }
  let Price = weizhi.Price * dazhe
  await Add_灵石(usr_qq, -Price)
  const cf = config.getConfig('xiuxian', 'xiuxian')
  const time = cf.CD.timeplace //时间（分钟）
  let action_time = 60000 * time //持续时间，单位毫秒
  let arr: any = {
    action: '探索', //动作
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
  await Add_修为(usr_qq, -100000)
  if (suiji == 0) {
    Send(
      Text(
        '你买下了那份地图,历经九九八十一天,终于到达了地图上的仙府,洞府上模糊得刻着[' +
          weizhi.name +
          '仙府]你兴奋地冲进去探索机缘,被强大的仙气压制，消耗了100000修为成功突破封锁闯了进去' +
          time +
          '分钟后归来!'
      )
    )
  }
  if (suiji == 1) {
    Send(
      Text(
        '你买下了那份地图,历经九九八十一天,终于到达了地图上的地点,这座洞府仿佛是上个末法时代某个仙人留下的遗迹,你兴奋地冲进去探索机缘,被强大的仙气压制，消耗了100000修为成功突破封锁闯了进去' +
          time +
          '分钟后归来!'
      )
    )
  }
})
