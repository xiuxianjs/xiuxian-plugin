import { Text, useSend } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { data, redis, config } from '@src/api/api'
import { Go, Read_player, isNotNull, Add_灵石 } from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)探索宗门秘境.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let flag = await Go(e)
  if (!flag) {
    return false
  }
  let player = await Read_player(usr_qq)
  if (!player.宗门) {
    Send(Text('请先加入宗门'))
    return false
  }
  let ass = data.getAssociation(player.宗门.宗门名称)
  if (ass.宗门驻地 == 0) {
    Send(Text(`你的宗门还没有驻地，不能探索秘境哦`))
    return false
  }
  let didian = e.MessageText.replace('#探索宗门秘境', '')
  didian = didian.trim()
  let weizhi = await data.guildSecrets_list.find(item => item.name == didian)
  if (!isNotNull(weizhi)) {
    return false
  }

  if (player.灵石 < weizhi.Price) {
    Send(Text('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~'))
    return false
  }
  let Price = weizhi.Price
  ass.灵石池 += Price * 0.05
  data.setAssociation(ass.宗门名称, ass)

  await Add_灵石(usr_qq, -Price)
  let time: any = config.getConfig('xiuxian', 'xiuxian').CD.secretplace //时间（分钟）
  let action_time = 60000 * time //持续时间，单位毫秒
  let arr = {
    action: '历练', //动作
    end_time: new Date().getTime() + action_time, //结束时间
    time: action_time, //持续时间
    shutup: '1', //闭关
    working: '1', //降妖
    Place_action: '0', //秘境状态---开启
    Place_actionplus: '1', //沉迷秘境状态---关闭
    power_up: '1', //渡劫状态--关闭
    //这里要保存秘境特别需要留存的信息
    Place_address: weizhi,
    XF: ass.power
  }

  await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr))
  // setTimeout(() => {
  //         SecretPlaceMax(e, weizhi);
  //     }, 60000 );

  Send(Text('开始探索' + didian + '宗门秘境,' + time + '分钟后归来!'))
})
