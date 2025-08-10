import { Text, useSend } from 'alemonjs'

import {
  existplayer,
  existNajieThing,
  foundthing,
  readItTyped,
  writeIt,
  readNajie,
  Write_najie
} from '@src/model'
import type { CustomEquipRecord } from '@src/model/duanzaofu'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?赋名.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const user_qq = e.UserId //用户qq
  if (!(await existplayer(user_qq))) return false
  const thing = e.MessageText.replace(/^(#|＃|\/)?赋名/, '')
  const code = thing.split('*')
  const thing_name = code[0] //原物品
  const new_name = code[1] //新名字
  const thingnum = await existNajieThing(user_qq, thing_name, '装备')
  if (!thingnum) {
    Send(Text(`你没有这件装备`))
    return false
  }
  const newname = await foundthing(new_name)
  if (newname) {
    Send(Text(`这个世间已经拥有这把武器了`))
    return false
  }
  if (new_name.length > 8) {
    Send(Text('字符超出最大限制,请重新赋名'))
    return false
  }
  let A: CustomEquipRecord[] = []
  try {
    A = await readItTyped()
  } catch {
    await writeIt([])
  }
  for (const item of A) {
    if (item.name == thing_name) {
      Send(Text(`一个装备只能赋名一次`))
      return false
    }
  }
  const thingall = await readNajie(user_qq)

  for (const item of thingall.装备) {
    if (item.name == thing_name) {
      if (item.atk < 10 && item.def < 10 && item.HP < 10) {
        if (
          item.atk >= 1.5 ||
          item.def >= 1.2 ||
          (item.type == '法宝' && (item.atk >= 1 || item.def >= 1)) ||
          item.atk + item.def > 1.95
        ) {
          item.name = new_name
          // 构造记录（确保必需字段）
          A.push({
            name: item.name,
            type: item.type || '武器',
            atk: Number(item.atk) || 0,
            def: Number(item.def) || 0,
            HP: Number(item.HP) || 0,
            author_name: user_qq
          })
          await Write_najie(user_qq, thingall)
          await writeIt(A)
          Send(Text(`附名成功,您的${thing_name}更名为${new_name}`))
          return false
        }
      }
    }
  }
  Send(Text(`您的装备太弱了,无法赋予名字`))
})
