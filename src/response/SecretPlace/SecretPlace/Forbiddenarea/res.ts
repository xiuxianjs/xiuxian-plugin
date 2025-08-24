import { Text, useMessage, Image } from 'alemonjs'
import { data } from '@src/model/api'
import { selects } from '@src/response/mw'
import mw from '@src/response/mw'
import { screenshot } from '@src/image'
export const regular = /^(#|＃|\/)?禁地$/

const res = onResponse(selects, async e => {
  const [message] = useMessage(e)
  const image = await screenshot('jindi', e.UserId, {
    didian_list: data.forbiddenarea_list
  })
  if (!image) {
    message.send(format(Text('图片生成失败')))
    return
  }
  message.send(format(Image(image)))
})
export default onResponse(selects, [mw.current, res.current])
