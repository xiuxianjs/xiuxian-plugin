import { createEventName } from '@src/response/util'
import { createSelects } from 'alemonjs'
import { data } from 'api/api'
import { jindi } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)禁地$/

export default onResponse(selects, async e => {
  let addres = '禁地'
  let weizhi = data.forbiddenarea_list
  await jindi(e, weizhi, addres)
})
