import { Text, useSend } from 'alemonjs'

import { foundthing } from '@src/model/cultivation'
import { updateBagThing } from '@src/model/najie'
import { existplayer, readNajie } from '@src/model/xiuxian_impl'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?(锁定|解锁).*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  //有无存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  //命令判断
  const msg = e.MessageText.replace(/^(#|＃|\/)?/, '')
  const un_lock = msg.substring(0, 2)
  const thingParts = msg.substring(2).split('*')
  let thing_name = thingParts[0]
  const najie = await readNajie(usr_qq)
  thingParts[0] = parseInt(thingParts[0])
  // 品级
  let thing_pinji
  //装备优化
  if (thingParts[0]) {
    if (thingParts[0] > 1000) {
      try {
        thing_name = najie.仙宠[thingParts[0] - 1001].name
      } catch {
        Send(Text('仙宠代号输入有误!'))
        return false
      }
    } else if (thingParts[0] > 100) {
      try {
        thing_name = najie.装备[thingParts[0] - 101].name
        thingParts[1] = najie.装备[thingParts[0] - 101].pinji
      } catch {
        Send(Text('装备代号输入有误!'))
        return false
      }
    }
  }
  const thing_exist = await foundthing(thing_name)
  if (!thing_exist) {
    Send(Text(`你瓦特了吧，这方世界没有这样的东西:${thing_name}`))
    return false
  }
  const pj = { 劣: 0, 普: 1, 优: 2, 精: 3, 极: 4, 绝: 5, 顶: 6 }
  thing_pinji = pj[thingParts[1]]
  let ifexist
  if (un_lock == '锁定') {
    ifexist = await updateBagThing(
      usr_qq,
      thing_name,
      thing_exist.class,
      thing_pinji,
      1
    )
    if (ifexist) {
      Send(Text(`${thing_exist.class}:${thing_name}已锁定`))
      return false
    }
  } else if (un_lock == '解锁') {
    ifexist = await updateBagThing(
      usr_qq,
      thing_name,
      thing_exist.class,
      thing_pinji,
      0
    )
    if (ifexist) {
      Send(Text(`${thing_exist.class}:${thing_name}已解锁`))
      return false
    }
  }
  Send(Text(`你没有【${thing_name}】这样的${thing_exist.class}`))
})
