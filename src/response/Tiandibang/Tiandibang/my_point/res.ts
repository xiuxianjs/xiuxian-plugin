import { Text, useSend } from 'alemonjs'

import { existplayer } from '@src/model'
import { Read_tiandibang, Write_tiandibang } from '../tian'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)天地榜$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //查看存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let tiandibang
  try {
    tiandibang = await Read_tiandibang()
  } catch {
    //没有表要先建立一个！
    await Write_tiandibang([])
    tiandibang = await Read_tiandibang()
  }
  let x = tiandibang.length
  let l = 10
  let msg = ['***天地榜(每日免费三次)***\n       周一0点清空积分']
  for (let i = 0; i < tiandibang.length; i++) {
    if (tiandibang[i].qq == usr_qq) {
      x = i
      break
    }
  }
  if (x == tiandibang.length) {
    Send(Text('请先报名!'))
    return false
  }
  if (l > tiandibang.length) {
    l = tiandibang.length
  }
  if (x < l) {
    for (let m = 0; m < l; m++) {
      msg.push(
        '名次：' +
          (m + 1) +
          '\n名号：' +
          tiandibang[m].名号 +
          '\n积分：' +
          tiandibang[m].积分
      )
    }
  } else if (x >= l && tiandibang.length - x < l) {
    for (let m = tiandibang.length - l; m < tiandibang.length; m++) {
      msg.push(
        '名次：' +
          (m + 1) +
          '\n名号：' +
          tiandibang[m].名号 +
          '\n积分：' +
          tiandibang[m].积分
      )
    }
  } else {
    for (let m = x - 5; m < x + 5; m++) {
      msg.push(
        '名次：' +
          (m + 1) +
          '\n名号：' +
          tiandibang[m].名号 +
          '\n积分：' +
          tiandibang[m].积分
      )
    }
  }
  // await ForwardMsg(e, msg)
  Send(Text(msg.join('\n')))
})
