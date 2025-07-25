import { Text, useSend } from 'alemonjs'

import { pushInfo, redis } from '@src/api/api'
import {
  existplayer,
  readPlayer,
  zd_battle,
  writePlayer,
  Add_职业经验
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?讨伐目标.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let A_action: any = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action')
  if (!A_action) {
    A_action = JSON.parse(A_action)
  }
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
  let player = await readPlayer(usr_qq)
  if (player.occupation != '侠客') {
    Send(Text('侠客资质不足,需要进行训练'))
    return false
  }
  let action: any = await redis.get('xiuxian@1.3.0:' + usr_qq + ':shangjing')
  if (action) {
    action = JSON.parse(action)
  }
  if (!action) {
    Send(Text('还没有接取到悬赏,请查看后再来吧')) //没接取悬赏
    return false
  }
  if (action.arm.length == 0) {
    Send(Text('每日限杀,请等待20小时后新的赏金目标')) //悬赏做完了(20h后刷新)
    return false
  }
  let num: any = e.MessageText.replace(/^(#|＃|\/)?讨伐目标/, '')
  num = num.trim() - 1
  let qq
  try {
    qq = action.arm[num].QQ
  } catch {
    Send(Text('不要伤及无辜')) //输错了，没有该目标
    return false
  }
  let last_msg = ''
  if (qq != 1) {
    let player_B: any = await readPlayer(qq)
    player_B.当前血量 = player_B.血量上限

    player_B.法球倍率 = player_B.灵根.法球倍率
    let buff = 1 + player.occupation_level * 0.055
    let player_A = {
      id: player.id,
      名号: player.名号,
      攻击: Math.floor(player.攻击 * buff),
      防御: parseInt(player.防御),
      当前血量: Math.floor(player.血量上限 * buff),
      暴击率: player.暴击率,
      学习的功法: player.学习的功法,
      魔道值: player.魔道值,
      灵根: player.灵根,
      法球倍率: player.灵根.法球倍率,
      仙宠: player.仙宠,
      神石: player.神石
    }
    let Data_battle = await zd_battle(player_A, player_B)
    let msg = Data_battle.msg
    let A_win = `${player_A.名号}击败了${player_B.名号}`
    let B_win = `${player_B.名号}击败了${player_A.名号}`
    if (msg.find(item => item == A_win)) {
      player_B.魔道值 -= 50
      player_B.灵石 -= 1000000
      player_B.当前血量 = 0
      await writePlayer(qq, player_B)
      player.灵石 += action.arm[num].赏金
      player.魔道值 -= 5
      await writePlayer(usr_qq, player)
      await Add_职业经验(usr_qq, 2255)
      last_msg +=
        '【全服公告】' +
        player_B.名号 +
        '失去了1000000灵石,罪恶得到了洗刷,魔道值-50,无名侠客获得了部分灵石,自己的正气提升了,同时获得了更多的悬赏加成'
    } else if (msg.find(item => item == B_win)) {
      let shangjing = Math.trunc(action.arm[num].赏金 * 0.8)
      player.当前血量 = 0
      player.灵石 += shangjing
      player.魔道值 -= 5
      await writePlayer(usr_qq, player)
      await Add_职业经验(usr_qq, 1100)
      last_msg += player_B.名号 + '反杀了你,只获得了部分辛苦钱'
    }
    if (msg.length > 100) {
      logger.info('通过')
    } else {
      // await ForwardMsg(e, msg)
      Send(Text(msg))
    }
  } else {
    player.灵石 += action.arm[num].赏金
    player.魔道值 -= 5
    await writePlayer(usr_qq, player)
    await Add_职业经验(usr_qq, 2255)
    last_msg += '你惩戒了仙路窃贼,获得了部分灵石' //直接获胜
  }
  action.arm.splice(num, 1)
  await redis.set(
    'xiuxian@1.3.0:' + usr_qq + ':shangjing',
    JSON.stringify(action)
  )
  const player_B = await readPlayer(qq)
  if (
    last_msg == '你惩戒了仙路窃贼,获得了部分灵石' ||
    last_msg == player_B.名号 + '反杀了你,只获得了部分辛苦钱'
  ) {
    Send(Text(last_msg))
  } else {
    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
    const groupList = await redis.smembers(redisGlKey)
    for (const group of groupList) {
      const [platform, group_id] = group.split(':')
      pushInfo(platform, group_id, true, last_msg)
    }
  }
})
