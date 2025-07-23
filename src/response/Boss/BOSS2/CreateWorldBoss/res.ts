import { InitWorldBoss } from '../../boss'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?开启金角大王$/

export default onResponse(selects, async e => {
  if (!e || e.IsMaster) {
    await InitWorldBoss()
  }
})
