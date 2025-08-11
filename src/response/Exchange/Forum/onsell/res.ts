import { Text, useSend } from 'alemonjs'

import {
  existplayer,
  foundthing,
  convert2integer,
  readForum,
  writeForum,
  readPlayer,
  addCoin
} from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?发布.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  //固定写法
  const usr_qq = e.UserId

  //有无存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  const thing = e.MessageText.replace(/^(#|＃|\/)?发布/, '')
  const code = thing.split('*')
  const thing_name = code[0] //物品
  const value = code[1] //价格
  const amount = code[2] //数量
  //判断列表中是否存在，不存在不能卖,并定位是什么物品
  const thing_exist = await foundthing(thing_name)
  if (!thing_exist) {
    Send(Text(`这方世界没有[${thing_name}]`))
    return false
  }
  if (thing_exist.class == '装备' || thing_exist.class == '仙宠') {
    Send(Text(`暂不支持该类型物品交易`))
    return false
  }
  const thing_value = await convert2integer(value)
  const thing_amount = await convert2integer(amount)
  let Forum = []
  try {
    Forum = await readForum()
  } catch {
    await writeForum([])
  }
  const now_time = Date.now()
  const whole = Math.trunc(thing_value * thing_amount)
  let off = Math.trunc(whole * 0.03)
  if (off < 100000) off = 100000
  const player = await readPlayer(usr_qq)
  if (player.灵石 < off + whole) {
    Send(Text(`灵石不足,还需要${off + whole - player.灵石}灵石`))
    return false
  }
  await addCoin(usr_qq, -(off + whole))
  const wupin = {
    qq: usr_qq,
    name: thing_name,
    price: thing_value,
    class: thing_exist.class,
    aconut: thing_amount,
    whole: whole,
    now_time: now_time
  }
  Forum.push(wupin)
  //写入
  await writeForum(Forum)
  Send(Text('发布成功！'))
})
