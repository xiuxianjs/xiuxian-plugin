import { Text, useMessage, Image } from 'alemonjs'
import { data, puppeteer, redis } from '@src/model/api'
import { selects } from '@src/response/index'
import { __PATH } from '@src/model/index'

export const regular = /^(#|＃|\/)?洞天福地列表$/
export default onResponse(selects, async e => {
  const weizhi = data.bless_list
  const [message] = useMessage(e)
  const keys = await redis.keys(`${__PATH.association}:*`)
  const File = keys.map(key => key.replace(`${__PATH.association}:`, ''))
  const msg = []
  for (let i = 0; i < weizhi.length; i++) {
    let ass = '无'
    for (const j of File) {
      const this_name = j
      const this_ass = await await data.getAssociation(this_name)
      if (this_ass.宗门驻地 == weizhi[i].name) {
        ass = this_ass.宗门名称
        break
      } else {
        ass = '无'
        continue
      }
    }
    msg.push({
      name: weizhi[i].name,
      level: weizhi[i].level,
      efficiency: weizhi[i].efficiency * 100,
      ass: ass
    })
  }
  const image = await puppeteer.screenshot('BlessPlace', e.UserId, {
    didian_list: msg
  })
  if (!image) {
    message.send(format(Text('图片生成失败')))
    return
  }
  message.send(format(Image(image)))
})
