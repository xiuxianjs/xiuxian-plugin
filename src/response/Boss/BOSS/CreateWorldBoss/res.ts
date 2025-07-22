import { InitWorldBoss } from '../../boss'

export const selects = onSelects(['message.create'])
export const regular = /^(#|\/)开启妖王$/

export default onResponse(selects, async e => {
  if (!e || e.IsMaster) {
    await InitWorldBoss()
    return false
  }
})
