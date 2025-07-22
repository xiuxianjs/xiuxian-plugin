import { Text, useSend } from 'alemonjs'

import { existplayer, looktripod, Read_mytripod } from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)我的锻炉/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const user_qq = e.UserId
  if (!(await existplayer(user_qq))) return false
  const A = await looktripod(user_qq)
  if (A != 1) {
    Send(Text(`请先去#炼器师能力评测,再来煅炉吧`))
    return false
  }

  let a = await Read_mytripod(user_qq)

  if (a.材料.length == 0) {
    Send(Text(`锻炉里空空如也,没什么好看的`))
    return false
  }
  let shuju = []
  let shuju2 = []
  let xuanze = 0
  let b = '您的锻炉里,拥有\n'
  for (let item in a.材料) {
    for (let item1 in shuju) {
      if (shuju[item1] == a.材料[item]) {
        shuju2[item1] = shuju2[item1] * 1 + a.数量[item] * 1
        xuanze = 1
      }
    }
    if (xuanze == 0) {
      shuju.push(a.材料[item])
      shuju2.push(a.数量[item])
    } else {
      xuanze = 0
    }
    //不要问我为啥不在前面优化，问就是懒，虽然确实前面优化会加快机器人反应速度
  }
  for (let item2 in shuju) {
    b += shuju[item2] + shuju2[item2] + '个\n'
  }
  Send(Text(b))
})
