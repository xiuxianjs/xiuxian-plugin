import { redis, data, pushInfo } from '@src/model/api'
import { notUndAndNull } from '@src/model/common'
import { Harm } from '@src/model/battle'
import { readShop, writeShop } from '@src/model/shop'
import { addNajieThing } from '@src/model/najie'
import { __PATH } from '@src/model/paths'
import { scheduleJob } from 'node-schedule'
import { getDataByUserId, setDataByUserId } from '@src/model/Redis'
import { safeParse } from '@src/model/utils/safe'
import type {
  ActionState,
  CoreNajieCategory as NajieCategory
} from '@src/types'
import { Mention, DataMention } from 'alemonjs'

const NAJIE_CATEGORIES: readonly NajieCategory[] = [
  '装备',
  '丹药',
  '道具',
  '功法',
  '草药',
  '材料',
  '仙宠',
  '仙宠口粮'
] as const
function isNajieCategory(v): v is NajieCategory {
  return (
    typeof v === 'string' && (NAJIE_CATEGORIES as readonly string[]).includes(v)
  )
}

interface MonsterSlot {
  name: string
  atk: number
  def: number
  blood: number
  baoji: number
  灵根?: { 法球倍率?: number }
}
interface ShopSlotLike {
  name: string
  state?: number
  Grade?: number
  one?: any[]
  two?: any[]
  three?: any[]
}

scheduleJob('0 0/5 * * * ?', async () => {
  //获取缓存中人物列表

  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  for (const player_id of playerList) {
    let log_mag = '' //查询当前人物动作日志信息
    log_mag = log_mag + '查询' + player_id + '是否有动作,'
    //得到动作

    const actionRaw = await getDataByUserId(player_id, 'action')
    const action = safeParse<ActionState | null>(actionRaw, null)
    if (action) {
      let push_address: string | undefined
      let is_group = false //是否推送到群

      if ('group_id' in action) {
        if (notUndAndNull(action.group_id)) {
          is_group = true
          push_address = action.group_id
        }
      }

      //最后发送的消息
      const msg: Array<DataMention | string> = [Mention(player_id)]
      //动作结束时间
      let end_time = action.end_time
      //现在的时间
      const now_time = Date.now()
      //有洗劫状态:这个直接结算即可
      if (action.xijie == '-2') {
        //5分钟后开始结算阶段一
        const actTime =
          typeof action.time === 'string'
            ? parseInt(action.time)
            : Number(action.time)
        end_time = end_time - (isNaN(actTime) ? 0 : actTime) + 60000 * 5
        //时间过了
        if (now_time >= end_time) {
          const weizhi = action.Place_address
          if (!weizhi) return
          let i = 0 //获取对应npc列表的位置
          for (i = 0; i < data.npc_list.length; i++) {
            if (data.npc_list[i].name == '万仙盟') break
          }
          const A_player = action.A_player
          if (!A_player) return
          let monster: MonsterSlot
          if (weizhi.Grade == 1) {
            const monster_length = data.npc_list[i].one.length
            const monster_index = Math.trunc(Math.random() * monster_length)
            monster = data.npc_list[i].one[monster_index]
          } else if (weizhi.Grade == 2) {
            const monster_length = data.npc_list[i].two.length
            const monster_index = Math.trunc(Math.random() * monster_length)
            monster = data.npc_list[i].two[monster_index]
          } else {
            const monster_length = data.npc_list[i].three.length
            const monster_index = Math.trunc(Math.random() * monster_length)
            monster = data.npc_list[i].three[monster_index]
          }
          //设定npc数值
          const B_player = {
            名号: monster.name,
            攻击: Math.floor(
              Number(monster.atk || 0) * Number(A_player.攻击 || 0)
            ),
            防御: Math.floor(
              (Number(monster.def || 0) * Number(A_player.防御 || 0)) /
                (1 + Number(weizhi.Grade || 0) * 0.05)
            ),
            当前血量: Math.floor(
              (Number(monster.blood || 0) * Number(A_player.当前血量 || 0)) /
                (1 + Number(weizhi.Grade || 0) * 0.05)
            ),
            暴击率: Number(monster.baoji || 0),
            灵根: monster.灵根 || { name: '野怪', type: '普通', 法球倍率: 0.1 },
            法球倍率: Number(monster.灵根?.法球倍率 || 0.1)
          }
          const Random = Math.random()
          const npc_damage = Math.trunc(
            Harm(B_player.攻击 * 0.85, Number(A_player.防御 || 0)) +
              Math.trunc(B_player.攻击 * B_player.法球倍率) +
              B_player.防御 * 0.1
          )
          let last_msg = ''
          if (Random < 0.1) {
            A_player.当前血量 = Number(A_player.当前血量 || 0) - npc_damage
            last_msg += `${B_player.名号}似乎不屑追你,只是随手丢出神通,剩余血量${A_player.当前血量}`
          } else if (Random < 0.25) {
            A_player.当前血量 =
              Number(A_player.当前血量 || 0) - Math.trunc(npc_damage * 0.3)
            last_msg += `你引起了${B_player.名号}的兴趣,${B_player.名号}决定试探你,只用了三分力,剩余血量${A_player.当前血量}`
          } else if (Random < 0.5) {
            A_player.当前血量 =
              Number(A_player.当前血量 || 0) - Math.trunc(npc_damage * 1.5)
            last_msg += `你的逃跑让${B_player.名号}愤怒,${B_player.名号}使用了更加强大的一次攻击,剩余血量${A_player.当前血量}`
          } else if (Random < 0.7) {
            A_player.当前血量 =
              Number(A_player.当前血量 || 0) - Math.trunc(npc_damage * 1.3)
            last_msg += `你成功的吸引了所有的仇恨,${B_player.名号}已经快要抓到你了,强大的攻击已经到了你的面前,剩余血量${A_player.当前血量}`
          } else if (Random < 0.9) {
            A_player.当前血量 =
              Number(A_player.当前血量 || 0) - Math.trunc(npc_damage * 1.8)
            last_msg += `你们近乎贴脸飞行,${B_player.名号}的攻势愈加猛烈,已经快招架不住了,剩余血量${A_player.当前血量}`
          } else {
            A_player.当前血量 =
              Number(A_player.当前血量 || 0) - Math.trunc(npc_damage * 0.5)
            last_msg += `身体快到极限了嘛,你暗暗问道,脚下逃跑的步伐更加迅速,剩余血量${A_player.当前血量}`
          }
          if (A_player.当前血量 < 0) A_player.当前血量 = 0
          const arr: ActionState = action
          const shop = await readShop()
          const slot = shop.find(s => s.name == weizhi.name) as
            | ShopSlotLike
            | undefined
          if (slot) slot.state = 0
          if (A_player.当前血量 > 0) {
            arr.A_player = A_player
            if (typeof arr.cishu === 'number') arr.cishu -= 1
          } else {
            const num = Number(weizhi.Grade || 0) + 1
            last_msg += `\n在躲避追杀中,没能躲过此劫,被抓进了天牢\n在天牢中你找到了秘境之匙x${num}`
            await addNajieThing(player_id, '秘境之匙', '道具', num)
            delete arr.group_id
            if (slot) slot.state = 0
            await writeShop(shop)
            const time = 60 //时间（分钟）
            const action_time = 60000 * time //持续时间，单位毫秒
            arr.action = '天牢'
            arr.xijie = 1 //关闭洗劫
            arr.end_time = Date.now() + action_time
            const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
            const groupList = await redis.smembers(redisGlKey)
            const notice = `【全服公告】${A_player.名号}被${B_player.名号}抓进了地牢,希望大家遵纪守法,引以为戒`
            for (const gid of groupList) pushInfo(gid, true, notice)
          }
          if ((arr.cishu || 0) === 0) {
            last_msg += '\n你成功躲过了万仙盟的追杀,躲进了宗门'
            arr.xijie = 1
            arr.end_time = Date.now()
            delete arr.group_id
            if (Array.isArray(arr.thing)) {
              for (const t of arr.thing) {
                if (!t) continue
                const tn = t.name
                const tc = isNajieCategory(t.class) ? t.class : '道具'
                const count = (t.数量 as number) || 0
                if (tn && count > 0)
                  await addNajieThing(player_id, tn, tc, count)
              }
            }
            if (slot) {
              if (typeof slot.Grade === 'number') {
                slot.Grade = Math.min(3, (slot.Grade || 0) + 1)
              }
              slot.state = 0
              await writeShop(shop)
            }
          }
          //写入redis
          await setDataByUserId(player_id, 'action', JSON.stringify(arr))
          msg.push('\n' + last_msg)
          if (is_group && push_address) {
            await pushInfo(push_address, is_group, msg.join('\n'))
          } else {
            await pushInfo(player_id, is_group, msg.join('\n'))
          }
        }
      }
    }
  }
})
