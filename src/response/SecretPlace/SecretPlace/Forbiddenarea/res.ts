import { Text, useMessage, Image } from 'alemonjs'
import { selects } from '@src/response/mw'
import mw from '@src/response/mw'
import { screenshot } from '@src/image'
import { getDataList } from '@src/model/DataList'
export const regular = /^(#|＃|\/)?禁地$/

const res = onResponse(selects, async e => {
  const [message] = useMessage(e)
  const image = await screenshot('jindi', e.UserId, {
    didian_list: await getDataList('ForbiddenArea')
  })
  if (!image) {
    message.send(format(Text('图片生成失败')))
    return
  }
  message.send(format(Image(image)))
})
export default onResponse(selects, [mw.current, res.current])
