import { Text, useMention, useSend } from 'alemonjs'

import { config, redis } from '@src/model/api'
import { addExp } from '@src/model/economy'
import {
  findQinmidu,
  existHunyin,
  fstaddQinmidu,
  addQinmidu
} from '@src/model/qinmidu'
import { existplayer } from '@src/model/xiuxian_impl'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?^双修$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const cf = config.getConfig('xiuxian', 'xiuxian')
  //双修开关
  const gameswitch = cf.switch.couple
  if (gameswitch != true) {
    return false
  }
  const A = e.UserId
  //全局状态判断
  //B
  const Mentions = (await useMention(e)[0].find({ IsBot: false })).data
  if (!Mentions || Mentions.length === 0) {
    return // @ 提及为空
  }
  // 查找用户类型的 @ 提及，且不是 bot
  const User = Mentions.find(item => !item.IsBot)
  if (!User) {
    return // 未找到用户Id
  }
  //对方QQ
  const B = User.UserId
  if (A == B) {
    Send(Text('你咋这么爱撸自己呢?'))
    return false
  }
  const Time = cf.CD.couple //6个小时
  const shuangxiuTimeout = Math.floor(60000 * Time)
  //自己的cd
  const now_Time = new Date().getTime() //获取当前时间戳
  let last_timeA: any = await redis.get(
    'xiuxian@1.3.0:' + A + ':last_shuangxiu_time'
  ) //获得上次的时间戳,
  last_timeA = Math.floor(last_timeA)
  if (now_Time < last_timeA + shuangxiuTimeout) {
    const Couple_m = Math.trunc(
      (last_timeA + shuangxiuTimeout - now_Time) / 60 / 1000
    )
    const Couple_s = Math.trunc(
      ((last_timeA + shuangxiuTimeout - now_Time) % 60000) / 1000
    )
    Send(Text(`双修冷却:  ${Couple_m}分 ${Couple_s}秒`))
    return false
  }
  let last_timeB: any = await redis.get(
    'xiuxian@1.3.0:' + B + ':last_shuangxiu_time'
  ) //获得上次的时间戳,
  last_timeB = Math.floor(last_timeB)
  if (now_Time < last_timeB + shuangxiuTimeout) {
    const Couple_m = Math.trunc(
      (last_timeB + shuangxiuTimeout - now_Time) / 60 / 1000
    )
    const Couple_s = Math.trunc(
      ((last_timeB + shuangxiuTimeout - now_Time) % 60000) / 1000
    )
    Send(Text(`对方双修冷却:  ${Couple_m}分 ${Couple_s}秒`))
    return false
  }
  //对方存档
  const ifexistplay_B = await existplayer(B)
  if (!ifexistplay_B) {
    Send(Text('修仙者不可对凡人出手!'))
    return false
  }
  //拒绝
  const couple = await redis.get('xiuxian@1.3.0:' + B + ':couple')
  if (+couple != 0) {
    Send(Text('哎哟，你干嘛...'))
    return false
  }
  const pd = await findQinmidu(A, B)
  const hunyin_B = await existHunyin(A)
  const hunyin_A = await existHunyin(B)
  //logger.info(`pd = `+pd+` hunyin = `+hunyin);
  //双方有一人已婚
  if (hunyin_B != '' || hunyin_A != '') {
    //不是对方
    if (hunyin_A != A || hunyin_B != B) {
      Send(Text(`力争纯爱！禁止贴贴！！`))
      return false
    }
  } else if (pd == false) {
    //没有存档
    await fstaddQinmidu(A, B)
  }
  //前戏做完了!
  await redis.set('xiuxian@1.3.0:' + A + ':last_shuangxiu_time', now_Time)
  await redis.set('xiuxian@1.3.0:' + B + ':last_shuangxiu_time', now_Time)
  if (A != B) {
    const option = Math.random()
    const xiuwei = Math.random()
    let x = 0
    let y = 0
    if (option > 0 && option <= 0.5) {
      x = 28000
      y = Math.trunc(xiuwei * x)
      await addExp(A, Math.floor(y))
      await addExp(B, Math.floor(y))
      await addQinmidu(A, B, 30)
      Send(
        Text(
          '你们双方情意相通，缠绵一晚，都增加了' +
            Math.floor(y) +
            '修为,亲密度增加了30点'
        )
      )
      return false
    } else if (option > 0.5 && option <= 0.6) {
      x = 21000
      y = Math.trunc(xiuwei * x)
      await addExp(A, Math.floor(y))
      await addExp(B, Math.floor(y))
      await addQinmidu(A, B, 20)
      Send(
        Text(
          '你们双方交心交神，努力修炼，都增加了' +
            Math.floor(y) +
            '修为,亲密度增加了20点'
        )
      )
    } else if (option > 0.6 && option <= 0.7) {
      x = 14000
      y = Math.trunc(xiuwei * x)
      await addExp(A, Math.floor(y))
      await addExp(B, Math.floor(y))
      await addQinmidu(A, B, 15)
      Send(
        Text(
          '你们双方共同修炼，过程平稳，都增加了' +
            Math.floor(y) +
            '修为,亲密度增加了15点'
        )
      )
    } else if (option > 0.7 && option <= 0.9) {
      x = 520
      y = Math.trunc(1 * x)
      await addExp(A, Math.floor(y))
      await addExp(B, Math.floor(y))
      await addQinmidu(A, B, 10)
      Send(
        Text(
          '你们双方努力修炼，但是并进不了状态，都增加了' +
            Math.floor(y) +
            '修为,亲密度增加了10点'
        )
      )
    } else {
      Send(Text('你们双修时心神合一，但是不知道哪来的小孩，惊断了状态'))
    }
    return false
  }
})
