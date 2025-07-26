import { Text, useSend } from 'alemonjs'
import { __PATH } from '@src/model'
import { selects } from '@src/response/index'

export const regular = /^(#|＃|\/)?检查存档.*$/
export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) {
    Send(Text('只有主人可以执行操作'))
    return false
  }
  Send(Text('新存档不需要进行检查...'))
})
