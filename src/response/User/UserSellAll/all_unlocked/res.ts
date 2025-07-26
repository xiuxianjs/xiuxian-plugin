import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import { existplayer, Write_najie } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?一键解锁(.*)$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let najie = await await data.getData('najie', usr_qq)
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
  if (e.MessageText != '#一键解锁') {
    let thing = e.MessageText.replace(/^(#|＃|\/)?一键解锁/, '')
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
    for (let l of najie[i]) {
      //纳戒中的数量
      l.islockd = 0
    }
  }
  await Write_najie(usr_qq, najie)
  Send(Text(`一键解锁完成`))
})
