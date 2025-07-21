import { createEventName } from '@src/response/util'
import { Goweizhi } from '@src/model'
import { data } from '@src/api/api'
import { createSelects } from 'alemonjs'
export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)秘境$/

export default onResponse(selects, async e => {
  let addres = '秘境'
  let weizhi = data.didian_list
  await Goweizhi(e, weizhi, addres)
})
