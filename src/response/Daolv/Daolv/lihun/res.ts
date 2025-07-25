import { Text, useMention, useSend } from 'alemonjs'

import { redis } from '@src/api/api'
import {
  existplayer,
  readQinmidu,
  writeQinmidu,
  find_qinmidu,
  readPlayer
} from '@src/model'
import { found, chaoshi } from '../daolv'

import { selects } from '@src/response/index'
import { getDataByUserId } from '@src/model/Redis'
export const regular = /^(#|＃|\/)?^(断绝姻缘)$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let A = e.UserId
  let ifexistplay_A = await existplayer(A)
  if (!ifexistplay_A) {
    return false
  }
  let A_action: any = await getDataByUserId(A, 'action')
  A_action = JSON.parse(A_action)
  if (A_action != null) {
    let now_time = new Date().getTime()
    //人物任务的动作是否结束
    let A_action_end_time = A_action.end_time
    if (now_time <= A_action_end_time) {
      let m = Math.floor((A_action_end_time - now_time) / 1000 / 60)
      let s = Math.floor((A_action_end_time - now_time - m * 60 * 1000) / 1000)
      Send(
        Text('正在' + A_action.action + '中,剩余时间:' + m + '分' + s + '秒')
      )
      return false
    }
  }
  let last_game_timeA = await redis.get(
    'xiuxian@1.3.0:' + A + ':last_game_time'
  )
  if (+last_game_timeA == 0) {
    Send(Text(`猜大小正在进行哦，结束了再来吧!`))
    return false
  }

  const Mentions = (await useMention(e)[0].find({ IsBot: false })).data
  if (!Mentions || Mentions.length === 0) {
    return // @ 提及为空
  }
  // 查找用户类型的 @ 提及，且不是 bot
  const User = Mentions.find(item => !item.IsBot)
  if (!User) {
    return // 未找到用户Id
  }
  let B = User.UserId
  if (A == B) {
    Send(Text('精神分裂?'))
    return false
  }
  let ifexistplay_B = await existplayer(B)
  if (!ifexistplay_B) {
    Send(Text('修仙者不可对凡人出手!'))
    return false
  }
  let B_action: any = await redis.get('xiuxian@1.3.0:' + B + ':action')
  B_action = JSON.parse(B_action)
  if (B_action != null) {
    let now_time = new Date().getTime()
    //人物任务的动作是否结束
    let B_action_end_time = B_action.end_time
    if (now_time <= B_action_end_time) {
      let m = Math.floor((B_action_end_time - now_time) / 1000 / 60)
      let s = Math.floor((B_action_end_time - now_time - m * 60 * 1000) / 1000)
      Send(
        Text(
          '对方正在' + B_action.action + '中,剩余时间:' + m + '分' + s + '秒'
        )
      )
      return false
    }
  }
  let last_game_timeB = await redis.get(
    'xiuxian@1.3.0:' + B + ':last_game_time'
  )
  if (+last_game_timeB == 0) {
    Send(Text(`对方猜大小正在进行哦，等他结束再找他吧!`))
    return false
  }

  let qinmidu = []
  try {
    qinmidu = await readQinmidu()
  } catch {
    //没有建立一个
    await writeQinmidu([])
  }
  let i = await found(A, B)
  let pd = await find_qinmidu(A, B)
  if (pd == false) {
    Send(Text('你们还没建立关系，断个锤子'))
    return false
  } else if (qinmidu[i].婚姻 == 0) {
    Send(Text('你们还没结婚，断个锤子'))
    return false
  }
  if (global.x == 1 || global.x == 2) {
    Send(Text(`有人正在缔结道侣，请稍等`))
    return false
  }
  global.x = 2
  global.user_A = A
  global.user_B = B
  let player_A = await readPlayer(A)
  let msg = ['\n']
  msg.push(`${player_A.名号}要和你断绝姻缘\n回复【我同意】or【我拒绝】`)
  Send(Text(msg.join('')))
  chaoshi(e)
})
