import { InitWorldBoss } from '../../boss'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)开启金角大王$/

export default onResponse(selects, async e => {
  if (!e || e.IsMaster) {
    await InitWorldBoss()
  }
})
