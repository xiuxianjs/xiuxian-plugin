import { Text, useMention, useSend } from 'alemonjs'

import { createEventName } from '@src/response/util'
import {
  existplayer,
  exist_najie_thing,
  find_qinmidu,
  fstadd_qinmidu,
  add_qinmidu,
  Add_najie_thing
} from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)^赠予百合花篮$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const Mentions = (await useMention(e)[0].findOne()).data
  if (!Mentions || Mentions.length === 0) {
    return // @ 提及为空
  }
  // 查找用户类型的 @ 提及，且不是 bot
  const User = Mentions.find(item => !item.IsBot)
  if (!User) {
    return // 未找到用户Id
  }
  let B = User.UserId
  let A = e.UserId
  let ifexistplay = await existplayer(A)
  if (!ifexistplay) return false
  if (A == B) {
    Send(Text('精神分裂?'))
    return false
  }
  let ifexistplay_B = await existplayer(B)
  if (!ifexistplay_B) {
    Send(Text('修仙者不可对凡人出手!'))
    return false
  }
  let ishavejz = await exist_najie_thing(A, '百合花篮', '道具')
  if (!ishavejz) {
    Send(Text('你没有[百合花篮]'))
    return false
  }
  let pd = await find_qinmidu(A, B)
  if (pd == false) {
    await fstadd_qinmidu(A, B)
  } else if (pd == 0) {
    Send(Text(`对方已有道侣`))
    return false
  }

  await add_qinmidu(A, B, 60)
  await Add_najie_thing(A, '百合花篮', '道具', -1)
  Send(Text(`你们的亲密度增加了60`))
})
