import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import {
  existplayer,
  readPlayer,
  readExchange,
  writeExchange,
  addNajieThing
} from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?下架[1-9]d*/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  //固定写法
  const usr_qq = e.UserId
  //有无存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  //防并发cd
  const time0 = 0.5 //分钟cd
  //获取当前时间
  const now_time = new Date().getTime()
  let ExchangeCD: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':ExchangeCD'
  )
  ExchangeCD = parseInt(ExchangeCD)
  const transferTimeout = Math.floor(60000 * time0)
  if (now_time < ExchangeCD + transferTimeout) {
    const ExchangeCDm = Math.trunc(
      (ExchangeCD + transferTimeout - now_time) / 60 / 1000
    )
    const ExchangeCDs = Math.trunc(
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
  let Exchange = []
  //记录本次执行时间
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':ExchangeCD', now_time)
  const player = await readPlayer(usr_qq)
  const x = parseInt(e.MessageText.replace(/^(#|＃|\/)?下架/, '')) - 1
  try {
    Exchange = await readExchange()
  } catch {
    //没有表要先建立一个！
    await writeExchange([])
  }
  if (x >= Exchange.length) {
    Send(Text(`没有编号为${x + 1}的物品`))
    return false
  }
  const thingqq = Exchange[x].qq
  //对比qq是否相等
  if (thingqq != usr_qq) {
    Send(Text('不能下架别人上架的物品'))
    return false
  }
  const thing_name = Exchange[x].name.name
  const thing_class = Exchange[x].name.class
  const thing_amount = Exchange[x].aconut
  if (thing_class == '装备' || thing_class == '仙宠') {
    await addNajieThing(
      usr_qq,
      Exchange[x].name,
      thing_class,
      thing_amount,
      Exchange[x].pinji2
    )
  } else {
    await addNajieThing(usr_qq, thing_name, thing_class, thing_amount)
  }
  Exchange.splice(x, 1)
  await writeExchange(Exchange)
  await redis.set('xiuxian@1.3.0:' + thingqq + ':Exchange', 0)
  Send(Text(player.名号 + '下架' + thing_name + '成功！'))
  return false
})
