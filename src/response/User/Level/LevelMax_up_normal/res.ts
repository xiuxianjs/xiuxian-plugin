import { LevelMax_up } from '../level'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?破体$/

export default onResponse(selects, async e => {
  LevelMax_up(e, false)
})
