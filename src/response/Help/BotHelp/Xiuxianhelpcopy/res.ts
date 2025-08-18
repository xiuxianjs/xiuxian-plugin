import { Image, useSend } from 'alemonjs'
import { selects } from '@src/response/mw'
import { getConfig } from '@src/model'
import { screenshot } from '@src/image'
export const regular = /^(#|＃|\/)?修仙扩展(\d+)?$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const helpData = await getConfig('help', 'help2')
  // data 是一个数组。需要默认按每3组进行分页。
  // 即可 第一页是 0,1,2 第二页是 3,4,5。注意要处理边界情况。
  const page = e.MessageText.match(/(\d+)/)?.[1]
    ? parseInt(e.MessageText.match(/(\d+)/)?.[1] || '1')
    : 1
  const pageSize = 3
  const total = Math.ceil(helpData.length / pageSize)
  const data = helpData.slice((page - 1) * 3, page * 3)
  const img = await screenshot(
    'help',
    `help2-${page}`,
    {
      helpData: data,
      page: page,
      pageSize: pageSize,
      total: total
    },
    true
  )
  if (Buffer.isBuffer(img)) {
    Send(Image(img))
  }
})
