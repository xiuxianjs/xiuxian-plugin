import { Text, useSend } from 'alemonjs'
import { __PATH, writePlayer } from '@src/model'
import { data } from '@src/model/api'
import { selects } from '@src/response/index'
import { redis } from '@src/model/api'

export const regular = /^(#|＃|\/)?解散宗门.*$/
export default onResponse(selects, async e => {
  const Send = useSend(e)
  {
    if (!e.IsMaster) return false
    const didian = e.MessageText.replace(/^(#|＃|\/)?解散宗门/, '').trim()
    if (didian == '') {
      Send(Text('请输入要解散的宗门名称'))
      return false
    }
    const ass = await redis.get(`${__PATH.association}:${didian}`)
    if (!ass) {
      Send(Text('该宗门不存在'))
      return false
    }
    for (const qq of ass.所有成员) {
      const player = await await data.getData('player', qq)
      if (player.宗门) {
        if (player.宗门.宗门名称 == didian) {
          delete player.宗门
          await writePlayer(qq, player)
        }
      }
    }
    await redis.del(`${__PATH.association}:${didian}`)
    Send(Text('解散成功!'))
    return false
  }
})
