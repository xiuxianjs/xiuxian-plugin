import { Text, useMention, useSend } from 'alemonjs'

import {
  existplayer,
  Add_灵石,
  Add_修为,
  Add_血气,
  foundthing,
  addNajieThing
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?发(灵石|修为|血气)\*\d+$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) return false
  //对方
  const Mentions = (await useMention(e)[0].find({ IsBot: false })).data
  if (!Mentions || Mentions.length === 0) {
    return // @ 提及为空
  }
  // 查找用户类型的 @ 提及，且不是 bot
  const User = Mentions.find(item => !item.IsBot)
  if (!User) {
    return // 未找到用户Id
  }
  let B_qq = User.UserId //对方qq
  //检查存档
  let ifexistplay = await existplayer(B_qq)
  if (!ifexistplay) {
    Send(Text('对方无存档'))
    return false
  }
  //获取发送灵石数量
  let code = e.MessageText.replace(/^(#|＃|\/)?发/, '').split('*')
  let thing_name = code[0]
  let thing_amount: any = code[1] //数量
  let thing_piji
  thing_amount = Number(thing_amount)
  if (isNaN(thing_amount)) {
    thing_amount = 1
  }
  if (thing_name == '灵石') {
    await Add_灵石(B_qq, thing_amount)
  } else if (thing_name == '修为') {
    await Add_修为(B_qq, thing_amount)
  } else if (thing_name == '血气') {
    await Add_血气(B_qq, thing_amount)
  } else {
    let thing_exist = await foundthing(thing_name)
    if (!thing_exist) {
      Send(Text(`这方世界没有[${thing_name}]`))
      return false
    }
    let pj = { 劣: 0, 普: 1, 优: 2, 精: 3, 极: 4, 绝: 5, 顶: 6 }
    thing_piji = pj[code[1]]
    if (thing_exist.class == '装备') {
      if (thing_piji) {
        thing_amount = code[2]
      } else {
        thing_piji = 0
      }
    }
    thing_amount = Number(thing_amount)
    if (isNaN(thing_amount)) {
      thing_amount = 1
    }
    await addNajieThing(
      B_qq,
      thing_name,
      thing_exist.class,
      thing_amount,
      thing_piji
    )
  }
  Send(Text(`发放成功,增加${thing_name} x ${thing_amount}`))
})
