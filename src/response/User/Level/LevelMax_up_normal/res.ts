import { LevelMax_up } from '../level'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)破体$/

export default onResponse(selects, async e => {
  LevelMax_up(e, false)
})
