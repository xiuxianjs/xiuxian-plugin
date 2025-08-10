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
  const index = parseInt(thingParts[0])
  // 品级（仅在确定品级后初始化）
  //装备优化
  if (!isNaN(index)) {
    if (index > 1000) {
      try {
        thing_name = najie.仙宠[index - 1001].name
      } catch {
        Send(Text('仙宠代号输入有误!'))
        return false
      }
    } else if (index > 100) {
      try {
        thing_name = najie.装备[index - 101].name
        // @ts-expect-error 动态数据结构: 装备项可能包含 pinji 属性
        thingParts[1] = najie.装备[index - 101].pinji as unknown as string
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
  const thing_pinji = pj[thingParts[1] as keyof typeof pj]
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
