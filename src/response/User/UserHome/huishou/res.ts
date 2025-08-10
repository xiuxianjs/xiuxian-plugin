import { Text, useSend } from 'alemonjs'

import {
  existplayer,
  foundthing,
  readNajie,
  addNajieThing,
  addCoin
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?回收.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  //固定写法
  const usr_qq = e.UserId
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let thing_name = e.MessageText.replace(/^(#|＃|\/)?回收/, '')
  thing_name = thing_name.trim()
  const thing_exist = await foundthing(thing_name)
  if (thing_exist) {
    Send(Text(`${thing_name}可以使用,不需要回收`))
    return false
  }
  let lingshi: any = 0
  const najie = await readNajie(usr_qq)
  const type = [
    '装备',
    '丹药',
    '道具',
    '功法',
    '草药',
    '材料',
    '仙宠',
    '仙宠口粮'
  ]
  for (const i of type) {
    const thing = najie[i].find(item => item.name == thing_name)
    if (thing) {
      if (thing.class == '材料' || thing.class == '草药') {
        lingshi += thing.出售价 * thing.数量
      } else {
        lingshi += thing.出售价 * 2 * thing.数量
      }
      await addNajieThing(
        usr_qq,
        thing.name,
        thing.class,
        -thing.数量,
        thing.pinji
      )
    }
  }
  await addCoin(usr_qq, lingshi)
  Send(Text(`回收成功,获得${lingshi}灵石`))
})
