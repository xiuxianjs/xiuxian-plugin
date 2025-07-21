import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { Read_tiandibang, Write_tiandibang, re_bangdang } from '../tian'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)清空积分/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) {
    Send(Text('只有主人可以执行操作'))
    return false
  }
  try {
    await Read_tiandibang()
  } catch {
    //没有表要先建立一个！
    await Write_tiandibang([])
  }
  await re_bangdang()
  Send(Text('积分已经重置！'))
  return false
})
