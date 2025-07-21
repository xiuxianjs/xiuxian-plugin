import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import {
  existplayer,
  foundthing,
  Read_najie,
  Add_najie_thing,
  Add_灵石
} from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)回收.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  //固定写法
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let thing_name = e.MessageText.replace('#回收', '')
  thing_name = thing_name.trim()
  let thing_exist = await foundthing(thing_name)
  if (thing_exist) {
    Send(Text(`${thing_name}可以使用,不需要回收`))
    return false
  }
  let lingshi: any = 0
  let najie = await Read_najie(usr_qq)
  let type = [
    '装备',
    '丹药',
    '道具',
    '功法',
    '草药',
    '材料',
    '仙宠',
    '仙宠口粮'
  ]
  for (let i of type) {
    let thing = najie[i].find(item => item.name == thing_name)
    if (thing) {
      if (thing.class == '材料' || thing.class == '草药') {
        lingshi += thing.出售价 * thing.数量
      } else {
        lingshi += thing.出售价 * 2 * thing.数量
      }
      await Add_najie_thing(
        usr_qq,
        thing.name,
        thing.class,
        -thing.数量,
        thing.pinji
      )
    }
  }
  await Add_灵石(usr_qq, lingshi)
  Send(Text(`回收成功,获得${lingshi}灵石`))
})
