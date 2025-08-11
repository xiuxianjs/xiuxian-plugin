import { Text, useSend } from 'alemonjs'

import { convert2integer } from '@src/model/utils/number'
import { foundthing } from '@src/model/cultivation'
import { existNajieThing, addNajieThing } from '@src/model/najie'
import { addCoin } from '@src/model/economy'
import { readExchange, writeExchange } from '@src/model/trade'
import { existplayer, readNajie, readPlayer } from '@src/model/xiuxian_impl'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?上架.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  //固定写法
  const usr_qq = e.UserId
  //判断是否为匿名创建存档
  //有无存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  const najie = await readNajie(usr_qq)
  const thing = e.MessageText.replace(/^(#|＃|\/)?上架/, '')
  const code = thing.split('*')
  let thing_name = code[0] //物品
  code[0] = parseInt(code[0])
  let thing_value = code[1] //价格
  let thing_amount = code[2] //数量
  let thing_piji //品级
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
      } catch {
        Send(Text('装备代号输入有误!'))
        return false
      }
    }
  }
  //判断列表中是否存在，不存在不能卖,并定位是什么物品
  const thing_exist = await foundthing(thing_name)
  if (!thing_exist) {
    Send(Text(`这方世界没有[${thing_name}]`))
    return false
  }
  //确定数量和品级
  const pj = { 劣: 0, 普: 1, 优: 2, 精: 3, 极: 4, 绝: 5, 顶: 6 }
  let equ
  thing_piji = pj[code[1]]
  if (thing_exist.class == '装备') {
    if (thing_piji) {
      thing_value = code[2]
      thing_amount = code[3]
      equ = najie.装备.find(
        item => item.name == thing_name && item.pinji == thing_piji
      )
    } else {
      const najie = await readNajie(usr_qq)
      equ = najie.装备.find(item => item.name == thing_name)
      for (const i of najie.装备) {
        //遍历列表有没有比那把强的
        if (i.name == thing_name && i.pinji < equ.pinji) {
          equ = i
        }
      }
      thing_piji = equ.pinji
    }
  } else if (thing_exist.class == '仙宠') {
    equ = najie.仙宠.find(item => item.name == thing_name)
  }
  thing_value = await convert2integer(thing_value)
  thing_amount = await convert2integer(thing_amount)
  const x = await existNajieThing(
    usr_qq,
    thing_name,
    thing_exist.class,
    thing_piji
  )
  //判断戒指中是否存在
  if (!x || x < thing_amount) {
    Send(Text(`你没有那么多[${thing_name}]`))
    return false
  }
  let Exchange = []
  try {
    Exchange = await readExchange()
  } catch {
    await writeExchange([])
  }
  const now_time = Date.now()
  const whole = Math.trunc(thing_value * thing_amount)
  let off = Math.trunc(whole * 0.03)
  if (off < 100000) off = 100000
  const player = await readPlayer(usr_qq)
  if (player.灵石 < off) {
    Send(Text('就这点灵石还想上架'))
    return false
  }
  await addCoin(usr_qq, -off)
  let wupin
  if (thing_exist.class == '装备' || thing_exist.class == '仙宠') {
    const pinji2 = ['劣', '普', '优', '精', '极', '绝', '顶']
    const pj = pinji2[thing_piji]
    wupin = {
      qq: usr_qq,
      name: equ,
      price: thing_value,
      pinji2: thing_piji,
      pinji: pj,
      aconut: thing_amount,
      whole: whole,
      now_time: now_time
    }
    await addNajieThing(
      usr_qq,
      equ.name,
      thing_exist.class,
      -thing_amount,
      thing_piji
    )
  } else {
    wupin = {
      qq: usr_qq,
      name: thing_exist,
      price: thing_value,
      aconut: thing_amount,
      whole: whole,
      now_time: now_time
    }
    await addNajieThing(usr_qq, thing_name, thing_exist.class, -thing_amount)
  }
  //
  Exchange.push(wupin)
  //写入
  await writeExchange(Exchange)
  Send(Text('上架成功！'))
})
