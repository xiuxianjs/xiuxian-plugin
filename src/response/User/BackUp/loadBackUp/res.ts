import { Text, useSend } from 'alemonjs'
import { __PATH } from '@src/model'
import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?读取存档(.*)/
export default onResponse(selects, async (e: any) => {
  const Send = useSend(e)
  if (!e.IsMaster) {
    Send(Text('只有主人可以执行操作'))
    return false
  }
})
