import { selects } from '@src/response/index'
import { Text, useSend } from 'alemonjs'
export const regular = /^(#|＃|\/)?一键同步$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  Send(Text('新存储设计不需要同步'))
  return false
})
