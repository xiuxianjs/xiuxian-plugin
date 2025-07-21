import { createEventName } from '@src/response/util'

export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)^(除你禁言|废除).*$/

// export default onResponse(selects, async e => {
//   return false
// })
