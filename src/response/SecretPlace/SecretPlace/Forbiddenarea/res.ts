
import { Text, useMessage, Image } from 'alemonjs'
import { data, puppeteer, redis } from '@src/api/api'
import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?禁地$/

export default onResponse(selects, async e => {
  const [message] = useMessage(e)
  const image = await puppeteer.screenshot('jindi', e.UserId, {
      didian_list: data.forbiddenarea_list
  })
  if (!image) {
    message.send(format(Text('图片生成失败')))
    return
  }
  message.send(format(Image(image)))
})
