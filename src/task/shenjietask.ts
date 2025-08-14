import { redis, data, pushInfo } from '@src/model/api'
import { notUndAndNull } from '@src/model/common'
import { readPlayer } from '@src/model/xiuxian'
import { writePlayer } from '@src/model/xiuxian'
import { addNajieThing } from '@src/model/najie'
import { addExp2, addExp } from '@src/model/economy'
import { readTemp, writeTemp } from '@src/model/temp'
import { __PATH } from '@src/model/paths'
import { scheduleJob } from 'node-schedule'
import { DataMention, Mention } from 'alemonjs'
import { getDataByUserId, setDataByUserId } from '@src/model/Redis'
import type {
  Player,
  CoreNajieCategory as NajieCategory,
  ActionState,
  ShenjiePlace
} from '@src/types'
import { safeParse } from '@src/model/utils/safe'
import { NAJIE_CATEGORIES } from '@src/model/settions'

function isNajieCategory(v): v is NajieCategory {
  return (
    typeof v === 'string' && (NAJIE_CATEGORIES as readonly string[]).includes(v)
  )
}

scheduleJob('0 0/5 * * * ?', async () => {
  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  for (const player_id of playerList) {
    const actionRaw = await getDataByUserId(player_id, 'action')
    const action = safeParse<ActionState | null>(actionRaw, null)
    if (!action) continue
    let push_address: string | undefined
    let is_group = false
    if ('group_id' in action && notUndAndNull(action.group_id)) {
      is_group = true
      push_address = String(action.group_id)
    }
    const msg: Array<DataMention | string> = [Mention(player_id)]
    let end_time = Number(action.end_time) || 0
    const now_time = Date.now()
    const player = (await readPlayer(player_id)) as Player | null
    if (!player) continue

    if (String(action.mojie) === '-1') {
      end_time = end_time - Number(action.time || 0)
      if (now_time > end_time) {
        let thing_name: string | undefined
        let thing_class: NajieCategory | undefined
        const x = 0.98
        const random1 = Math.random()
        const y = 0.4
        const random2 = Math.random()
        const z = 0.15
        const random3 = Math.random()
        let m = ''
        let n = 1
        let t1 = 1
        let t2 = 1
        let last_msg = ''
        let fyd_msg = ''
        const place = data.shenjie?.[0] as ShenjiePlace | undefined
        if (!place) continue
        if (random1 <= x) {
          if (random2 <= y) {
            if (random3 <= z) {
              if (place.three.length) {
                const idx = Math.floor(Math.random() * place.three.length)
                thing_name = place.three[idx].name
                if (isNajieCategory(place.three[idx].class))
                  thing_class = place.three[idx].class
                m = `抬头一看，金光一闪！有什么东西从天而降，定睛一看，原来是[${thing_name}]`
                t1 = 2 + Math.random()
                t2 = 2 + Math.random()
              }
            } else if (place.two.length) {
              const idx = Math.floor(Math.random() * place.two.length)
              thing_name = place.two[idx].name
              if (isNajieCategory(place.two[idx].class))
                thing_class = place.two[idx].class
              m = `在洞穴中拿到[${thing_name}]`
              t1 = 1 + Math.random()
              t2 = 1 + Math.random()
            }
          } else if (place.one.length) {
            const idx = Math.floor(Math.random() * place.one.length)
            thing_name = place.one[idx].name
            if (isNajieCategory(place.one[idx].class))
              thing_class = place.one[idx].class
            m = `捡到了[${thing_name}]`
            t1 = 0.5 + Math.random() * 0.5
            t2 = 0.5 + Math.random() * 0.5
          }
        } else {
          m = '走在路上都没看见一只蚂蚁！'
          t1 = 2 + Math.random()
          t2 = 2 + Math.random()
        }
        const random = Math.random()
        if (random < (Number(player.幸运) || 0)) {
          if (random < (Number(player.addluckyNo) || 0)) {
            last_msg += '福源丹生效，所以在'
          } else if (player.仙宠?.type == '幸运') {
            last_msg += '仙宠使你在探索中欧气满满，所以在'
          }
          // 机缘翻倍
          n++
          last_msg += '探索过程中意外发现了两份机缘,最终获取机缘数量将翻倍\n'
        }
        if ((player.islucky || 0) > 0) {
          player.islucky!--
          if (player.islucky !== 0) {
            fyd_msg = `  \n福源丹的效力将在${player.islucky}次探索后失效\n`
          } else {
            fyd_msg = `  \n本次探索后，福源丹已失效\n`
            player.幸运 =
              Number(player.幸运 || 0) - Number(player.addluckyNo || 0)
            player.addluckyNo = 0
          }
          await writePlayer(player_id, player)
        }
        const now_level_id = player.level_id || 0
        const now_physique_id = player.Physique_id || 0
        const xiuwei = Math.trunc(
          2000 + (100 * now_level_id * now_level_id * t1 * 0.1) / 5
        )
        const qixue = Math.trunc(
          2000 + 100 * now_physique_id * now_physique_id * t2 * 0.1
        )
        if (thing_name && thing_class) {
          await addNajieThing(player_id, thing_name, thing_class, n)
        }
        last_msg += `${m},获得修为${xiuwei},气血${qixue},剩余次数${(Number(action.cishu) || 0) - 1}`
        msg.push('\n' + player.名号 + last_msg + fyd_msg)
        const arr: ActionState = action
        const remain = Number(arr.cishu) || 0
        if (remain <= 1) {
          arr.shutup = 1
          arr.working = 1
          arr.power_up = 1
          arr.Place_action = 1
          arr.Place_actionplus = 1
          arr.mojie = 1
          arr.end_time = Date.now()
          delete arr.group_id
          await setDataByUserId(player_id, 'action', JSON.stringify(arr))
          await addExp2(player_id, qixue)
          await addExp(player_id, xiuwei)
          if (is_group && push_address)
            await pushInfo(push_address, is_group, msg)
          else await pushInfo(player_id, is_group, msg)
        } else {
          arr.cishu = remain - 1
          await setDataByUserId(player_id, 'action', JSON.stringify(arr))
          await addExp2(player_id, qixue)
          await addExp(player_id, xiuwei)
          try {
            const temp = await readTemp()
            const p: { msg: string; qq_group?: string } = {
              msg: player.名号 + last_msg + fyd_msg,
              qq_group: push_address
            }
            temp.push(p)
            await writeTemp(temp)
          } catch {
            const temp: Array<{ msg: string; qq: string; qq_group?: string }> =
              []
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
})
