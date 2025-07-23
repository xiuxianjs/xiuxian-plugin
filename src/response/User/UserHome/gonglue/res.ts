import { Text, useSend } from 'alemonjs'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)修仙攻略$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  Send(Text('修仙攻略\nhttps://docs.qq.com/doc/DTHhuVnRLWlhjclhC'))
})
