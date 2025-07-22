import { Text, useSend } from 'alemonjs'

import {
  existplayer,
  Read_player,
  Read_Forum,
  Write_Forum,
  Add_灵石
} from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)取消[1-9]d*/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  //固定写法
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let Forum
  let player = await Read_player(usr_qq)
  let x = parseInt(e.MessageText.replace('#取消', '')) - 1
  try {
    Forum = await Read_Forum()
  } catch {
    //没有表要先建立一个！
    await Write_Forum([])
    Forum = await Read_Forum()
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
  await Add_灵石(usr_qq, Forum[x].whole)
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
  await Write_Forum(Forum)
})
