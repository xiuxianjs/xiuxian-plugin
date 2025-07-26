import { Text, useSend } from 'alemonjs'

import { data, redis } from '@src/api/api'
import { isNotNull, shijianc } from '@src/model'
import { getLastsign_Asso, isNotMaintenance } from '../../ass'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?宗门俸禄$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = await data.getData('player', usr_qq)
  if (!isNotNull(player.宗门)) return false
  let ass = await data.getAssociation(player.宗门.宗门名称)
  let ismt = isNotMaintenance(ass)
  if (ismt) {
    Send(Text(`宗门尚未维护，快找宗主维护宗门`))
    return false
  }
  let now = new Date()
  let nowTime = now.getTime() //获取当前日期的时间戳
  let Today = await shijianc(nowTime)
  let lastsign_time = await getLastsign_Asso(usr_qq) //获得上次宗门签到日期
  if (
    Today.Y == lastsign_time.Y &&
    Today.M == lastsign_time.M &&
    Today.D == lastsign_time.D
  ) {
    Send(Text(`今日已经领取过了`))
    return false
  }
  //给奖励
  let temp = player.宗门.职位
  let n = 1
  if (temp == '外门弟子') {
    Send(Text('没有资格领取俸禄'))
    return false
  }
  if (temp == '内门弟子') {
    Send(Text('没有资格领取俸禄'))
    return false
  }
  if (temp == '长老') {
    n = 3
  }
  if (temp == '副宗主') {
    n = 4
  }
  if (temp == '宗主') {
    n = 5
  }
  let fuli = Number(Math.trunc(ass.宗门建设等级 * 2000))
  let gift_lingshi = Math.trunc(ass.宗门等级 * 1200 * n + fuli)
  gift_lingshi = gift_lingshi / 2
  if (ass.灵石池 - gift_lingshi < 0) {
    Send(Text(`宗门灵石池不够发放俸禄啦，快去为宗门做贡献吧`))
    return false
  }
  ass.灵石池 -= gift_lingshi
  player.灵石 += gift_lingshi
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':lastsign_Asso_time', nowTime) //redis设置签到时间
  data.setData('player', usr_qq, player)
  data.setAssociation(ass.宗门名称, ass)
  let msg = [`宗门俸禄领取成功,获得了${gift_lingshi}灵石`]
  Send(Text(msg.join('')))
  return false
})
