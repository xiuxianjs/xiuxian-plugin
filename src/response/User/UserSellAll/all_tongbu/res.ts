import { createEventName } from '@src/response/util'
import { createSelects } from 'alemonjs'
import { synchronization, Synchronization_ASS } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)一键同步$/

export default onResponse(selects, async e => {
  await synchronization(e)
  await Synchronization_ASS(e)
  return false
})
