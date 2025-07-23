import { Text, useSend } from 'alemonjs'

import { data, redis } from '@src/api/api'
import {
  Go,
  Read_player,
  convert2integer,
  isNotNull,
  exist_najie_thing,
  Add_najie_thing,
  Add_灵石
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)沉迷宗门秘境.*$/

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
  let didian = e.MessageText.replace('#沉迷宗门秘境', '')
  let code = didian.split('*')
  didian = code[0]
  let i = await convert2integer(code[1])
  if (i > 12) return false
  let weizhi = await data.guildSecrets_list.find(item => item.name == didian)
  if (!isNotNull(weizhi)) {
    return false
  }
  if (player.灵石 < weizhi.Price * i * 10) {
    Send(Text('没有灵石寸步难行,攒到' + weizhi.Price * i * 10 + '灵石才够哦~'))
    return false
  }
  let number = await exist_najie_thing(usr_qq, '秘境之匙', '道具')
  if (isNotNull(number) && number >= i) {
    await Add_najie_thing(usr_qq, '秘境之匙', '道具', -i)
  } else {
    Send(Text('你没有足够数量的秘境之匙'))
    return false
  }
  let Price = weizhi.Price * i * 10

  ass.灵石池 += Price * 0.05
  data.setAssociation(ass.宗门名称, ass)

  await Add_灵石(usr_qq, -Price)
  let time: any = i * 10 * 5 + 10 //时间（分钟）
  let action_time = 60000 * time //持续时间，单位毫秒
  let arr = {
    action: '历练', //动作
    end_time: new Date().getTime() + action_time, //结束时间
    time: action_time, //持续时间
    shutup: '1', //闭关
    working: '1', //降妖
    Place_action: '1', //秘境状态---开启
    Place_actionplus: '0', //沉迷秘境状态---关闭
    power_up: '1', //渡劫状态--关闭
    cishu: 10 * i,
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
