import { createEventName } from '@src/response/util'
import { Goweizhi } from 'model'
import { data } from 'api/api'
import { createSelects } from 'alemonjs'

export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)宗门秘境$/

export default onResponse(selects, async e => {
  let addres = '宗门秘境'
  let weizhi = data.guildSecrets_list
  Goweizhi(e, weizhi, addres)
})
