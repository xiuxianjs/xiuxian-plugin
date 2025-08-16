import { Image, useSend } from 'alemonjs'
import { selects } from '@src/response/index'
import { getConfig } from '@src/model/Config'
import { screenshot } from '@src/image'
import { COMMAND_NAME, postLogCommand } from '@src/model/posthog'
export const regular = /^(#|＃|\/)??(修仙|仙侠)?帮助(\d+)?$/

export default onResponse(selects, async e => {
  postLogCommand({
    id: e.UserId,
    value: e.MessageText,
    name: COMMAND_NAME.HELP,
    ext: {
      username: e.UserName
    }
  })
  const Send = useSend(e)
  const helpData = await getConfig('help', 'help')

  const n = e.MessageText?.match(/(\d+)/)?.[1]
  const page = !n ? 1 : parseInt(n) > helpData.length ? 1 : parseInt(n)
  const pageSize = 3
  const total = Math.ceil(helpData.length / pageSize)

  const data = helpData.slice((page - 1) * 3, page * 3)
  const img = await screenshot(
    'help',
    `help-${page}`,
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
