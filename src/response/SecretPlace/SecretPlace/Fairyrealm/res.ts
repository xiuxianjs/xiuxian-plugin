import { data } from '@src/model/api'
import { Goweizhi } from '@src/model/image'
import { selects } from '@src/response/index'

export const regular = /^(#|＃|\/)?仙境$/
export default onResponse(selects, async e => {
  const addres = '仙境'
  const weizhi = data.Fairyrealm_list
  await Goweizhi(e, weizhi, addres)
})
