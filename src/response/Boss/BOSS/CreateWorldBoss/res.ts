import { createEventName } from '@src/response/util'
import { InitWorldBoss } from '../../boss'

export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create'])
export const regular = /^(#|\/)开启妖王$/

export default onResponse(selects, async e => {
  if (!e || e.IsMaster) {
    await InitWorldBoss()
    return false
  }
})
