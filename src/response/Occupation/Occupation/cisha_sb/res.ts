import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { pushInfo, redis } from '@src/api/api'
import {
  existplayer,
  Read_player,
  exist_najie_thing,
  zd_battle,
  Write_player
} from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)刺杀目标.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let A_action: any = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action')
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
  let action: any = await redis.get('xiuxian@1.3.0:' + 1 + ':shangjing')
  action = await JSON.parse(action)
  let num: any = e.MessageText.replace('#刺杀目标', '')
  num = num.trim() - 1
  let qq
  try {
    qq = action[num].QQ
  } catch {
    Send(Text('不要伤及无辜')) //输错了，没有该目标
    return false
  }
  if (qq == usr_qq) {
    Send(Text('咋的，自己干自己？'))
    return false
  }
  let player = await Read_player(usr_qq)
  let buff = 1
  if (player.occupation == '侠客') {
    buff = 1 + player.occupation_level * 0.055
  }
  let last_msg = ''
  let player_B = await Read_player(qq)
  if (player_B.当前血量 == 0) {
    Send(Text(`对方已经没有血了,请等一段时间再刺杀他吧`))
    return false
  }
  let B_action: any = await redis.get('xiuxian@1.3.0:' + qq + ':action')
  B_action = JSON.parse(B_action)
  if (B_action != null) {
    let now_time = new Date().getTime()
    //人物任务的动作是否结束
    let B_action_end_time = B_action.end_time
    if (now_time <= B_action_end_time) {
      let ishaveyss = await exist_najie_thing(usr_qq, '隐身水', '道具')
      if (!ishaveyss) {
        //如果A没有隐身水，直接返回不执行
        let m = Math.floor((B_action_end_time - now_time) / 1000 / 60)
        let s = Math.floor(
          (B_action_end_time - now_time - m * 60 * 1000) / 1000
        )
        Send(
          Text(
            '对方正在' + B_action.action + '中,剩余时间:' + m + '分' + s + '秒'
          )
        )
        return false
      }
    }
  }
  player_B.法球倍率 = player_B.灵根.法球倍率
  player_B.当前血量 = player_B.血量上限
  let player_A = {
    id: player.id,
    名号: player.名号,
    攻击: Math.floor(player.攻击 * buff),
    防御: parseInt(player.防御),
    当前血量: parseInt(player.血量上限),
    暴击率: player.暴击率,
    学习的功法: player.学习的功法,
    灵根: player.灵根,
    魔道值: player.魔道值,
    神石: player.神石,
    法球倍率: player.灵根.法球倍率,
    仙宠: player.仙宠
  }
  let Data_battle = await zd_battle(player_A, player_B)
  let msg = Data_battle.msg
  let A_win = `${player_A.名号}击败了${player_B.名号}`
  let B_win = `${player_B.名号}击败了${player_A.名号}`
  if (msg.find(item => item == A_win)) {
    player_B.当前血量 = 0
    player_B.修为 -= action[num].赏金
    await Write_player(qq, player_B)
    player.灵石 += Math.trunc(action[num].赏金 * 0.3)
    await Write_player(usr_qq, player)
    last_msg +=
      '【全服公告】' + player_B.名号 + '被' + player.名号 + '悄无声息的刺杀了'
    //优化下文案，比如xxx在刺杀xxx中
    action.splice(num, 1)
    await redis.set('xiuxian@1.3.0:' + 1 + ':shangjing', JSON.stringify(action))
  } else if (msg.find(item => item == B_win)) {
    player.当前血量 = 0
    await Write_player(usr_qq, player)
    last_msg +=
      '【全服公告】' +
      player.名号 +
      '刺杀失败,' +
      player_B.名号 +
      '勃然大怒,单手就反杀了' +
      player.名号 //优化下文案，比如xxx在刺杀xxx中
  }
  if (msg.length > 100) {
    console.log('通过')
  } else {
    // await ForwardMsg(e, msg)
    Send(Text(msg))
  }
  const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
  const groupList = await redis.smembers(redisGlKey)
  for (const group of groupList) {
    const [platform, group_id] = group.split(':')
    pushInfo(platform, group_id, true, last_msg)
  }
  return false
})
