import { Text, useMessage, Image, useSend } from 'alemonjs'
import { data, puppeteer, redis } from '@src/api/api'

import { selects } from '@src/response/index'
import { __PATH } from '@src/model'
export const regular = /^(#|＃|\/)?洞天福地列表$/

export default onResponse(selects, async e => {
  let addres = '洞天福地'
  let weizhi = data.bless_list
  GoBlessPlace(e, weizhi, addres)
})
/**
 * 地点查询
 */
async function GoBlessPlace(e, weizhi, addres) {
  const [message] = useMessage(e)
  const keys = await redis.keys(`${__PATH.association}:*`)
  const File = keys.map(key => key.replace(`${__PATH.association}:`, ''))
  const msg = []
  for (let i = 0; i < weizhi.length; i++) {
    let ass = '无'
    for (let j of File) {
      let this_name = j
      let this_ass = await data.getAssociation(this_name)
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
    // msg.push(
    //   weizhi[i].name +
    //     '\n' +
    //     '等级：' +
    //     weizhi[i].level +
    //     '\n' +
    //     '修炼效率：' +
    //     weizhi[i].efficiency * 100 +
    //     '%\n' +
    //     '入驻宗门：' +
    //     ass
    // )
  }
  const image = await puppeteer.screenshot('BlessPlace', e.UserId, {
    didian_list: msg
  })
  if (!image) {
    message.send(format(Text('图片生成失败')))
    return
  }
  message.send(format(Image(image)))
}
