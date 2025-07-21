import { Text, useSend } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { redis } from '@src/api/api'
import {
  Go,
  Read_player,
  Read_Forum,
  Write_Forum,
  convert2integer,
  exist_najie_thing,
  Add_najie_thing,
  Add_灵石
} from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)接取.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //全局状态判断
  let flag = await Go(e)
  if (!flag) return false
  //防并发cd
  let time: any = 0.5 //分钟cd
  //获取当前时间
  let now_time = new Date().getTime()
  let ForumCD: any = await redis.get('xiuxian@1.3.0:' + usr_qq + ':ForumCD')
  ForumCD = parseInt(ForumCD)
  let transferTimeout = Math.floor(60000 * time)
  if (now_time < ForumCD + transferTimeout) {
    let ForumCDm = Math.trunc(
      (ForumCD + transferTimeout - now_time) / 60 / 1000
    )
    let ForumCDs = Math.trunc(
      ((ForumCD + transferTimeout - now_time) % 60000) / 1000
    )
    Send(
      Text(
        `每${transferTimeout / 1000 / 60}分钟操作一次，` +
          `CD: ${ForumCDm}分${ForumCDs}秒`
      )
    )
    //存在CD。直接返回
    return false
  }
  //记录本次执行时间
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':ForumCD', now_time)
  let player = await Read_player(usr_qq)
  let Forum
  try {
    Forum = await Read_Forum()
  } catch {
    //没有表要先建立一个！
    await Write_Forum([])
    Forum = await Read_Forum()
  }
  let t = e.MessageText.replace('#接取', '').split('*')
  let x = (await convert2integer(t[0])) - 1
  if (x >= Forum.length) {
    return false
  }
  let thingqq = Forum[x].qq
  if (thingqq == usr_qq) {
    Send(Text('没事找事做?'))
    return false
  }
  //根据qq得到物品
  let thing_name = Forum[x].name
  let thing_class = Forum[x].class
  let thing_amount = Forum[x].aconut
  let thing_price = Forum[x].price
  let n = await convert2integer(t[1])
  if (!t[1]) {
    n = thing_amount
  }
  const num = await exist_najie_thing(usr_qq, thing_name, thing_class)
  if (!num) {
    Send(Text(`你没有【${thing_name}】`))
    return false
  }
  if (num < n) {
    Send(Text(`你只有【${thing_name}】x ${num}`))
    return false
  }
  if (n > thing_amount) n = thing_amount
  let money = n * thing_price

  await Add_najie_thing(usr_qq, thing_name, thing_class, -n)
  //扣钱
  await Add_灵石(usr_qq, money)
  //加钱
  await Add_najie_thing(thingqq, thing_name, thing_class, n)
  Forum[x].aconut = Forum[x].aconut - n
  Forum[x].whole = Forum[x].whole - money
  //删除该位置信息
  Forum = Forum.filter(item => item.aconut > 0)
  await Write_Forum(Forum)
  Send(Text(`${player.名号}在聚宝堂收获了${money}灵石！`))
})
