import { createEventName } from '@src/response/util'
import { Goweizhi } from '@src/model'
import { data } from '@src/api/api'
import { createSelects } from 'alemonjs'
export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)仙境$/

export default onResponse(selects, async e => {
  let addres = '仙境'
  let weizhi = data.Fairyrealm_list
  await Goweizhi(e, weizhi, addres)
})
