import { data } from '@src/model/api'
import { Goweizhi } from '@src/model/image'
import { selects } from '@src/response/index'

export const regular = /^(#|＃|\/)?秘境$/
export default onResponse(selects, async e => {
  const addres = '秘境'
  const weizhi = data.didian_list
  await Goweizhi(e, weizhi, addres)
})
