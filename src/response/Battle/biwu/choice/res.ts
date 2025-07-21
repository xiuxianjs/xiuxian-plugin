import { Text, useSend } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { data } from '@src/api/api'
export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)选择技能.*$/

export default onResponse(selects, async e => {
  const A_QQ = global.A_QQ
  const B_QQ = global.B_QQ
  const Send = useSend(e)
  let jineng_name = e.MessageText.replace('#选择技能', '')
  let code = jineng_name.split(',')
  let msg = []
  if (A_QQ.some(item => item.QQ == e.UserId)) {
    for (let j of A_QQ) {
      if (j.QQ == e.UserId) {
        code = code.slice(0, 3)
        for (let m in code) {
          j[`选择技能`].push(
            JSON.parse(
              JSON.stringify(
                data.jineng.find(item => item.name == j.技能[+code[m] - 1])
              )
            )
          )
          msg.push(j.技能[+code[m] - 1])
        }
      }
    }
    Send(Text(`本场战斗支持以下技能\n${msg}`))
    return false
  } else if (B_QQ.some(item => item.QQ == e.UserId)) {
    for (let j of B_QQ) {
      if (j.QQ == e.UserId) {
        code = code.slice(0, 3)
        for (let m in code) {
          j[`选择技能`].push(
            JSON.parse(
              JSON.stringify(
                data.jineng.find(item => item.name == j.技能[+code[m] - 1])
              )
            )
          )
          msg.push(j.技能[+code[m] - 1])
        }
      }
    }
    Send(Text(`本场战斗支持以下技能\n${msg}`))
    return false
  }
})
