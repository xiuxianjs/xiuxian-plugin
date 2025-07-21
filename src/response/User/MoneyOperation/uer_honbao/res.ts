import { createSelects, Text, useMention, useSend } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { data, redis, config } from 'api/api'
import { existplayer, Add_灵石 } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)抢红包$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //自己没存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let player = await data.getData('player', usr_qq)
  //抢红包要有一分钟的CD
  let now_time = new Date().getTime()
  let lastgetbung_time: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':last_getbung_time'
  )
  lastgetbung_time = parseInt(lastgetbung_time)
  const cf = config.getConfig('xiuxian', 'xiuxian')
  let transferTimeout = Math.floor(cf.CD.honbao * 60000)
  if (now_time < lastgetbung_time + transferTimeout) {
    let waittime_m = Math.trunc(
      (lastgetbung_time + transferTimeout - now_time) / 60 / 1000
    )
    let waittime_s = Math.trunc(
      ((lastgetbung_time + transferTimeout - now_time) % 60000) / 1000
    )
    Send(
      Text(
        `每${transferTimeout / 1000 / 60}分钟抢一次，正在CD中，` +
          `剩余cd: ${waittime_m}分${waittime_s}秒`
      )
    )
    return false
  }
  //要艾特对方，表示抢对方红包
  const Mentions = await useMention(e)
  if (!Mentions || Mentions.length === 0) {
    return // @ 提及为空
  }
  // 查找用户类型的 @ 提及，且不是 bot
  const User = Mentions.find(item => !item.IsBot)
  if (!User) {
    return // 未找到用户Id
  }
  let honbao_qq = User.UserId
  //有无存档
  let ifexistplay_honbao = await existplayer(honbao_qq)
  if (!ifexistplay_honbao) {
    return false
  }
  //这里有错
  let acount: any = await redis.get(
    'xiuxian@1.3.0:' + honbao_qq + ':honbaoacount'
  )
  acount = Number(acount)
  //根据个数判断
  if (acount <= 0) {
    Send(Text('他的红包被光啦！'))
    return false
  }
  //看看一个有多少灵石
  const lingshi = await redis.get('xiuxian@1.3.0:' + honbao_qq + ':honbao')
  const addlingshi = Math.trunc(+lingshi)
  //减少个数
  acount--
  await redis.set('xiuxian@1.3.0:' + honbao_qq + ':honbaoacount', acount)
  //拿出来的要给玩家
  await Add_灵石(usr_qq, addlingshi)
  //给个提示
  Send(
    Text(
      '【全服公告】' + player.名号 + '抢到一个' + addlingshi + '灵石的红包！'
    )
  )
  //记录时间
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_getbung_time', now_time)
  return false
})
