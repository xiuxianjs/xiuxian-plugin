import { Text, useSend } from 'alemonjs'

import { Go } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?修仙状态$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let flag = await Go(e)
  if (!flag) {
    return
  }
  Send(Text('空闲中!'))
})
