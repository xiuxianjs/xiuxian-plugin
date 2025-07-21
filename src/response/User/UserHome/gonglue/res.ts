import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)修仙攻略$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  Send(Text('修仙攻略\nhttps://docs.qq.com/doc/DTHhuVnRLWlhjclhC'))
})
