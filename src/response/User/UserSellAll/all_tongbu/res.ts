import { synchronization, Synchronization_ASS } from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)一键同步$/

export default onResponse(selects, async e => {
  await synchronization(e)
  await Synchronization_ASS(e)
  return false
})
