import { Text, useSend, createSelects } from 'alemonjs'
import fs from 'node:fs'
import { createEventName } from '@src/response/util'
import { data } from 'api/api'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)洞天福地列表$/

export default onResponse(selects, async e => {
  let addres = '洞天福地'
  let weizhi = data.bless_list
  GoBlessPlace(e, weizhi, addres)
})
/**
 * 地点查询
 */
async function GoBlessPlace(e, weizhi, addres) {
  const Send = useSend(e)
  let dir = data.filePathMap.association
  let File = fs.readdirSync(dir)
  File = File.filter(file => file.endsWith('.json')) //这个数组内容是所有的宗门名称
  let adr = addres
  let msg = ['***' + adr + '***']
  for (let i = 0; i < weizhi.length; i++) {
    let ass = '无'
    for (let j of File) {
      let this_name = j.replace('.json', '')
      let this_ass = await data.getAssociation(this_name)
      if (this_ass.宗门驻地 == weizhi[i].name) {
        ass = this_ass.宗门名称
        break
      }
    }
    msg.push(
      weizhi[i].name +
        '\n' +
        '等级：' +
        weizhi[i].level +
        '\n' +
        '修炼效率：' +
        weizhi[i].efficiency * 100 +
        '%\n' +
        '入驻宗门：' +
        ass
    )
  }
  Send(Text(msg.join('')))
}
