import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
// import { data } from 'api/api'
// import { exist_najie_thing, Add_najie_thing } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)^(禁言术|残云封天剑).*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  Send(Text('待开发'))
  // return
  //   let usr_qq = e.UserId //使用者QQ

  //   const Mentions = await useMention(event)
  //   if (!Mentions || Mentions.length === 0) {
  //     return // @ 提及为空
  //   }
  //   // 查找用户类型的 @ 提及，且不是 bot
  //   const User = Mentions.find(item => !item.IsBot)
  //   if (!User) {
  //     return // 未找到用户Id
  //   }
  //   let qq = User.UserId

  //   //判断双方是否有档
  //   let ifexistplay = data.existData('player', usr_qq)
  //   let ifexistplay1 = data.existData('player', qq)
  //   if (!ifexistplay) return false
  //   if (!ifexistplay1) return false
  //   let GayCD = {}
  //   const cd = 2 //设置冷却时间，单位为分钟
  // let id = e.ChannelId + e.UserId
  //   if (GayCD[id]) {
  //     Send(Text(`残云封天剑有${cd}分钟冷却时间!`))
  //     return false
  //   }

  //   let player = data.getData('player', usr_qq) //读取用户修仙信息
  //   let player1 = data.getData('player', qq) //读取用户修仙信息
  //   let qingdianshu = await exist_najie_thing(usr_qq, '剑帝一剑', '道具')
  //   if (qingdianshu !== false && qingdianshu !== 0) {
  //     //判断纳戒有没有剑帝信物
  //     let num1 = Math.round(Math.random() * 100 * 1.1) //能跑就行，暂时不用在意取名细节
  //     let num2 = Math.round((Math.random() * 100) / 1.1)
  //     let num3 = Math.random()
  //     let num4 = Math.random()
  //     await Add_najie_thing(usr_qq, '剑帝一剑', '道具', -1)

  //     if (num1 < num2) {
  //       if (num3 > num4) {
  //         Send(Text(`剑帝一剑【残云封天】，封！`))
  //         e.group.muteMember(qq, num2 * 6)
  //       } else if (num3 < num4) {
  //         Send(Text(`虚空中出现一只大手，砍出一剑，${player1.名号}没有了动静`))
  //         e.group.muteMember(qq, num2 * 9)
  //       } else {
  //         Send(Text(
  //           `${user_id}${player.名号}一手按压在剑帝信物上，一道剑光从剑帝信物上发出，化成符文冲入${qq}${player1.名号}口中，封！`
  //         ))
  //         e.group.muteMember(qq, num2 * 8)
  //       }
  //     } else if (num1 > num2) {
  //       if (num3 > num4) {
  //         Send(Text(`斩！`))
  //         e.group.muteMember(qq, num2)
  //       } else if (num3 < num4) {
  //         Send(Text(`残云封天剑封！`))
  //         e.group.muteMember(qq, num2 * 8)
  //       } else {
  //         Send(Text(
  //           `一手按压在剑帝信物上，一道剑光从剑帝信物上发出，化成符文冲入${qq}${player1.名号}口中，封！`
  //         ))
  //         e.group.muteMember(qq, num2 * 8)
  //       }
  //     } else {
  //       Send(Text(`修仙之人不讲武德！,同归于尽！`)
  //       e.group.muteMember(usr_qq, num2 * 2)
  //       e.group.muteMember(qq, num2)
  //     }

  //     GayCD[id] = true

  //     GayCD[id] = setTimeout(() => {
  //       if (GayCD[id]) {
  //         delete GayCD[id]
  //       }
  //     }, cd * 60 * 1000)
  //     //执行的逻辑功能

  //     return false
  //   } else {
  //     Send(Text(`你并没有【剑帝一剑】，请通过人界秘境获取`))
  //   }
})
