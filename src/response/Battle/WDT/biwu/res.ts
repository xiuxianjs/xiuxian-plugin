import { Text, useMention, useSend } from 'alemonjs'

import { redis, data, config } from '@src/model/api'
import { notUndAndNull } from '@src/model/common'
import { zdBattle } from '@src/model/battle'
import { addHP, addExp2, addCoin } from '@src/model/economy'
import { existNajieThing } from '@src/model/najie'
import { existplayer, readPlayer } from '@src/model/xiuxian_impl'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?^比武$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  //得到主动方qq
  const A = e.UserId

  //先判断
  const ifexistplay_A = await existplayer(A)
  if (!ifexistplay_A) {
    return
  }

  //看看状态

  //得到redis游戏状态
  const last_game_timeA = await redis.get(
    'xiuxian@1.3.0:' + A + ':last_game_time'
  )
  //设置游戏状态
  if (+last_game_timeA == 0) {
    Send(Text(`猜大小正在进行哦!`))
    return true
  }

  //判断对方
  const Mentions = (await useMention(e)[0].find({ IsBot: false })).data
  if (!Mentions || Mentions.length === 0) {
    return // @ 提及为空
  }
  // 查找用户类型的 @ 提及，且不是 bot
  const User = Mentions.find(item => !item.IsBot)
  if (!User) {
    return // 未找到用户Id
  }
  const B = User.UserId //被打者

  //先判断存档！
  const ifexistplay_B = await existplayer(B)
  if (!ifexistplay_B) {
    Send(Text('不可对凡人出手!'))
    return
  }

  //出手的
  //读取信息
  const playerAA = await readPlayer(A)
  //境界
  if (!notUndAndNull(playerAA.level_id)) {
    Send(Text('请先#同步信息'))
    return
  }
  const now_level_idAA = data.Level_list.find(
    item => item.level_id == playerAA.level_id
  ).level_id

  //对方
  //读取信息
  const playerBB = await readPlayer(B)
  //境界
  //根据名字取找境界id

  if (!notUndAndNull(playerBB.level_id)) {
    Send(Text('对方为错误存档！'))
    return
  }
  const now_level_idBB = data.Level_list.find(
    item => item.level_id == playerBB.level_id
  ).level_id

  if (A == B) {
    Send(Text('咋的，自娱自乐？'))
    return
  }
  const A_action_res = await redis.get('xiuxian@1.3.0:' + A + ':action')
  const A_action = JSON.parse(A_action_res)
  if (A_action != null) {
    const now_time = Date.now()
    //人物任务的动作是否结束
    const A_action_end_time = A_action.end_time
    if (now_time <= A_action_end_time) {
      const m = Math.floor((A_action_end_time - now_time) / 1000 / 60)
      const s = Math.floor(
        (A_action_end_time - now_time - m * 60 * 1000) / 1000
      )
      Send(
        Text('正在' + A_action.action + '中,剩余时间:' + m + '分' + s + '秒')
      )
      return
    }
  }

  const last_game_timeB = await redis.get(
    'xiuxian@1.3.0:' + B + ':last_game_time'
  )
  if (+last_game_timeB == 0) {
    Send(Text(`对方猜大小正在进行哦，等他结束再来比武吧!`))
    return true
  }

  // 给B是否忙碌原有标志位移除（未使用）
  const B_action_res = await redis.get('xiuxian@1.3.0:' + B + ':action')
  const B_action = JSON.parse(B_action_res)
  if (B_action != null) {
    const now_time = Date.now()
    //人物任务的动作是否结束
    const B_action_end_time = B_action.end_time
    if (now_time <= B_action_end_time) {
      const ishaveyss = await existNajieThing(A, '剑xx', '道具')
      if (!ishaveyss) {
        //如果A没有隐身水，直接返回不执行
        const m = Math.floor((B_action_end_time - now_time) / 1000 / 60)
        const s = Math.floor(
          (B_action_end_time - now_time - m * 60 * 1000) / 1000
        )
        Send(
          Text(
            '对方正在' + B_action.action + '中,剩余时间:' + m + '分' + s + '秒'
          )
        )
        return
      }
    }
  }
  const cf = config.getConfig('xiuxian', 'xiuxian')

  const now = new Date()
  const nowTime = now.getTime() //获取当前时间戳
  const last_biwu_time_raw = await redis.get(
    'xiuxian@1.3.0:' + A + ':last_biwu_time'
  ) //获得上次打劫的时间戳,
  const last_biwu_time = parseInt(last_biwu_time_raw ?? '0', 10)
  const robTimeout = Math.floor(60000 * cf.CD.biwu)
  if (nowTime < last_biwu_time + robTimeout) {
    const waittime_m = Math.trunc(
      (last_biwu_time + robTimeout - nowTime) / 60 / 1000
    )
    const waittime_s = Math.trunc(
      ((last_biwu_time + robTimeout - nowTime) % 60000) / 1000
    )
    Send(Text('比武正在CD中，' + `剩余cd:  ${waittime_m}分 ${waittime_s}秒`))
    return
  }

  const B_player = await readPlayer(B)
  const A_player = await readPlayer(A)
  const Time = cf.CD.couple //6个小时
  const shuangxiuTimeout = Math.floor(60000 * Time)
  const now_Time = Date.now() //获取当前时间戳
  const last_timeA_raw = await redis.get(
    'xiuxian@1.3.0:' + A + ':last_biwu_time'
  ) //获得上次的时间戳,
  const last_timeA = parseInt(last_timeA_raw ?? '0', 10)
  if (now_Time < last_timeA + shuangxiuTimeout) {
    const Couple_m = Math.trunc(
      (last_timeA + shuangxiuTimeout - now_Time) / 60 / 1000
    )
    const Couple_s = Math.trunc(
      ((last_timeA + shuangxiuTimeout - now_Time) % 60000) / 1000
    )
    Send(Text(`比武冷却:  ${Couple_m}分 ${Couple_s}秒`))
    return
  }

  const last_timeB_raw = await redis.get(
    'xiuxian@1.3.0:' + B + ':last_biwu_time'
  ) //获得上次的时间戳,
  const last_timeB = parseInt(last_timeB_raw ?? '0', 10)
  if (now_Time < last_timeB + shuangxiuTimeout) {
    const Couple_m = Math.trunc(
      (last_timeB + shuangxiuTimeout - now_Time) / 60 / 1000
    )
    const Couple_s = Math.trunc(
      ((last_timeB + shuangxiuTimeout - now_Time) % 60000) / 1000
    )
    Send(Text(`对方比武冷却:  ${Couple_m}分 ${Couple_s}秒`))
    return
  }
  if (B_player.当前血量 <= B_player.血量上限 / 1.2) {
    Send(Text(`${B_player.名号} 血量未满，不能趁人之危哦`))
    return
  }
  if (A_player.当前血量 <= A_player.血量上限 / 1.2) {
    Send(Text(`你血量未满，对方不想趁人之危`))
    return
  }
  const final_msg = []
  //  if (A_player.魔道值>100) {Send(Text(`${A_player.名号}你一个大魔头还妄想和人堂堂正正比武？`);return;}

  await redis.set('xiuxian@1.3.0:' + A + ':last_biwu_time', now_Time)
  await redis.set('xiuxian@1.3.0:' + B + ':last_biwu_time', now_Time)
  //这里前戏做完,确定要开打了
  final_msg.push(`${A_player.名号}向${B_player.名号}发起了比武！`)

  A_player.法球倍率 = A_player.灵根.法球倍率
  B_player.法球倍率 = B_player.灵根.法球倍率

  const Data_battle = await zdBattle(A_player, B_player)
  const msg = Data_battle.msg
  //战斗回合过长会导致转发失败报错，所以超过30回合的就不转发了
  if (msg.length > 35) {
    logger.info('通过')
  } else {
    // await ForwardMsg(e, msg)
    Send(Text(msg.join('\n')))
  }
  //下面的战斗超过100回合会报错
  await addHP(A, Data_battle.A_xue)
  await addHP(B, Data_battle.B_xue)
  const A_win = `${A_player.名号}击败了${B_player.名号}`
  const B_win = `${B_player.名号}击败了${A_player.名号}`
  if (msg.find(item => item == A_win)) {
    const qixue = Math.trunc(1000 * now_level_idBB)
    const qixue2 = Math.trunc(500 * now_level_idAA)
    const JL = Math.trunc(10 * now_level_idAA)
    await addExp2(A, qixue)
    await addExp2(B, qixue2)
    await addCoin(A, JL)
    await addCoin(B, JL)
    const A_player = await readPlayer(A)
    interface PlayerWithMD {
      魔道值?: number
    }
    const A_player_md = A_player as PlayerWithMD
    A_player_md.魔道值 = (A_player_md.魔道值 || 0) + 1
    data.setData('player', A, A_player)
    final_msg.push(
      ` 经过一番大战,${A_win}获得了胜利,${A_player.名号}获得${qixue}气血，${B_player.名号}获得${qixue2}气血，双方都获得了${JL}的灵石。`
    )
  } else if (msg.find(item => item == B_win)) {
    const qixue = Math.trunc(500 * now_level_idBB)
    const qixue2 = Math.trunc(1000 * now_level_idAA)
    const JL = Math.trunc(10 * now_level_idAA)
    await addExp2(A, qixue)
    await addExp2(B, qixue2)
    await addCoin(A, JL)
    await addCoin(B, JL)
    const B_player = await readPlayer(B)
    interface PlayerWithMD {
      魔道值?: number
    }
    const B_player_md = B_player as PlayerWithMD
    B_player_md.魔道值 = (B_player_md.魔道值 || 0) + 1
    data.setData('player', B, B_player)
    final_msg.push(
      `经过一番大战,${B_win}获得了胜利,${B_player.名号}获得${qixue2}气血，${A_player.名号}获得${qixue}气血，双方都获得了${JL}的灵石。`
    )
  } else {
    Send(Text(`战斗过程出错`))
    return
  }
  Send(Text(final_msg.join('')))
  //本次打劫时间存入缓存
  await redis.set('xiuxian@1.3.0:' + A + ':last_biwu_time', nowTime) //存入缓存
})
