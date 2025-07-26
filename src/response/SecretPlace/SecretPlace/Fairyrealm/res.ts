import { data } from '@src/api/api'
import { Goweizhi } from '@src/model/image'
import { selects } from '@src/response/index'

export const regular = /^(#|＃|\/)?仙境$/
export default onResponse(selects, async e => {
  let addres = '仙境'
  let weizhi = data.Fairyrealm_list
  await Goweizhi(e, weizhi, addres)
})
