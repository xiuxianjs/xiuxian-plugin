import { Text, useSend, Image } from 'alemonjs'
import { screenshot } from '@src/image/index.js'
import { data } from '@src/model/api'
import { selects } from '@src/response/index'

export const regular = /^(#|＃|\/)?更新日志$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const image = await screenshot('updateRecord', e.UserId, {
    Record: data.updateRecord
  })
  if (Buffer.isBuffer(image)) {
    Send(Image(image))
    return
  }
  Send(Text('更新日志获取失败'))
})
