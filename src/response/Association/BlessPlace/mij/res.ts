// import { Goweizhi } from '@src/model'
import { data } from '@src/model/api'
import { Goweizhi } from '@src/model/image'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?宗门秘境$/

export default onResponse(selects, async e => {
  const addres = '宗门秘境'
  const weizhi = data.guildSecrets_list
  Goweizhi(e, weizhi, addres)
})
