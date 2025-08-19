import { InitWorldBoss2 } from '../../../../model/boss'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?开启金角大王$/

export default onResponse(selects, async e => {
  if (e.IsMaster) {
    await InitWorldBoss2()
  }
})
