import { Text, useSend } from 'alemonjs'

import { data, redis } from '@src/api/api'
import { existplayer, Harm, ifbaoji } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?挑战镇妖塔$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let player = await await data.getData('player', usr_qq)
  const equipment = await data.getData('equipment', usr_qq)
  const type = ['武器', '护具', '法宝']
  for (let j of type) {
    if (
      equipment[j].atk < 10 &&
      equipment[j].def < 10 &&
      equipment[j].HP < 10
    ) {
      Send(Text('请更换其他固定数值装备爬塔'))
      return false
    }
  }
  if (player.镇妖塔层数 > 6000) {
    Send(Text('已达到上限'))
    return false
  }
  let ZYTcs = player.镇妖塔层数
  let Health = 0
  let Attack = 0
  let Defence = 0
  let Reward = 0
  Health = 50000 * ZYTcs + 10000
  Attack = 22000 * ZYTcs + 10000
  Defence = 36000 * ZYTcs + 10000
  if (ZYTcs < 100) {
    Reward = 260 * ZYTcs + 100
  } else if (ZYTcs >= 100 && ZYTcs < 200) {
    Reward = 360 * ZYTcs + 1000
  } else if (ZYTcs >= 200) {
    Reward = 700 * ZYTcs + 1000
  }
  if (Reward > 400000) Reward = 400000
  let bosszt = {
    Health: Health,
    OriginHealth: Health,
    isAngry: 0,
    isWeak: 0,
    Attack: Attack,
    Defence: Defence,
    KilledTime: -1,
    Reward: Reward
  }
  let Time = 2
  let now_Time = new Date().getTime() //获取当前时间戳
  let shuangxiuTimeout = Math.floor(60000 * Time)
  let last_time: any = await redis.get('xiuxian@1.3.0:' + usr_qq + 'CD') //获得上次的时间戳,
  last_time = parseInt(last_time)
  if (now_Time < last_time + shuangxiuTimeout) {
    let Couple_m = Math.trunc(
      (last_time + shuangxiuTimeout - now_Time) / 60 / 1000
    )
    let Couple_s = Math.trunc(
      ((last_time + shuangxiuTimeout - now_Time) % 60000) / 1000
    )
    Send(Text('正在CD中，' + `剩余cd:  ${Couple_m}分 ${Couple_s}秒`))
    return false
  }
  let BattleFrame = 0
  let TotalDamage = 0
  let msg = []
  let BOSSCurrentAttack = bosszt.isAngry
    ? Math.trunc(bosszt.Attack * 1.8)
    : bosszt.isWeak
      ? Math.trunc(bosszt.Attack * 0.7)
      : bosszt.Attack
  let BOSSCurrentDefence = bosszt.isWeak
    ? Math.trunc(bosszt.Defence * 0.7)
    : bosszt.Defence
  while (player.当前血量 > 0 && bosszt.Health > 0) {
    let Random = Math.random()
    if (!(BattleFrame & 1)) {
      let Player_To_BOSS_Damage =
        Harm(player.攻击, BOSSCurrentDefence) +
        Math.trunc(player.攻击 * player.灵根.法球倍率)
      let SuperAttack = Math.random() < player.暴击率 ? 1.5 : 1
      msg.push(`第${Math.trunc(BattleFrame / 2) + 1}回合：`)
      if (Random > 0.5 && BattleFrame == 0) {
        msg.push('你的进攻被反手了！')
        Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * 0.3)
      } else if (Random > 0.94) {
        msg.push('你的攻击被破解了')
        Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * 6)
      } else if (Random > 0.9) {
        msg.push('你的攻击被挡了一部分')
        Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * 0.8)
      } else if (Random < 0.1) {
        msg.push('你抓到了未知妖物的破绽')
        Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * 1.2)
      }
      Player_To_BOSS_Damage = Math.trunc(
        Player_To_BOSS_Damage * SuperAttack + Math.random() * 100
      )
      bosszt.Health -= Player_To_BOSS_Damage
      TotalDamage += Player_To_BOSS_Damage
      if (bosszt.Health < 0) {
        bosszt.Health = 0
      }
      msg.push(
        `${player.名号}${ifbaoji(
          SuperAttack
        )}造成伤害${Player_To_BOSS_Damage}，未知妖物剩余血量${bosszt.Health}`
      )
    } else {
      let BOSS_To_Player_Damage = Harm(
        BOSSCurrentAttack,
        Math.trunc(player.防御 * 0.1)
      )
      if (Random > 0.94) {
        msg.push('未知妖物的攻击被你破解了')
        BOSS_To_Player_Damage = Math.trunc(BOSS_To_Player_Damage * 0.6)
      } else if (Random > 0.9) {
        msg.push('未知妖物的攻击被你挡了一部分')
        BOSS_To_Player_Damage = Math.trunc(BOSS_To_Player_Damage * 0.8)
      } else if (Random < 0.1) {
        msg.push('未知妖物抓到了你的破绽')
        BOSS_To_Player_Damage = Math.trunc(BOSS_To_Player_Damage * 1.2)
      }
      player.当前血量 -= BOSS_To_Player_Damage
      bosszt.isAngry ? --bosszt.isAngry : 0
      bosszt.isWeak ? --bosszt.isWeak : 0
      if (!bosszt.isAngry && BOSSCurrentAttack > bosszt.Attack)
        BOSSCurrentAttack = bosszt.Attack
      if (!bosszt.isWeak && BOSSCurrentDefence < bosszt.Defence)
        BOSSCurrentDefence = bosszt.Defence
      if (player.当前血量 < 0) {
        player.当前血量 = 0
      }
      msg.push(
        `未知妖物攻击了${player.名号}，造成伤害${BOSS_To_Player_Damage}，${player.名号}剩余血量${player.当前血量}`
      )
    }
    BattleFrame++
  }
  if (msg.length <= 30) {
    // await ForwardMsg(e, msg)
    Send(Text(msg.join('\n')))
  } else {
    msg.length = 30
    // await ForwardMsg(e, msg)
    Send(Text(msg.join('\n')))
    Send(Text('战斗过长，仅展示部分内容'))
  }
  await redis.set('xiuxian@1.3.0:' + usr_qq + 'CD', now_Time)
  if (bosszt.Health <= 0) {
    player.镇妖塔层数 += 5
    player.灵石 += Reward
    player.当前血量 += Reward * 21
    Send(
      Text(
        `\n恭喜通过此层镇妖塔，层数+5！增加灵石${Reward}回复血量${Reward * 21}`
      )
    )
    data.setData('player', usr_qq, player)
  }
  if (player.当前血量 <= 0) {
    player.当前血量 = 0
    player.灵石 -= Math.trunc(Reward * 2)
    Send(Text(`\n你未能通过此层镇妖塔！灵石-${Math.trunc(Reward * 2)}`))
    data.setData('player', usr_qq, player)
  }
})
