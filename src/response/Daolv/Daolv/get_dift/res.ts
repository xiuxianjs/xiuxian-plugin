import { Text, useMention, useSend } from 'alemonjs'

import {
  existplayer,
  existNajieThing,
  findQinmidu,
  fstaddQinmidu,
  addQinmidu,
  addNajieThing
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?^赠予百合花篮$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const Mentions = (await useMention(e)[0].find({ IsBot: false })).data
  if (!Mentions || Mentions.length === 0) {
    return // @ 提及为空
  }
  // 查找用户类型的 @ 提及，且不是 bot
  const User = Mentions.find(item => !item.IsBot)
  if (!User) {
    return // 未找到用户Id
  }
  const B = User.UserId
  const A = e.UserId
  const ifexistplay = await existplayer(A)
  if (!ifexistplay) return false
  if (A == B) {
    Send(Text('精神分裂?'))
    return false
  }
  const ifexistplay_B = await existplayer(B)
  if (!ifexistplay_B) {
    Send(Text('修仙者不可对凡人出手!'))
    return false
  }
  const ishavejz = await existNajieThing(A, '百合花篮', '道具')
  if (!ishavejz) {
    Send(Text('你没有[百合花篮]'))
    return false
  }
  const pd = await findQinmidu(A, B)
  if (pd == false) {
    await fstaddQinmidu(A, B)
  } else if (pd == 0) {
    Send(Text(`对方已有道侣`))
    return false
  }

  await addQinmidu(A, B, 60)
  await addNajieThing(A, '百合花篮', '道具', -1)
  Send(Text(`你们的亲密度增加了60`))
})
