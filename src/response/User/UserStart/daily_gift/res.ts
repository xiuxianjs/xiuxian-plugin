import { Text, useSend } from 'alemonjs'

import { redis, data, config } from '@src/api/api'
import {
  existplayer,
  shijianc,
  getLastsign,
  addNajieThing,
  Add_修为
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?修仙签到$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无账号
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let now = new Date()
  let nowTime = now.getTime() //获取当前日期的时间戳
  let Yesterday = await shijianc(nowTime - 24 * 60 * 60 * 1000) //获得昨天日期
  let Today = await shijianc(nowTime)
  let lastsign_time = await getLastsign(usr_qq) //获得上次签到日期
  if (
    Today.Y == lastsign_time.Y &&
    Today.M == lastsign_time.M &&
    Today.D == lastsign_time.D
  ) {
    Send(Text(`今日已经签到过了`))
    return false
  }
  let Sign_Yesterday //昨日日是否签到
  if (
    Yesterday.Y == lastsign_time.Y &&
    Yesterday.M == lastsign_time.M &&
    Yesterday.D == lastsign_time.D
  ) {
    Sign_Yesterday = true
  } else {
    Sign_Yesterday = false
  }
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':lastsign_time', nowTime) //redis设置签到时间
  let player = await data.getData('player', usr_qq)
  if (player.连续签到天数 == 7 || !Sign_Yesterday) {
    //签到连续7天或者昨天没有签到,连续签到天数清零
    player.连续签到天数 = 0
  }
  player.连续签到天数 += 1
  data.setData('player', usr_qq, player)
  //给奖励
  let gift_xiuwei = player.连续签到天数 * 3000
  const cf = config.getConfig('xiuxian', 'xiuxian')
  await addNajieThing(usr_qq, '秘境之匙', '道具', cf.Sign.ticket)
  await Add_修为(usr_qq, gift_xiuwei)
  let msg = `已经连续签到${player.连续签到天数}天了，获得了${gift_xiuwei}修为,秘境之匙x${cf.Sign.ticket}`

  Send(Text(msg))
})
