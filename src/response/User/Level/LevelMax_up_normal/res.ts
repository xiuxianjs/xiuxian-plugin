import { LevelMax_up } from '../level'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?破体$/

const res = onResponse(selects, async e => {
  LevelMax_up(e, false)
})
import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
