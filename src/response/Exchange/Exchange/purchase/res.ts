import { Text, useSend } from 'alemonjs'

import { redis } from '@src/api/api'
import {
  Go,
  Read_player,
  Read_Exchange,
  Write_Exchange,
  convert2integer,
  Add_najie_thing,
  Add_灵石
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?选购.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //全局状态判断
  let flag = await Go(e)
  if (!flag) return false
  //防并发cd
  let time0 = 0.5 //分钟cd
  //获取当前时间
  let now_time = new Date().getTime()
  let Exchange_res = await redis.get('xiuxian@1.3.0:' + usr_qq + ':ExchangeCD')
  const ExchangeCD = parseInt(Exchange_res)
  let transferTimeout = Math.floor(60000 * time0)
  if (now_time < ExchangeCD + transferTimeout) {
    let ExchangeCDm = Math.trunc(
      (ExchangeCD + transferTimeout - now_time) / 60 / 1000
    )
    let ExchangeCDs = Math.trunc(
      ((ExchangeCD + transferTimeout - now_time) % 60000) / 1000
    )
    Send(
      Text(
        `每${transferTimeout / 1000 / 60}分钟操作一次，` +
          `CD: ${ExchangeCDm}分${ExchangeCDs}秒`
      )
    )
    //存在CD。直接返回
    return false
  }
  //记录本次执行时间
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':ExchangeCD', now_time)
  let player = await Read_player(usr_qq)
  let Exchange
  try {
    Exchange = await Read_Exchange()
  } catch {
    //没有表要先建立一个！
    await Write_Exchange([])
    Exchange = await Read_Exchange()
  }
  let t = e.MessageText.replace(/^(#|＃|\/)?选购/, '').split('*')
  let x = (await convert2integer(t[0])) - 1
  if (x >= Exchange.length) {
    return false
  }
  let thingqq = Exchange[x].qq
  if (thingqq == usr_qq) {
    Send(Text('自己买自己的东西？我看你是闲得蛋疼！'))
    return false
  }
  //根据qq得到物品
  let thing_name = Exchange[x].name.name
  let thing_class = Exchange[x].name.class
  let thing_amount = Exchange[x].aconut
  let thing_price = Exchange[x].price
  let n = await convert2integer(t[1])
  if (!t[1]) {
    n = thing_amount
  }
  if (n > thing_amount) {
    Send(Text(`冲水堂没有这么多【${thing_name}】!`))
    return false
  }
  let money = n * thing_price
  //查灵石
  if (player.灵石 > money) {
    //加物品
    if (thing_class == '装备' || thing_class == '仙宠') {
      await Add_najie_thing(
        usr_qq,
        Exchange[x].name,
        thing_class,
        n,
        Exchange[x].pinji2
      )
    } else {
      await Add_najie_thing(usr_qq, thing_name, thing_class, n)
    }
    //扣钱
    await Add_灵石(usr_qq, -money)
    //加钱
    await Add_灵石(thingqq, money)
    Exchange[x].aconut = Exchange[x].aconut - n
    Exchange[x].whole = Exchange[x].whole - money
    //删除该位置信息
    Exchange = Exchange.filter(item => item.aconut > 0)
    await Write_Exchange(Exchange)
    Send(Text(`${player.名号}在冲水堂购买了${n}个【${thing_name}】！`))
  } else {
    Send(Text('醒醒，你没有那么多钱！'))
    return false
  }
})
