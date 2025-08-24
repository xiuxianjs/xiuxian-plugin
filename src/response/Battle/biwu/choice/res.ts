import { Text, useSend } from 'alemonjs'

import { selects } from '@src/response/mw'
import mw from '@src/response/mw'
import { biwuPlayer } from '../biwu'
import { getDataList } from '@src/model/DataList'
export const regular = /^(#|＃|\/)?选择技能.*$/

const res = onResponse(selects, async e => {
  const A_QQ = biwuPlayer.A_QQ
  const B_QQ = biwuPlayer.B_QQ
  const Send = useSend(e)
  const jineng_name = e.MessageText.replace(/^(#|＃|\/)?选择技能/, '')
  let code = jineng_name.split(',')
  const msg = []

  const data = {
    Jineng: await getDataList('Jineng')
  }

  if (A_QQ.some(item => item.QQ == e.UserId)) {
    for (const j of A_QQ) {
      if (j.QQ == e.UserId) {
        code = code.slice(0, 3)
        for (const m in code) {
          j[`选择技能`].push(
            JSON.parse(
              JSON.stringify(
                data.Jineng.find(item => item.name == j.技能[+code[m] - 1])
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
    for (const j of B_QQ) {
      if (j.QQ == e.UserId) {
        code = code.slice(0, 3)
        for (const m in code) {
          j[`选择技能`].push(
            JSON.parse(
              JSON.stringify(
                data.Jineng.find(item => item.name == j.技能[+code[m] - 1])
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

export default onResponse(selects, [mw.current, res.current])
