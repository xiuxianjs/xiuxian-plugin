import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import {
  existplayer,
  readNajie,
  foundthing,
  convert2integer,
  existNajieThing,
  addNajieThing,
  addCoin
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?出售.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  //命令判断
  let thing = e.MessageText.replace(/^(#|＃|\/)?出售/, '')
  let code: any = thing.split('*')
  let thing_name = code[0] //物品
  code[0] = parseInt(code[0])
  let thing_amount = code[1] //数量
  let thing_piji
  //判断列表中是否存在，不存在不能卖,并定位是什么物品
  let najie = await readNajie(usr_qq)
  if (code[0]) {
    if (code[0] > 1000) {
      try {
        thing_name = najie.仙宠[code[0] - 1001].name
      } catch {
        Send(Text('仙宠代号输入有误!'))
        return false
      }
    } else if (code[0] > 100) {
      try {
        thing_name = najie.装备[code[0] - 101].name
        code[1] = najie.装备[code[0] - 101].pinji
      } catch {
        Send(Text('装备代号输入有误!'))
        return false
      }
    }
  }
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
      let equ = najie.装备.find(item => item.name == thing_name)
      if (!equ) {
        Send(Text(`你没有[${thing_name}]这样的${thing_exist.class}`))
        return false
      }
      for (let i of najie.装备) {
        //遍历列表有没有比那把强的
        if (i.name == thing_name && i.pinji < equ.pinji) {
          equ = i
        }
      }
      thing_piji = equ.pinji
    }
  }
  thing_amount = await convert2integer(thing_amount)
  let x = await existNajieThing(
    usr_qq,
    thing_name,
    thing_exist.class,
    thing_piji
  )
  //判断戒指中是否存在
  if (!x) {
    //没有
    Send(Text(`你没有[${thing_name}]这样的${thing_exist.class}`))
    return false
  }
  //判断戒指中的数量
  if (x < thing_amount) {
    //不够
    Send(Text(`你目前只有[${thing_name}]*${x}`))
    return false
  }
  //数量够,数量减少,灵石增加
  await addNajieThing(
    usr_qq,
    thing_name,
    thing_exist.class,
    -thing_amount,
    thing_piji
  )
  let commodities_price
  commodities_price = thing_exist.出售价 * thing_amount
  if (data.zalei.find(item => item.name == thing_name.replace(/[0-9]+/g, ''))) {
    let sell = najie.装备.find(
      item => item.name == thing_name && thing_piji == item.pinji
    )
    commodities_price = sell.出售价 * thing_amount
  }
  await addCoin(usr_qq, commodities_price)
  Send(
    Text(
      `出售成功!  获得${commodities_price}灵石,还剩余${thing_name}*${
        x - thing_amount
      } `
    )
  )
})
