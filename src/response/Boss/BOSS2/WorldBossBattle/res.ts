import { Text, useSend } from 'alemonjs'
import * as _ from 'lodash-es'
import {
  Boss2IsAlive,
  InitWorldBoss2,
  SetWorldBOSSBattleUnLockTimer,
  SortPlayer,
  WorldBossBattle,
  WorldBossBattleInfo
} from '../../boss'
import { redis, data, pushInfo } from '@src/model/api'
import { zdBattle, Harm } from '@src/model/battle'
import { sleep } from '@src/model/common'
import { addHP, addCoin } from '@src/model/economy'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?讨伐金角大王$/

export default onResponse(selects, async e => {
  const Send = useSend(e)

  if (!(await Boss2IsAlive())) {
    Send(Text('金角大王未开启！'))
    return false
  }
  const usr_qq = e.UserId
  let Time = 5
  const now_Time = Date.now() //获取当前时间戳
  Time = Math.floor(60000 * Time)
  let last_time = await redis.get('xiuxian@1.3.0:' + usr_qq + 'BOSSCD') //获得上次的时间戳,
  last_time = parseInt(last_time)
  if (now_Time < last_time + Time) {
    const Couple_m = Math.trunc((last_time + Time - now_Time) / 60 / 1000)
    const Couple_s = Math.trunc(((last_time + Time - now_Time) % 60000) / 1000)
    Send(Text('正在CD中，' + `剩余cd:  ${Couple_m}分 ${Couple_s}秒`))
    return false
  }
  if (await data.existData('player', usr_qq)) {
    const player = await await data.getData('player', usr_qq)
    if (player.level_id > 41 || player.lunhui > 0) {
      Send(Text('仙人不得下凡'))
      return false
    }
    if (player.level_id < 22) {
      Send(Text('修为至少达到化神初期才能参与挑战'))
      return false
    }
    let action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action')
    action = JSON.parse(action)
    if (action != null) {
      const action_end_time = action.end_time
      const now_time = Date.now()
      if (now_time <= action_end_time) {
        const m = parseInt('' + (action_end_time - now_time) / 1000 / 60)
        const s = parseInt(
          '' + (action_end_time - now_time - m * 60 * 1000) / 1000
        )
        Send(
          Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒')
        )
        return false
      }
    }
    if (player.当前血量 <= player.血量上限 * 0.1) {
      Send(Text('还是先疗伤吧，别急着参战了'))
      return false
    }
    if (WorldBossBattleInfo.CD[usr_qq]) {
      const Seconds = Math.trunc(
        (300000 - (Date.now() - WorldBossBattleInfo.CD[usr_qq])) / 1000
      )
      if (Seconds <= 300 && Seconds >= 0) {
        Send(
          Text(`刚刚一战消耗了太多气力，还是先歇息一会儿吧~(剩余${Seconds}秒)`)
        )
        return false
      }
    }

    const WorldBossStatusStr = await redis.get('Xiuxian:WorldBossStatus2')
    const PlayerRecord = await redis.get('xiuxian@1.3.0Record2')
    const WorldBossStatus = JSON.parse(WorldBossStatusStr)
    if (Date.now() - WorldBossStatus.KilledTime < 86400000) {
      Send(Text(`金角大王正在刷新,20点开启`))
      return false
    } else if (WorldBossStatus.KilledTime != -1) {
      if ((await InitWorldBoss2()) == false) await WorldBossBattle(e)
      return false
    }
    let PlayerRecordJSON, Userid
    if (+PlayerRecord == 0) {
      const QQGroup = [],
        DamageGroup = [],
        Name = []
      QQGroup[0] = usr_qq
      DamageGroup[0] = 0
      Name[0] = player.名号
      PlayerRecordJSON = { QQ: QQGroup, TotalDamage: DamageGroup, Name: Name }
      Userid = 0
    } else {
      PlayerRecordJSON = JSON.parse(PlayerRecord)
      let i
      for (i = 0; i < PlayerRecordJSON.QQ.length; i++) {
        if (PlayerRecordJSON.QQ[i] == usr_qq) {
          Userid = i
          break
        }
      }
      if (!Userid && Userid != 0) {
        PlayerRecordJSON.QQ[i] = usr_qq
        PlayerRecordJSON.Name[i] = player.名号
        PlayerRecordJSON.TotalDamage[i] = 0
        Userid = i
      }
    }
    let TotalDamage = 0
    const Boss = {
      名号: '银角大王',
      攻击: Math.floor(player.攻击 * (0.8 + 0.4 * Math.random())),
      防御: Math.floor(player.防御 * (0.8 + 0.4 * Math.random())),
      当前血量: Math.floor(player.血量上限 * (0.8 + 0.4 * Math.random())),
      暴击率: player.暴击率,
      灵根: player.灵根,
      法球倍率: player.灵根.法球倍率
    }
    player.法球倍率 = player.灵根.法球倍率
    if (WorldBossBattleInfo.UnLockTimer) {
      clearTimeout(WorldBossBattleInfo.UnLockTimer)
      WorldBossBattleInfo.setUnLockTimer(null)
    }
    SetWorldBOSSBattleUnLockTimer(e)
    if (WorldBossBattleInfo.Lock != 0) {
      Send(
        Text('好像有人正在和银角大王激战，现在去怕是有未知的凶险，还是等等吧！')
      )
      return false
    }
    WorldBossBattleInfo.setLock(1)
    const Data_battle = await zdBattle(player, Boss)
    const msg = Data_battle.msg
    const A_win = `${player.名号}击败了${Boss.名号}`
    const B_win = `${Boss.名号}击败了${player.名号}`
    if (msg.length <= 60) await Send(Text(msg.join('\n')))
    else {
      // let msgg = JSON.parse(JSON.stringify(msg))
      const msgg = _.cloneDeep(msg)
      msgg.length = 60
      await Send(Text(msgg.join('\n')))
      Send(Text('战斗过长，仅展示部分内容'))
    }
    await sleep(1000)
    if (!WorldBossStatus.Healthmax) {
      Send(Text('请联系管理员重新开启!'))
      return false
    }
    if (msg.find(item => item == A_win)) {
      TotalDamage = Math.trunc(
        WorldBossStatus.Healthmax * 0.06 +
          Harm(player.攻击 * 0.85, Boss.防御) * 10
      )
      WorldBossStatus.Health -= TotalDamage
      Send(
        Text(
          `${player.名号}击败了[${Boss.名号}],重创[金角大王],造成伤害${TotalDamage}`
        )
      )
    } else if (msg.find(item => item == B_win)) {
      TotalDamage = Math.trunc(
        WorldBossStatus.Healthmax * 0.04 +
          Harm(player.攻击 * 0.85, Boss.防御) * 6
      )
      WorldBossStatus.Health -= TotalDamage
      Send(
        Text(
          `${player.名号}被[${Boss.名号}]击败了,只对[金角大王]造成了${TotalDamage}伤害`
        )
      )
    }
    await addHP(usr_qq, Data_battle.A_xue)
    await sleep(1000)
    const random = Math.random()
    if (random < 0.05 && msg.find(item => item == A_win)) {
      Send(
        Text('这场战斗重创了[金角大王]，金角大王使用了古典秘籍,血量回复了10%')
      )
      WorldBossStatus.Health += Math.trunc(WorldBossStatus.Healthmax * 0.1)
    } else if (random > 0.95 && msg.find(item => item == B_win)) {
      TotalDamage += Math.trunc(WorldBossStatus.Health * 0.15)
      WorldBossStatus.Health -= Math.trunc(WorldBossStatus.Health * 0.15)
      Send(
        Text(
          `危及时刻,万先盟-韩立前来助阵,对[金角大王]造成${Math.trunc(
            WorldBossStatus.Health * 0.15
          )}伤害,并治愈了你的伤势`
        )
      )
      await addHP(usr_qq, player.血量上限)
    }
    await sleep(1000)
    PlayerRecordJSON.TotalDamage[Userid] += TotalDamage
    redis.set('xiuxian@1.3.0Record2', JSON.stringify(PlayerRecordJSON))
    redis.set('Xiuxian:WorldBossStatus2', JSON.stringify(WorldBossStatus))
    if (WorldBossStatus.Health <= 0) {
      Send(Text('金角大王被击杀！玩家们可以根据贡献获得奖励！'))
      await sleep(1000)
      const msg2 =
        '【全服公告】' +
        player.名号 +
        '亲手结果了金角大王的性命,为民除害,额外获得500000灵石奖励！'
      const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
      const groupList = await redis.smembers(redisGlKey)
      for (const group of groupList) {
        await pushInfo(group, true, msg2)
      }
      await addCoin(usr_qq, 500000)
      logger.info(`[金角大王] 结算:${usr_qq}增加奖励500000`)

      WorldBossStatus.KilledTime = Date.now()
      redis.set('Xiuxian:WorldBossStatus2', JSON.stringify(WorldBossStatus))
      const PlayerList = await SortPlayer(PlayerRecordJSON)
      Send(
        Text(
          '正在进行存档有效性检测，如果长时间没有回复请联系主人修复存档并手动按照贡献榜发放奖励'
        )
      )
      for (let i = 0; i < PlayerList.length; i++)
        await await data.getData('player', PlayerRecordJSON.QQ[PlayerList[i]])
      let Show_MAX
      const Rewardmsg = ['****金角大王周本贡献排行榜****']
      if (PlayerList.length > 20) Show_MAX = 20
      else Show_MAX = PlayerList.length
      let TotalDamage = 0
      for (
        let i = 0;
        i < (PlayerList.length <= 20 ? PlayerList.length : 20);
        i++
      )
        TotalDamage += PlayerRecordJSON.TotalDamage[PlayerList[i]]
      for (let i = 0; i < PlayerList.length; i++) {
        const CurrentPlayer = await await data.getData(
          'player',
          PlayerRecordJSON.QQ[PlayerList[i]]
        )
        if (i < Show_MAX) {
          let Reward = Math.trunc(
            (PlayerRecordJSON.TotalDamage[PlayerList[i]] / TotalDamage) *
              WorldBossStatus.Reward
          )
          Reward = Reward < 200000 ? 200000 : Reward
          Rewardmsg.push(
            '第' +
              `${i + 1}` +
              '名:\n' +
              `名号:${CurrentPlayer.名号}` +
              '\n' +
              `伤害:${PlayerRecordJSON.TotalDamage[PlayerList[i]]}` +
              '\n' +
              `获得灵石奖励${Reward}`
          )
          CurrentPlayer.灵石 += Reward
          data.setData(
            'player',
            PlayerRecordJSON.QQ[PlayerList[i]],
            CurrentPlayer
          )
          logger.info(
            `[金角大王周本] 结算:${
              PlayerRecordJSON.QQ[PlayerList[i]]
            }增加奖励${Reward}`
          )
          continue
        } else {
          CurrentPlayer.灵石 += 200000
          logger.info(
            `[金角大王周本] 结算:${
              PlayerRecordJSON.QQ[PlayerList[i]]
            }增加奖励200000`
          )
          data.setData(
            'player',
            PlayerRecordJSON.QQ[PlayerList[i]],
            CurrentPlayer
          )
        }
        if (i == PlayerList.length - 1)
          Rewardmsg.push('其余参与的修仙者均获得200000灵石奖励！')
      }
      await Send(Text(Rewardmsg.join('\n')))
    }
    WorldBossBattleInfo.setCD(usr_qq, Date.now())
    WorldBossBattleInfo.setLock(0)
    return false
  } else {
    Send(Text('区区凡人，也想参与此等战斗中吗？'))
    return false
  }
})
