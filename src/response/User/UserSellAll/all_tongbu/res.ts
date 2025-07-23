import { synchronization, Synchronization_ASS } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?一键同步$/

export default onResponse(selects, async e => {
  await synchronization(e)
  await Synchronization_ASS(e)
  return false
})
