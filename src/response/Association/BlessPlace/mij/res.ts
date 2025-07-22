import { Goweizhi } from '@src/model'
import { data } from '@src/api/api'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)宗门秘境$/

export default onResponse(selects, async e => {
  let addres = '宗门秘境'
  let weizhi = data.guildSecrets_list
  Goweizhi(e, weizhi, addres)
})
