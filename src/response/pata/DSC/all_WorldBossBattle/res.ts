import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import { existplayer, Harm, ifbaoji } from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)一键炼神魄$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let xueqi = 0
  let cengshu = 0
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let player = await data.getData('player', usr_qq)
  while (player.当前血量 > 0) {
    let 神魄段数 = player.神魄段数
    //人数的万倍
    let Health = 100000 * 神魄段数
    //攻击
    let Attack = 250000 * 神魄段数
    //防御
    let Defence = 200000 * 神魄段数
    //奖励下降
    let Reward = 1200 * 神魄段数
    if (Reward > 400000) Reward = 400000
    if (player.神魄段数 > 6000) Reward = 0
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
      if (!(BattleFrame & 1)) {
        let Player_To_BOSS_Damage =
          Harm(player.攻击, BOSSCurrentDefence) +
          Math.trunc(player.攻击 * player.灵根.法球倍率)
        let SuperAttack = 2 < player.暴击率 ? 1.5 : 1
        msg.push(`第${Math.trunc(BattleFrame / 2) + 1}回合：`)
        if (BattleFrame == 0) {
          msg.push('你进入锻神池，开始了！')
          Player_To_BOSS_Damage = 0
        }
        Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * SuperAttack)
        bosszt.Health -= Player_To_BOSS_Damage
        TotalDamage += Player_To_BOSS_Damage
        if (bosszt.Health < 0) {
          bosszt.Health = 0
        }
        msg.push(
          `${player.名号}${ifbaoji(
            SuperAttack
          )}消耗了${Player_To_BOSS_Damage}，此段剩余${bosszt.Health}未炼化`
        )
      } else {
        let BOSS_To_Player_Damage = Harm(
          BOSSCurrentAttack,
          Math.trunc(player.防御 * 0.1)
        )
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
          `${player.名号}损失血量${BOSS_To_Player_Damage}，${player.名号}剩余血量${player.当前血量}`
        )
      }
      BattleFrame++
    }
    if (bosszt.Health <= 0) {
      player.神魄段数 += 5
      cengshu += 5
      xueqi += Reward
      player.当前血量 = player.血量上限
    } else if (player.当前血量 <= 0) {
      player.当前血量 = 0
      player.修为 -= Math.trunc(Reward * 2)
    }
  }
  player.血气 += xueqi
  Send(
    Text(
      [`\n恭喜你获得血气${xueqi},本次通过${cengshu}层,失去部分修为`].join('')
    )
  )
  data.setData('player', usr_qq, player)
})
