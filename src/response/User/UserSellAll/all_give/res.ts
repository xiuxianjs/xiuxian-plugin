import { Text, useMention, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import { existplayer, addNajieThing } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?一键赠送(.*)$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  //这是自己的
  let A_qq = e.UserId
  //自己没存档
  let ifexistplay = await existplayer(A_qq)
  if (!ifexistplay) return false
  //对方
  const [mention] = useMention(e)

  // 查找用户类型的 @ 提及，且不是 bot
  const User = await mention.findOne()
  if (!User) {
    return // 未找到用户Id
  }
  // todo: 获取艾特用户的QQ号
  let B_qq = User.code //对方qq
  //对方没存档
  ifexistplay = await existplayer(B_qq)
  if (!ifexistplay) {
    Send(Text(`此人尚未踏入仙途`))
    return false
  }
  let A_najie = await await data.getData('najie', A_qq)
  let wupin = [
    '装备',
    '丹药',
    '道具',
    '功法',
    '草药',
    '材料',
    '仙宠',
    '仙宠口粮'
  ]
  let wupin1 = []
  if (e.MessageText != '#一键赠送') {
    let thing = e.MessageText.replace(/^(#|＃|\/)?一键赠送/, '')
    for (let i of wupin) {
      if (thing == i) {
        wupin1.push(i)
        thing = thing.replace(i, '')
      }
    }
    if (thing.length == 0) {
      wupin = wupin1
    } else {
      return false
    }
  }
  for (let i of wupin) {
    for (let l of A_najie[i]) {
      if (l && l.islockd == 0) {
        let quantity = l.数量
        //纳戒中的数量
        if (i == '装备' || i == '仙宠') {
          await addNajieThing(B_qq, l, l.class, quantity, l.pinji)
          await addNajieThing(A_qq, l, l.class, -quantity, l.pinji)
          continue
        }
        await addNajieThing(A_qq, l.name, l.class, -quantity)
        await addNajieThing(B_qq, l.name, l.class, quantity)
      }
    }
  }
  Send(Text(`一键赠送完成`))
})
