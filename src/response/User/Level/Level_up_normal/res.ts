import { Level_up } from '../level'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)突破$/

export default onResponse(selects, async e => {
  Level_up(e, false)
})
