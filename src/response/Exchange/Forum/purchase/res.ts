import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import {
  Go,
  readPlayer,
  readForum,
  writeForum,
  convert2integer,
  existNajieThing,
  addNajieThing,
  addCoin
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?接取.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  //全局状态判断
  const flag = await Go(e)
  if (!flag) return false
  //防并发cd
  const time: any = 0.5 //分钟cd
  //获取当前时间
  const now_time = new Date().getTime()
  let ForumCD: any = await redis.get('xiuxian@1.3.0:' + usr_qq + ':ForumCD')
  ForumCD = parseInt(ForumCD)
  const transferTimeout = Math.floor(60000 * time)
  if (now_time < ForumCD + transferTimeout) {
    const ForumCDm = Math.trunc(
      (ForumCD + transferTimeout - now_time) / 60 / 1000
    )
    const ForumCDs = Math.trunc(
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
  const player = await readPlayer(usr_qq)
  let Forum = []
  try {
    Forum = await readForum()
  } catch {
    //没有表要先建立一个！
    await writeForum([])
  }
  const t = e.MessageText.replace(/^(#|＃|\/)?/, '').split('*')
  const x = (await convert2integer(t[0])) - 1
  if (x >= Forum.length) {
    return false
  }
  const thingqq = Forum[x].qq
  if (thingqq == usr_qq) {
    Send(Text('没事找事做?'))
    return false
  }
  //根据qq得到物品
  const thing_name = Forum[x].name
  const thing_class = Forum[x].class
  const thing_amount = Forum[x].aconut
  const thing_price = Forum[x].price
  let n = await convert2integer(t[1])
  if (!t[1]) {
    n = thing_amount
  }
  const num = await existNajieThing(usr_qq, thing_name, thing_class)
  if (!num) {
    Send(Text(`你没有【${thing_name}】`))
    return false
  }
  if (num < n) {
    Send(Text(`你只有【${thing_name}】x ${num}`))
    return false
  }
  if (n > thing_amount) n = thing_amount
  const money = n * thing_price

  await addNajieThing(usr_qq, thing_name, thing_class, -n)
  //扣钱
  await addCoin(usr_qq, money)
  //加钱
  await addNajieThing(thingqq, thing_name, thing_class, n)
  Forum[x].aconut = Forum[x].aconut - n
  Forum[x].whole = Forum[x].whole - money
  //删除该位置信息
  Forum = Forum.filter(item => item.aconut > 0)
  await writeForum(Forum)
  Send(Text(`${player.名号}在聚宝堂收获了${money}灵石！`))
})
