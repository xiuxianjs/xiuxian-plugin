import { createEventName } from '@src/response/util'
import { LevelMax_up } from '../level'
import { createSelects } from 'alemonjs'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)破体$/

export default onResponse(selects, async e => {
  LevelMax_up(e, false)
})
