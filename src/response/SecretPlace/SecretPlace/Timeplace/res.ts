import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)仙府$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  Send(Text('仙府乃民间传说之地,请自行探索'))
})
