import { Text, useSend } from 'alemonjs'
import fs from 'fs'
import { __PATH } from '@src/model'
import { writePlayer } from '@src/model'
import { data } from '@src/api/api'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?解散宗门.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  {
    if (!e.IsMaster) return false

    let didian = e.MessageText.replace(/^(#|＃|\/)?解散宗门/, '').trim()

    let ass = data.getAssociation(didian)
    if (ass == 'error') {
      Send(Text('该宗门不存在'))
      return false
    }
    for (let qq of ass.所有成员) {
      let player = await data.getData('player', qq)
      if (player.宗门) {
        if (player.宗门.宗门名称 == didian) {
          delete player.宗门
          await writePlayer(qq, player)
        }
      }
    }
    fs.rmSync(`${__PATH.association}/${didian}.json`)
    Send(Text('解散成功!'))
    return false
  }
})
