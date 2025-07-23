import { Text, useSend } from 'alemonjs'

import { redis } from '@src/api/api'
import {
  existplayer,
  shijianc,
  exist_najie_thing,
  Add_najie_thing,
  zd_battle,
  Add_灵石
} from '@src/model'
import { Read_tiandibang, Write_tiandibang, getLastbisai } from '../tian'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?比试$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  //获取游戏状态
  let game_action: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':game_action'
  )
  //防止继续其他娱乐行为
  if (+game_action == 0) {
    Send(Text('修仙：游戏进行中...'))
    return false
  }
  //查询redis中的人物动作
  let action: any = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action')
  action = JSON.parse(action)
  if (action != null) {
    //人物有动作查询动作结束时间
    let action_end_time = action.end_time
    let now_time = new Date().getTime()
    if (now_time <= action_end_time) {
      let m = Math.floor((action_end_time - now_time) / 1000 / 60)
      let s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000)
      Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'))
      return false
    }
  }
  let tiandibang
  try {
    tiandibang = await Read_tiandibang()
  } catch {
    //没有表要先建立一个！
    await Write_tiandibang([])
    tiandibang = await Read_tiandibang()
  }
  let x = tiandibang.length
  for (let m = 0; m < tiandibang.length; m++) {
    if (tiandibang[m].qq == usr_qq) {
      x = m
      break
    }
  }
  if (x == tiandibang.length) {
    Send(Text('请先报名!'))
    return false
  }
  let last_msg = []
  let atk = 1
  let def = 1
  let blood = 1
  let now = new Date()
  let nowTime = now.getTime() //获取当前日期的时间戳
  let Today = await shijianc(nowTime)
  let lastbisai_time = await getLastbisai(usr_qq) //获得上次签到日期
  if (
    Today.Y != lastbisai_time.Y ||
    Today.M != lastbisai_time.M ||
    Today.D != lastbisai_time.D
  ) {
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':lastbisai_time', nowTime) //redis设置签到时间
    tiandibang[x].次数 = 3
  }
  if (
    Today.Y == lastbisai_time.Y &&
    Today.M == lastbisai_time.M &&
    Today.D == lastbisai_time.D &&
    tiandibang[x].次数 < 1
  ) {
    let zbl = await exist_najie_thing(usr_qq, '摘榜令', '道具')
    if (zbl) {
      tiandibang[x].次数 = 1
      await Add_najie_thing(usr_qq, '摘榜令', '道具', -1)
      last_msg.push(`${tiandibang[x].名号}使用了摘榜令\n`)
    } else {
      Send(Text('今日挑战次数用光了,请明日再来吧'))
      return false
    }
  }
  Write_tiandibang(tiandibang)
  let lingshi
  tiandibang = await Read_tiandibang()
  if (x != 0) {
    let k
    for (k = x - 1; k >= 0; k--) {
      if (tiandibang[x].境界 > 41) break
      else {
        if (tiandibang[k].境界 > 41) {
          continue
        } else break
      }
    }
    let B_player
    if (k != -1) {
      if (tiandibang[k].攻击 / tiandibang[x].攻击 > 2) {
        atk = 2
        def = 2
        blood = 2
      } else if (tiandibang[k].攻击 / tiandibang[x].攻击 > 1.6) {
        atk = 1.6
        def = 1.6
        blood = 1.6
      } else if (tiandibang[k].攻击 / tiandibang[x].攻击 > 1.3) {
        atk = 1.3
        def = 1.3
        blood = 1.3
      }
      B_player = {
        名号: tiandibang[k].名号,
        攻击: tiandibang[k].攻击,
        防御: tiandibang[k].防御,
        当前血量: tiandibang[k].当前血量,
        暴击率: tiandibang[k].暴击率,
        学习的功法: tiandibang[k].学习的功法,
        灵根: tiandibang[k].灵根,
        法球倍率: tiandibang[k].法球倍率
      }
    }
    let A_player = {
      名号: tiandibang[x].名号,
      攻击: parseInt(tiandibang[x].攻击) * atk,
      防御: Math.floor(tiandibang[x].防御 * def),
      当前血量: Math.floor(tiandibang[x].当前血量 * blood),
      暴击率: tiandibang[x].暴击率,
      学习的功法: tiandibang[x].学习的功法,
      灵根: tiandibang[x].灵根,
      法球倍率: tiandibang[x].法球倍率
    }
    if (k == -1) {
      atk = 0.8 + 0.4 * Math.random()
      def = 0.8 + 0.4 * Math.random()
      blood = 0.8 + 0.4 * Math.random()
      B_player = {
        名号: '灵修兽',
        攻击: parseInt(tiandibang[x].攻击) * atk,
        防御: Math.floor(tiandibang[x].防御 * def),
        当前血量: Math.floor(tiandibang[x].当前血量 * blood),
        暴击率: tiandibang[x].暴击率,
        学习的功法: tiandibang[x].学习的功法,
        灵根: tiandibang[x].灵根,
        法球倍率: tiandibang[x].法球倍率
      }
    }
    let Data_battle = await zd_battle(A_player, B_player)
    let msg = Data_battle.msg
    let A_win = `${A_player.名号}击败了${B_player.名号}`
    let B_win = `${B_player.名号}击败了${A_player.名号}`
    if (msg.find(item => item == A_win)) {
      if (k == -1) {
        tiandibang[x].积分 += 1500
        lingshi = tiandibang[x].积分 * 8
      } else {
        tiandibang[x].积分 += 2000
        lingshi = tiandibang[x].积分 * 4
      }
      tiandibang[x].次数 -= 1
      last_msg.push(
        `${A_player.名号}击败了[${B_player.名号}],当前积分[${tiandibang[x].积分}],获得了[${lingshi}]灵石`
      )
      Write_tiandibang(tiandibang)
    } else if (msg.find(item => item == B_win)) {
      if (k == -1) {
        tiandibang[x].积分 += 800
        lingshi = tiandibang[x].积分 * 6
      } else {
        tiandibang[x].积分 += 1000
        lingshi = tiandibang[x].积分 * 2
      }
      tiandibang[x].次数 -= 1
      last_msg.push(
        `${A_player.名号}被[${B_player.名号}]打败了,当前积分[${tiandibang[x].积分}],获得了[${lingshi}]灵石`
      )
      Write_tiandibang(tiandibang)
    } else {
      Send(Text(`战斗过程出错`))
      return false
    }
    await Add_灵石(usr_qq, lingshi)
    if (msg.length > 50) {
      logger.info('通过')
    } else {
      // await ForwardMsg(e, msg)
      Send(Text(msg))
    }
    Send(Text(last_msg.join('\n')))
  } else {
    let A_player = {
      名号: tiandibang[x].名号,
      攻击: tiandibang[x].攻击,
      防御: tiandibang[x].防御,
      当前血量: tiandibang[x].当前血量,
      暴击率: tiandibang[x].暴击率,
      学习的功法: tiandibang[x].学习的功法,
      灵根: tiandibang[x].灵根,
      法球倍率: tiandibang[x].法球倍率
    }
    atk = 0.8 + 0.4 * Math.random()
    def = 0.8 + 0.4 * Math.random()
    blood = 0.8 + 0.4 * Math.random()
    let B_player = {
      名号: '灵修兽',
      攻击: parseInt(tiandibang[x].攻击) * atk,
      防御: Math.floor(tiandibang[x].防御 * def),
      当前血量: Math.floor(tiandibang[x].当前血量 * blood),
      暴击率: tiandibang[x].暴击率,
      学习的功法: tiandibang[x].学习的功法,
      灵根: tiandibang[x].灵根,
      法球倍率: tiandibang[x].法球倍率
    }
    let Data_battle = await zd_battle(A_player, B_player)
    let msg = Data_battle.msg
    let A_win = `${A_player.名号}击败了${B_player.名号}`
    let B_win = `${B_player.名号}击败了${A_player.名号}`
    if (msg.find(item => item == A_win)) {
      tiandibang[x].积分 += 1500
      tiandibang[x].次数 -= 1
      lingshi = tiandibang[x].积分 * 8
      last_msg.push(
        `${A_player.名号}击败了[${B_player.名号}],当前积分[${tiandibang[x].积分}],获得了[${lingshi}]灵石`
      )
      Write_tiandibang(tiandibang)
    } else if (msg.find(item => item == B_win)) {
      tiandibang[x].积分 += 800
      tiandibang[x].次数 -= 1
      lingshi = tiandibang[x].积分 * 6
      last_msg.push(
        `${A_player.名号}被[${B_player.名号}]打败了,当前积分[${tiandibang[x].积分}],获得了[${lingshi}]灵石`
      )
      Write_tiandibang(tiandibang)
    } else {
      Send(Text(`战斗过程出错`))
      return false
    }
    await Add_灵石(usr_qq, lingshi)
    if (msg.length > 50) {
      logger.info('通过')
    } else {
      // await ForwardMsg(e, msg)
      Send(Text(msg))
    }
    Send(Text(last_msg.join('\n')))
  }
  tiandibang = await Read_tiandibang()
  let t
  for (let i = 0; i < tiandibang.length - 1; i++) {
    let count = 0
    for (let j = 0; j < tiandibang.length - i - 1; j++) {
      if (tiandibang[j].积分 < tiandibang[j + 1].积分) {
        t = tiandibang[j]
        tiandibang[j] = tiandibang[j + 1]
        tiandibang[j + 1] = t
        count = 1
      }
    }
    if (count == 0) break
  }
  Write_tiandibang(tiandibang)
})
