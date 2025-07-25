import { Text, useMention, useSend } from 'alemonjs'

import { config, data, redis } from '@src/api/api'
import {
  existplayer,
  readPlayer,
  isNotNull,
  existNajieThing,
  addNajieThing,
  zd_battle,
  Add_HP,
  writePlayer
} from '@src/model'

import { selects } from '@src/response/index'
import { getDataByUserId } from '@src/model/Redis'
export const regular = /^(#|＃|\/)?^打劫$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const nowDate = new Date()
  const todayDate = new Date(nowDate)
  const { openHour, closeHour } = config.getConfig('xiuxian', 'xiuxian')
  const todayTime = todayDate.setHours(0, 0, 0, 0)
  const openTime = todayTime + openHour * 60 * 60 * 1000
  const nowTime1 = nowDate.getTime()
  const closeTime = todayTime + closeHour * 60 * 60 * 1000
  if (!(nowTime1 < openTime || nowTime1 > closeTime)) {
    Send(Text(`这个时间由星阁阁主看管,还是不要张扬较好`))
    return false
  }

  //得到主动方qq
  let A = e.UserId

  //先判断
  let ifexistplay_A = await existplayer(A)
  if (!ifexistplay_A) {
    return false
  }

  //得到redis游戏状态
  let last_game_timeA = await redis.get(
    'xiuxian@1.3.0:' + A + ':last_game_time'
  )
  //设置游戏状态
  if (+last_game_timeA == 0) {
    Send(Text(`猜大小正在进行哦!`))
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
  let B = User.UserId //被打劫者

  //先判断存档！
  let ifexistplay_B = await existplayer(B)
  if (!ifexistplay_B) {
    Send(Text('不可对凡人出手!'))
    return false
  }

  //出手的
  //读取信息
  let playerAA = await readPlayer(A)
  //境界
  let now_level_idAA
  if (!isNotNull(playerAA.level_id)) {
    Send(Text('请先#同步信息'))
    return false
  }
  now_level_idAA = data.Level_list.find(
    item => item.level_id == playerAA.level_id
  ).level_id

  //对方
  //读取信息
  let playerBB = await readPlayer(B)
  //境界
  //根据名字取找境界id

  let now_level_idBB

  if (!isNotNull(playerBB.level_id)) {
    Send(Text('对方为错误存档！'))
    return false
  }

  now_level_idBB = data.Level_list.find(
    item => item.level_id == playerBB.level_id
  ).level_id

  //A是仙人，B不是仙人
  if (now_level_idAA > 41 && now_level_idBB <= 41) {
    Send(Text(`仙人不可对凡人出手！`))
    return false
  }

  //A是修仙者，B不是
  if (now_level_idAA >= 12 && now_level_idBB < 12) {
    Send(Text(`不可欺负弱小！`))
    return false
  }

  if (A == B) {
    Send(Text('咋的，自己弄自己啊？'))
    return false
  }
  let playerA = await data.getData('player', A)
  let playerB = await data.getData('player', B)
  if (isNotNull(playerA.宗门) && isNotNull(playerB.宗门)) {
    let assA = await data.getAssociation(playerA.宗门.宗门名称)
    let assB = await data.getAssociation(playerB.宗门.宗门名称)
    if (assA.宗门名称 == assB.宗门名称) {
      Send(Text('门派禁止内讧'))
      return false
    }
  }

  let A_action_res = await getDataByUserId(A, 'action')
  const A_action = JSON.parse(A_action_res)
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

  let last_game_timeB = await redis.get(
    'xiuxian@1.3.0:' + B + ':last_game_time'
  )
  if (+last_game_timeB == 0) {
    Send(Text(`对方猜大小正在进行哦，等他赚够了再打劫也不迟!`))
    return false
  }

  let isBbusy = false //给B是否忙碌加个标志位，用来判断要不要扣隐身水

  let B_action_res = await redis.get('xiuxian@1.3.0:' + B + ':action')
  const B_action = JSON.parse(B_action_res)
  if (B_action != null) {
    let now_time = new Date().getTime()
    //人物任务的动作是否结束
    let B_action_end_time = B_action.end_time
    if (now_time <= B_action_end_time) {
      isBbusy = true
      let ishaveyss = await existNajieThing(A, '隐身水', '道具')
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

  let now = new Date()
  let nowTime = now.getTime() //获取当前时间戳
  let last_dajie_time: any = await redis.get(
    'xiuxian@1.3.0:' + A + ':last_dajie_time'
  ) //获得上次打劫的时间戳,
  last_dajie_time = parseInt(last_dajie_time)
  const cf = config.getConfig('xiuxian', 'xiuxian')
  let robTimeout = Math.floor(60000 * cf.CD.rob)
  if (nowTime < last_dajie_time + robTimeout) {
    let waittime_m = Math.trunc(
      (last_dajie_time + robTimeout - nowTime) / 60 / 1000
    )
    let waittime_s = Math.trunc(
      ((last_dajie_time + robTimeout - nowTime) % 60000) / 1000
    )
    Send(Text('打劫正在CD中，' + `剩余cd:  ${waittime_m}分 ${waittime_s}秒`))
    return false
  }
  let A_player = await readPlayer(A)
  let B_player = await readPlayer(B)
  if (A_player.修为 < 0) {
    Send(Text(`还是闭会关再打劫吧`))
    return false
  }
  if (B_player.当前血量 < 20000) {
    Send(Text(`${B_player.名号} 重伤未愈,就不要再打他了`))
    return false
  }
  if (B_player.灵石 < 30002) {
    Send(Text(`${B_player.名号} 穷得快赶上水脚脚了,就不要再打他了`))
    return false
  }
  let final_msg = []

  //这里前戏做完,确定要开打了

  if (isBbusy) {
    //如果B忙碌,自动扣一瓶隐身水强行打架,奔着人道主义关怀,提前判断了不是重伤
    final_msg.push(
      `${B_player.名号}正在${B_action.action}，${A_player.名号}利用隐身水悄然接近，但被发现。`
    )
    await addNajieThing(A, '隐身水', '道具', -1)
  } else {
    final_msg.push(`${A_player.名号}向${B_player.名号}发起了打劫。`)
  }
  //本次打劫时间存入缓存
  await redis.set('xiuxian@1.3.0:' + A + ':last_dajie_time', nowTime) //存入缓存
  A_player.法球倍率 = A_player.灵根.法球倍率
  B_player.法球倍率 = B_player.灵根.法球倍率

  let Data_battle = await zd_battle(A_player, B_player)
  let msg = Data_battle.msg
  //战斗回合过长会导致转发失败报错，所以超过30回合的就不转发了
  if (msg.length > 35) {
  } else {
    // await ForwardMsg(e, msg)
    Send(Text(msg))
  }
  //下面的战斗超过100回合会报错
  await Add_HP(A, Data_battle.A_xue)
  await Add_HP(B, Data_battle.B_xue)
  let A_win = `${A_player.名号}击败了${B_player.名号}`
  let B_win = `${B_player.名号}击败了${A_player.名号}`
  if (msg.find(item => item == A_win)) {
    if (
      (await existNajieThing(B, '替身人偶', '道具')) &&
      B_player.魔道值 < 1 &&
      (B_player.灵根.type == '转生' || B_player.level_id > 41)
    ) {
      Send(Text(B_player.名号 + '使用了道具替身人偶,躲过了此次打劫'))
      await addNajieThing(B, '替身人偶', '道具', -1)
      return false
    }
    let mdzJL = A_player.魔道值
    let lingshi: any = Math.trunc(B_player.灵石 / 5)
    let qixue = Math.trunc(100 * now_level_idAA)
    let mdz = Math.trunc(lingshi / 10000)
    if (lingshi >= B_player.灵石) {
      lingshi = B_player.灵石 / 2
    }
    A_player.灵石 += lingshi
    B_player.灵石 -= lingshi
    A_player.血气 += qixue
    A_player.魔道值 += mdz
    A_player.灵石 += mdzJL
    await writePlayer(A, A_player)
    await writePlayer(B, B_player)
    final_msg.push(
      ` 经过一番大战,${A_win},成功抢走${lingshi}灵石,${A_player.名号}获得${qixue}血气，`
    )
  } else if (msg.find(item => item == B_win)) {
    if (A_player.灵石 < 30002) {
      let qixue = Math.trunc(100 * now_level_idBB)
      B_player.血气 += qixue
      await writePlayer(B, B_player)
      let time2 = 60 //时间（分钟）
      let action_time2 = 60000 * time2 //持续时间，单位毫秒
      let action2: any = await redis.get('xiuxian@1.3.0:' + A + ':action')
      action2 = await JSON.parse(action2)
      action2.action = '禁闭'
      action2.end_time = new Date().getTime() + action_time2
      await redis.set('xiuxian@1.3.0:' + A + ':action', JSON.stringify(action2))
      final_msg.push(
        `经过一番大战,${A_player.名号}被${B_player.名号}击败了,${B_player.名号}获得${qixue}血气,${A_player.名号} 真是偷鸡不成蚀把米,被关禁闭60分钟`
      )
    } else {
      let lingshi: any = Math.trunc(A_player.灵石 / 4)
      let qixue = Math.trunc(100 * now_level_idBB)
      if (lingshi <= 0) {
        lingshi = 0
      }
      A_player.灵石 -= lingshi
      B_player.灵石 += lingshi
      B_player.血气 += qixue
      await writePlayer(A, A_player)
      await writePlayer(B, B_player)
      final_msg.push(
        `经过一番大战,${A_player.名号}被${B_player.名号}击败了,${B_player.名号}获得${qixue}血气,${A_player.名号} 真是偷鸡不成蚀把米,被劫走${lingshi}灵石`
      )
    }
  } else {
    Send(Text(`战斗过程出错`))
    return false
  }
  Send(Text(final_msg.join('')))
})
