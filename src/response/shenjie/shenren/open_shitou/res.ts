import { Text, useSend } from 'alemonjs'

import { addNajieThing, existNajieThing, existplayer } from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?敲开闪闪发光的石头$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  //查看存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  const x = await existNajieThing(usr_qq, '闪闪发光的石头', '道具')
  if (!x) {
    Send(Text('你没有闪闪发光的石头'))
    return false
  }
  await addNajieThing(usr_qq, '闪闪发光的石头', '道具', -1)
  const random = Math.random()
  let thing
  if (random < 0.5) {
    thing = '神石'
  } else {
    thing = '魔石'
  }
  Send(Text('你打开了石头,获得了' + thing + 'x2'))
  await addNajieThing(usr_qq, thing, '道具', 2)
})
