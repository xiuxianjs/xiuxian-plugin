import { redis, pushInfo } from '@src/model/api'
import { notUndAndNull } from '@src/model/common'
import { readPlayer } from '@src/model/xiuxian'
import { existNajieThing, addNajieThing } from '@src/model/najie'
import { addExp2, addExp } from '@src/model/economy'
import { readTemp, writeTemp } from '@src/model/temp'
import { __PATH, keys as dataKeys } from '@src/model/keys'
import { getDataByUserId, setDataByUserId } from '@src/model/Redis'
import type { ExploreActionState } from '@src/types'
import { getDataList } from '@src/model/DataList'

function isExploreAction(a): a is ExploreActionState {
  return !!a && typeof a === 'object' && 'end_time' in a
}

/**
 * 遍历所有玩家，检查每个玩家的当前动作（如探索、魔劫等）。
 * 判断动作是否为“魔劫”相关，并根据动作状态和时间进行结算处理。
 * 结算时会处理经验、物品发放、状态变更等，并通过推送消息通知玩家或群组。
 * 该任务确保玩家的“魔劫”或探索等行为能在到达指定时间后自动结算和反馈。
 */
export const MojiTask = async () => {
  // 获取缓存中人物列表
  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  for (const player_id of playerList) {
    // 查询当前人物动作（日志变量已移除以减 lint 噪声）
    // 得到动作
    const rawAction = await getDataByUserId(player_id, 'action')
    let action
    try {
      action = JSON.parse(rawAction)
    } catch {
      action = null
    }
    //不为空，存在动作
    if (action != null) {
      let push_address = player_id // 消息推送地址
      let is_group = false // 是否推送到群
      if (
        isExploreAction(action) &&
        notUndAndNull((action as ExploreActionState).group_id)
      ) {
        is_group = true
        push_address = (action as ExploreActionState).group_id!
      }

      //最后发送的消息
      const msg: string[] = []
      //动作结束时间
      if (!isExploreAction(action)) continue
      const act = action as ExploreActionState
      let end_time = act.end_time
      // 现在的时间
      const now_time = Date.now()
      // 用户信息
      const player = await readPlayer(player_id)

      //有洗劫状态:这个直接结算即可
      if (String(act.mojie) == '0') {
        //5分钟后开始结算阶段一
        const baseDuration =
          typeof act.time === 'number'
            ? act.time
            : parseInt(String(act.time || 0), 10)
        end_time = end_time - (isNaN(baseDuration) ? 0 : baseDuration)
        //时间过了
        if (now_time > end_time) {
          let thing_name
          let thing_class
          const x = 0.98
          const random1 = Math.random()
          const y = 0.4
          const random2 = Math.random()
          const z = 0.15
          const random3 = Math.random()
          let random4
          let m = ''
          let n = 1
          let t1: number
          let t2: number
          let last_msg = ''
          let fyd_msg = ''

          const data = {
            mojie: await getDataList('Mojie')
          }

          if (random1 <= x) {
            if (random2 <= y) {
              if (random3 <= z) {
                random4 = Math.floor(Math.random() * data.mojie[0].three.length)
                thing_name = data.mojie[0].three[random4].name
                thing_class = data.mojie[0].three[random4].class
                m = `抬头一看，金光一闪！有什么东西从天而降，定睛一看，原来是[${thing_name}]`
                t1 = 2 + Math.random()
                t2 = 2 + Math.random()
              } else {
                random4 = Math.floor(Math.random() * data.mojie[0].two.length)
                thing_name = data.mojie[0].two[random4].name
                thing_class = data.mojie[0].two[random4].class
                m = `在洞穴中拿到[${thing_name}]`
                t1 = 1 + Math.random()
                t2 = 1 + Math.random()
              }
            } else {
              random4 = Math.floor(Math.random() * data.mojie[0].one.length)
              thing_name = data.mojie[0].one[random4].name
              thing_class = data.mojie[0].one[random4].class
              m = `捡到了[${thing_name}]`
              t1 = 0.5 + Math.random() * 0.5
              t2 = 0.5 + Math.random() * 0.5
            }
          } else {
            thing_name = ''
            thing_class = ''
            m = '走在路上都没看见一只蚂蚁！'
            t1 = 2 + Math.random()
            t2 = 2 + Math.random()
          }
          const random = Math.random()
          if (random < player.幸运) {
            if (random < player.addluckyNo) {
              last_msg += '福源丹生效，所以在'
            } else if (player.仙宠.type == '幸运') {
              last_msg += '仙宠使你在探索中欧气满满，所以在'
            }
            n++
            last_msg += '探索过程中意外发现了两份机缘,最终获取机缘数量将翻倍\n'
          }
          if (player.islucky > 0) {
            player.islucky--
            if (player.islucky != 0) {
              fyd_msg = `  \n福源丹的效力将在${player.islucky}次探索后失效\n`
            } else {
              fyd_msg = `  \n本次探索后，福源丹已失效\n`
              player.幸运 -= player.addluckyNo
              player.addluckyNo = 0
            }
            // await data.setData('player', player_id, player)
            await redis.set(dataKeys.player(player_id), JSON.stringify(player))
          }
          //默认结算装备数
          const now_level_id = player.level_id
          const now_physique_id = player.Physique_id
          //结算
          let qixue = 0
          let xiuwei = 0
          xiuwei = Math.trunc(
            2000 + (100 * now_level_id * now_level_id * t1 * 0.1) / 5
          )
          qixue = Math.trunc(
            2000 + 100 * now_physique_id * now_physique_id * t2 * 0.1
          )
          if (await existNajieThing(player_id, '修魔丹', '道具')) {
            xiuwei *= 100
            xiuwei = Math.trunc(xiuwei)
            await addNajieThing(player_id, '修魔丹', '道具', -1)
          }
          if (await existNajieThing(player_id, '血魔丹', '道具')) {
            qixue *= 18
            qixue = Math.trunc(qixue)
            await addNajieThing(player_id, '血魔丹', '道具', -1)
          }
          if (thing_name != '' || thing_class != '') {
            await addNajieThing(player_id, thing_name, thing_class, n)
          }
          last_msg +=
            m +
            ',获得修为' +
            xiuwei +
            ',气血' +
            qixue +
            ',剩余次数' +
            ((act.cishu || 0) - 1)
          msg.push('\n' + player.名号 + last_msg + fyd_msg)
          const arr: ExploreActionState = {
            ...(act as ExploreActionState)
          }
          if (arr.cishu == 1) {
            //把状态都关了
            arr.shutup = 1 //闭关状态
            arr.working = 1 //降妖状态
            arr.power_up = 1 //渡劫状态
            arr.Place_action = 1 //秘境
            arr.Place_actionplus = 1 //沉迷状态
            // 魔界状态关闭并更新时间
            arr.mojie = 1
            arr.end_time = Date.now()
            //结算完去除group_id
            delete arr.group_id
            //写入redis
            await setDataByUserId(player_id, 'action', JSON.stringify(arr))
            //先完结再结算
            await addExp2(player_id, qixue)
            await addExp(player_id, xiuwei)
            //发送消息
            await pushInfo(push_address, is_group, msg.join(''))
          } else {
            if (typeof arr.cishu === 'number') arr.cishu--

            await setDataByUserId(player_id, 'action', JSON.stringify(arr))
            //先完结再结算
            await addExp2(player_id, qixue)
            await addExp(player_id, xiuwei)
            try {
              const temp = await readTemp()
              const p = {
                msg: player.名号 + last_msg + fyd_msg,
                qq_group: push_address
              }
              temp.push(p)
              await writeTemp(temp)
            } catch {
              const temp: { msg: string; qq?: string; qq_group: string }[] = []
              const p = {
                msg: player.名号 + last_msg + fyd_msg,
                qq: player_id,
                qq_group: push_address
              }
              temp.push(p)
              await writeTemp(temp)
            }
          }
        }
      }
    }
  }
}
