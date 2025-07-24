import { Text, useSend, Image } from 'alemonjs'
import puppeteer from '@src/image/index.js'
import { data } from '@src/api/api'
import { selects } from '@src/response/index'

export const regular = /^(#|＃|\/)?更新日志$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const image = await puppeteer.screenshot('updateRecord', e.UserId, {
    Record: data.updateRecord
  })
  if (!image) {
    Send(Text('更新日志获取失败'))
    return false
  }
  Send(Image(image))
})
