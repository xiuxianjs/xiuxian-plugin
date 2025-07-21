import { Text, useSend } from 'alemonjs'

import { createEventName } from '@src/response/util'
import {
  existplayer,
  exist_najie_thing,
  foundthing,
  Read_it,
  Writeit,
  Read_najie,
  Write_najie
} from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)赋名.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const user_qq = e.UserId //用户qq
  if (!(await existplayer(user_qq))) return false
  let thing = e.MessageText.replace('#', '')
  thing = thing.replace('赋名', '')
  const code = thing.split('*')
  const thing_name = code[0] //原物品
  let new_name = code[1] //新名字
  const thingnum = await exist_najie_thing(user_qq, thing_name, '装备')
  if (!thingnum) {
    Send(Text(`你没有这件装备`))
    return false
  }
  const newname = await foundthing(new_name)
  if (newname) {
    Send(Text(`这个世间已经拥有这把武器了`))
    return false
  }
  if (newname.length > 8) {
    Send(Text('字符超出最大限制,请重新赋名'))
    return false
  }
  let A
  try {
    A = await Read_it()
  } catch {
    await Writeit([])
    A = await Read_it()
  }
  for (let item of A) {
    if (item.name == thing_name) {
      Send(Text(`一个装备只能赋名一次`))
      return false
    }
  }
  const thingall = await Read_najie(user_qq)

  for (let item of thingall.装备) {
    if (item.name == thing_name) {
      if (item.atk < 10 && item.def < 10 && item.HP < 10) {
        if (
          item.atk >= 1.5 ||
          item.def >= 1.2 ||
          (item.type == '法宝' && (item.atk >= 1 || item.def >= 1)) ||
          item.atk + item.def > 1.95
        ) {
          item.name = new_name
          A.push(item)
          await Write_najie(user_qq, thingall)
          await Writeit(A)
          Send(Text(`附名成功,您的${thing_name}更名为${new_name}`))
          return false
        }
      }
    }
  }
  Send(Text(`您的装备太弱了,无法赋予名字`))
})
