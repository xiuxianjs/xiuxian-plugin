import { Text, useSend } from 'alemonjs'

import {
  existplayer,
  readPlayer,
  readForum,
  writeForum,
  addCoin
} from '@src/model/index'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?取消[1-9]d*/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  //固定写法
  const usr_qq = e.UserId
  //有无存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let Forum = []
  const player = await readPlayer(usr_qq)
  const x = parseInt(e.MessageText.replace(/^(#|＃|\/)?取消/, '')) - 1
  try {
    Forum = await readForum()
  } catch {
    //没有表要先建立一个！
    await writeForum([])
  }
  if (x >= Forum.length) {
    Send(Text(`没有编号为${x + 1}的宝贝需求`))
    return false
  }
  //对比qq是否相等
  if (Forum[x].qq != usr_qq) {
    Send(Text('不能取消别人的宝贝需求'))
    return false
  }
  await addCoin(usr_qq, Forum[x].whole)
  Send(
    Text(
      player.名号 +
        '取消' +
        Forum[x].name +
        '成功,返还' +
        Forum[x].whole +
        '灵石'
    )
  )
  Forum.splice(x, 1)
  await writeForum(Forum)
})
