import { createEventName } from '@src/response/util'
import { Level_up } from '../level'

export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)突破$/

export default onResponse(selects, async e => {
  Level_up(e, false)
})
