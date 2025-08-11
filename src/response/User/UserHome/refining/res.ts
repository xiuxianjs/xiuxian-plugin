import { Text, useSend } from 'alemonjs'

import {
  existplayer,
  foundthing,
  readNajie,
  addNajieThing
} from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?打磨.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  //固定写法
  const usr_qq = e.UserId
  //有无存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let thing_name = e.MessageText.replace(/^(#|＃|\/)?打磨/, '')
  const code = thing_name.split('*')
  thing_name = code[0]
  const thing_exist = await foundthing(thing_name)
  if (!thing_exist) {
    Send(Text(`你在瞎说啥呢?哪来的【${thing_name}】?`))
    return false
  }
  let pj = { 劣: 0, 普: 1, 优: 2, 精: 3, 极: 4, 绝: 5, 顶: 6 }
  pj = pj[code[1]]
  if (
    pj > 5 ||
    (thing_exist.atk < 10 && thing_exist.def < 10 && thing_exist.HP < 10)
  ) {
    Send(Text(`${thing_name}(${code[1]})不支持打磨`))
    return false
  }
  const najie = await readNajie(usr_qq)
  let x = 0
  for (const i of najie['装备']) {
    if (i.name == thing_name && i.pinji == pj) x++
  }
  if (x < 3) {
    Send(Text(`你只有${thing_name}(${code[1]})x${x}`))
    return false
  }
  //都通过了
  for (let i = 0; i < 3; i++)
    await addNajieThing(usr_qq, thing_name, '装备', -1, pj)
  await addNajieThing(usr_qq, thing_name, '装备', 1, pj + 1)
  Send(Text('打磨成功获得' + thing_name))
})
