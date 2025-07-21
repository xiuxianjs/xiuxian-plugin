import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { Go } from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)修仙状态$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let flag = await Go(e)
  if (!flag) {
    return
  }
  Send(Text('空闲中!'))
})
