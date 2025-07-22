import { Text, useSend } from 'alemonjs'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)修仙攻略$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  Send(Text('修仙攻略\nhttps://docs.qq.com/doc/DTHhuVnRLWlhjclhC'))
})
