import { InitWorldBoss2 } from '../../../../model/boss'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?开启金角大王$/

const res = onResponse(selects, async e => {
  if (e.IsMaster) {
    await InitWorldBoss2()
  }
})
import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
