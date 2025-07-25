import { Text, useSend } from 'alemonjs'

import { existplayer, readNajie, foundthing, re_najie_thing } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?(锁定|解锁).*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  //命令判断
  let msg = e.MessageText.replace(/^(#|＃|\/)?/, '')
  let un_lock = msg.substring(0, 2)
  let thing: any = msg.substring(2).split('*')
  let thing_name = thing[0]
  let najie = await readNajie(usr_qq)
  thing[0] = parseInt(thing[0])
  let thing_pinji
  //装备优化
  if (thing[0]) {
    if (thing[0] > 1000) {
      try {
        thing_name = najie.仙宠[thing[0] - 1001].name
      } catch {
        Send(Text('仙宠代号输入有误!'))
        return false
      }
    } else if (thing[0] > 100) {
      try {
        thing_name = najie.装备[thing[0] - 101].name
        thing[1] = najie.装备[thing[0] - 101].pinji
      } catch {
        Send(Text('装备代号输入有误!'))
        return false
      }
    }
  }
  let thing_exist = await foundthing(thing_name)
  if (!thing_exist) {
    Send(Text(`你瓦特了吧，这方世界没有这样的东西:${thing_name}`))
    return false
  }
  let pj = { 劣: 0, 普: 1, 优: 2, 精: 3, 极: 4, 绝: 5, 顶: 6 }
  thing_pinji = pj[thing[1]]
  let ifexist
  if (un_lock == '锁定') {
    ifexist = await re_najie_thing(
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
    ifexist = await re_najie_thing(
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
