import { Goweizhi } from '@src/model'
import { data } from '@src/api/api'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?秘境$/

export default onResponse(selects, async e => {
  let addres = '秘境'
  let weizhi = data.didian_list
  await Goweizhi(e, weizhi, addres)
})
