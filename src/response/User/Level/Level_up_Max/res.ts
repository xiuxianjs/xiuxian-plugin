import { Text, useSend } from 'alemonjs'
import { redis, data } from '@src/model/api'
import {
  existplayer,
  readPlayer,
  notUndAndNull,
  writePlayer,
  readEquipment,
  writeEquipment,
  addHP,
  playerEfficiency,
  getRandomFromARR
} from '@src/model/index'

import { selects } from '@src/response/index'
import { getDataByUserId } from '@src/model/Redis'

// 玩家行动状态（统一抽象）
interface PlayerActionState {
  action: string
  end_time: number
  [k: string]: unknown
}
export const regular = /^(#|＃|\/)?登仙$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  //有无账号
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  //不开放私聊

  //获取游戏状态
  const game_action_raw = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':game_action'
  )
  const game_action = game_action_raw == null ? 0 : Number(game_action_raw)
  //防止继续其他娱乐行为
  if (game_action == 1) {
    Send(Text('修仙：游戏进行中...'))
    return false
  }
  //读取信息
  const player = await readPlayer(usr_qq)
  //境界
  const now_level = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level
  if (now_level != '渡劫期') {
    Send(Text(`你非渡劫期修士！`))
    return false
  }
  //查询redis中的人物动作

  const actionRaw = await getDataByUserId(usr_qq, 'action')
  let action: PlayerActionState | null = null
  try {
    action = actionRaw ? (JSON.parse(actionRaw) as PlayerActionState) : null
  } catch {
    action = null
  }
  //不为空
  if (action != null) {
    const action_end_time = action.end_time
    const now_time = new Date().getTime()
    if (now_time <= action_end_time) {
      const m = Math.floor((action_end_time - now_time) / 1000 / 60)
      const s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000)
      Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'))
      return false
    }
  }
  if (player.power_place != 0) {
    Send(Text('请先渡劫！'))
    return false
  }
  //需要的修为
  let now_level_id
  if (!notUndAndNull(player.level_id)) {
    Send(Text('请先#刷新信息'))
    return false
  }
  now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  const now_exp = player.修为
  //修为
  const need_exp = data.Level_list.find(
    item => item.level_id == player.level_id
  ).exp
  if (now_exp < need_exp) {
    Send(Text(`修为不足,再积累${need_exp - now_exp}修为后方可成仙！`))
    return false
  }
  //零，开仙门
  if (player.power_place == 0) {
    Send(
      Text(
        '天空一声巨响，一道虚影从眼中浮现，突然身体微微颤抖，似乎感受到了什么，' +
          player.名号 +
          '来不及思索，立即向前飞去！只见万物仰头相望，似乎感觉到了，也似乎没有感觉，殊不知......'
      )
    )
    now_level_id = now_level_id + 1
    player.level_id = now_level_id
    player.修为 -= need_exp
    await writePlayer(usr_qq, player)
    const equipment = await readEquipment(usr_qq)
    await writeEquipment(usr_qq, equipment)
    await addHP(usr_qq, 99999999)
    //突破成仙人
    if (now_level_id >= 42) {
      const player = await data.getData('player', usr_qq)
      if (!notUndAndNull(player.宗门)) {
        return false
      }
      //有宗门
      if (player.宗门.职位 != '宗主') {
        const ass = await data.getAssociation(player.宗门.宗门名称)
        if (ass === 'error') return false
        const association = ass
        // 成员职位列表统一视为 string[]
        const pos = player.宗门.职位 as string
        const curList = (association[pos] as string[] | undefined) || []
        association[pos] = curList.filter(item => item != usr_qq)
        const allList = (association['所有成员'] as string[] | undefined) || []
        association['所有成员'] = allList.filter(item => item != usr_qq)
        data.setAssociation(association.宗门名称 as string, association)
        delete player.宗门
        data.setData('player', usr_qq, player)
        await playerEfficiency(usr_qq)
        Send(Text('退出宗门成功'))
      } else {
        const ass = await data.getAssociation(player.宗门.宗门名称)
        if (ass === 'error') return false
        const association = ass
        const allList = (association.所有成员 as string[] | undefined) || []
        if (allList.length < 2) {
          await redis.del(`${data.association}:${player.宗门.宗门名称}`)
          delete player.宗门 //删除存档里的宗门信息
          data.setData('player', usr_qq, player)
          await playerEfficiency(usr_qq)
          Send(
            Text('一声巨响,原本的宗门轰然倒塌,随着流沙沉没,世间再无半分痕迹')
          )
        } else {
          association['所有成员'] = allList.filter(item => item != usr_qq) // 剔除原成员
          delete player.宗门 //删除这个B存档里的宗门信息
          data.setData('player', usr_qq, player)
          await playerEfficiency(usr_qq)
          //随机一个幸运儿的QQ,优先挑选等级高的
          let randmember_qq
          const list_v = (association.副宗主 as string[] | undefined) || []
          const list_l = (association.长老 as string[] | undefined) || []
          const list_n = (association.内门弟子 as string[] | undefined) || []
          if (list_v.length > 0) {
            randmember_qq = await getRandomFromARR(list_v)
          } else if (list_l.length > 0) {
            randmember_qq = await getRandomFromARR(list_l)
          } else if (list_n.length > 0) {
            randmember_qq = await getRandomFromARR(list_n)
          } else {
            randmember_qq = await getRandomFromARR(
              (association.所有成员 as string[] | undefined) || []
            )
          }
          const randmember = await await data.getData('player', randmember_qq) //获取幸运儿的存档
          const rPos = randmember.宗门.职位 as string
          const rList = (association[rPos] as string[] | undefined) || []
          association[rPos] = rList.filter(item => item != randmember_qq)
          association['宗主'] = randmember_qq //新的职位表加入这个幸运儿
          randmember.宗门.职位 = '宗主' //成员存档里改职位
          data.setData('player', randmember_qq, randmember) //记录到存档
          data.setData('player', usr_qq, player)
          data.setAssociation(association.宗门名称 as string, association) //记录到宗门
          Send(
            Text(
              `飞升前,遵循你的嘱托,${randmember.名号}将继承你的衣钵,成为新一任的宗主`
            )
          )
        }
      }
    }
    return false
  }
})
