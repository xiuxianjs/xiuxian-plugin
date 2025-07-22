import { data } from '@src/api/api'
import { jindi } from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)禁地$/

export default onResponse(selects, async e => {
  let addres = '禁地'
  let weizhi = data.forbiddenarea_list
  await jindi(e, weizhi, addres)
})
