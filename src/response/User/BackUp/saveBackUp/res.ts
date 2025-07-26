import { Text, useSend } from 'alemonjs'
import { __PATH } from '@src/model'
import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?备份存档$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  Send(Text('新存储系统不需要备份存档'))
})
