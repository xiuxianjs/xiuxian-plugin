import { redis, data, pushInfo } from '@src/model/api'
import { notUndAndNull } from '@src/model/common'
import { zdBattle } from '@src/model/battle'
import { addNajieThing } from '@src/model/najie'
import { readShop, writeShop, existshop } from '@src/model/shop'
import { __PATH } from '@src/model/paths'
import { scheduleJob } from 'node-schedule'
import { getDataByUserId, setDataByUserId } from '@src/model/Redis'
import type { RaidActionState } from '@src/types'

scheduleJob('0 0/1 * * * ?', async () => {
  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  for (const player_id of playerList) {
    let log_mag = '' //查询当前人物动作日志信息
    log_mag = log_mag + '查询' + player_id + '是否有动作,'
    //得到动作

    const raw = await getDataByUserId(player_id, 'action')
    let action: RaidActionState | null = null
    try {
      action = raw ? (JSON.parse(raw) as RaidActionState) : null
    } catch {
      action = null
    }
    //不为空，存在动作
    if (action != null) {
      let push_address //消息推送地址
      let is_group = false //是否推送到群

      if (Object.prototype.hasOwnProperty.call(action, 'group_id')) {
        if (notUndAndNull(action.group_id)) {
          is_group = true
          push_address = action.group_id as string
        }
      }

      //最后发送的消息
      const msg = []
      //动作结束时间
      let end_time = action.end_time
      //现在的时间
      const now_time = Date.now()

      //有洗劫状态:这个直接结算即可
      if (action.xijie == '0') {
        //10分钟后开始结算阶段一
        const durRaw =
          typeof action.time === 'number'
            ? action.time
            : parseInt(String(action.time || 0), 10)
        const dur = isNaN(durRaw) ? 0 : durRaw
        end_time = (end_time as number) - dur + 60000 * 10
        //时间过了
        if (typeof end_time === 'number' && now_time >= end_time) {
          const weizhi = action.Place_address
          if (!weizhi) continue
          let i //获取对应npc列表的位置
          for (i = 0; i < data.npc_list.length; i++) {
            if (data.npc_list[i].name == weizhi.name) {
              break
            }
          }
          const A_player = action.A_player!
          let monster_length
          let monster_index
          let monster
          if (weizhi.Grade == 1) {
            monster_length = data.npc_list[i].one.length
            monster_index = Math.trunc(Math.random() * monster_length)
            monster = data.npc_list[i].one[monster_index]
          } else if (weizhi.Grade == 2) {
            monster_length = data.npc_list[i].two.length
            monster_index = Math.trunc(Math.random() * monster_length)
            monster = data.npc_list[i].two[monster_index]
          } else {
            monster_length = data.npc_list[i].three.length
            monster_index = Math.trunc(Math.random() * monster_length)
            monster = data.npc_list[i].three[monster_index]
          }
          //设定npc数值
          const B_player = {
            名号: monster.name,
            攻击: Math.floor(monster.atk * A_player.攻击),
            防御: Math.floor(
              (monster.def * A_player.防御) / (1 + weizhi.Grade * 0.05)
            ),
            当前血量: Math.floor(
              (monster.blood * A_player.当前血量) / (1 + weizhi.Grade * 0.05)
            ),
            暴击率: monster.baoji,
            灵根: monster.灵根,
            法球倍率: monster.灵根.法球倍率
          }
          let Data_battle
          let last_msg = ''
          // 构造满足 BattleEntity 最小字段的参战对象（填补缺失字段的默认值）
          const talent = A_player.灵根
          const getTalentName = (t: unknown): string =>
            typeof t === 'object' && t != null && 'name' in t
              ? String((t as { name: unknown }).name)
              : '凡灵根'
          const getTalentType = (t: unknown): string =>
            typeof t === 'object' && t != null && 'type' in t
              ? String((t as { type: unknown }).type)
              : '普通'
          const getTalentRate = (t: unknown): number =>
            typeof t === 'object' && t != null && '法球倍率' in t
              ? Number((t as { 法球倍率: unknown }).法球倍率) || 1
              : 1
          const A_battle = {
            名号: A_player.名号,
            攻击: A_player.攻击,
            防御: A_player.防御,
            当前血量: A_player.当前血量,
            暴击率: A_player.暴击率 ?? 0.05,
            灵根: {
              name: getTalentName(talent),
              type: getTalentType(talent),
              法球倍率: getTalentRate(talent)
            }
          }

          if ((A_player.魔值 ?? 0) === 0) {
            //根据魔道值决定先后手顺序 (0 视为先手)
            Data_battle = await zdBattle(A_battle, B_player)
            last_msg += A_player.名号 + '悄悄靠近' + B_player.名号
            A_player.当前血量 += Data_battle.A_xue
          } else {
            Data_battle = await zdBattle(B_player, A_battle)
            last_msg += A_player.名号 + '杀气过重,被' + B_player.名号 + '发现了'
            A_player.当前血量 += Data_battle.B_xue
          }
          const msgg = Data_battle.msg
          logger.info(msgg)
          const A_win = `${A_player.名号}击败了${B_player.名号}`
          const B_win = `${B_player.名号}击败了${A_player.名号}`
          const arr = action
          // 后续阶段会重新以 const 定义 time / action_time
          if (msgg.find(item => item == A_win)) {
            const time = 10 //时间（分钟）
            const action_time = 60000 * time //持续时间，单位毫秒
            arr.A_player = A_player
            arr.action = '搜刮'
            arr.end_time = Date.now() + action_time
            arr.time = action_time
            arr.xijie = -1 //进入二阶段
            last_msg +=
              ',经过一番战斗,击败对手,剩余' +
              A_player.当前血量 +
              '血量,开始搜刮物品'
          } else if (msgg.find(item => item == B_win)) {
            const num = weizhi.Grade
            last_msg +=
              ',经过一番战斗,败下阵来,被抓进了地牢\n在地牢中你找到了秘境之匙x' +
              num
            await addNajieThing(player_id, '秘境之匙', '道具', num)
            //结算完去除
            delete arr.group_id
            const shop = await readShop()
            for (i = 0; i < shop.length; i++) {
              if (shop[i].name == weizhi.name) {
                shop[i].state = 0
                break
              }
            }
            await writeShop(shop)
            const time = 60 //时间（分钟）
            const action_time = 60000 * time //持续时间，单位毫秒
            arr.action = '禁闭'
            arr.xijie = 1 //关闭洗劫
            arr.end_time = Date.now() + action_time
            const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
            const groupList = await redis.smembers(redisGlKey)
            const xx =
              '【全服公告】' +
              A_player.名号 +
              '被' +
              B_player.名号 +
              '抓进了地牢,希望大家遵纪守法,引以为戒'
            for (const group_id of groupList) {
              pushInfo(group_id, true, xx)
            }
          }
          //写入redis
          await setDataByUserId(player_id, 'action', JSON.stringify(arr))
          msg.push('\n' + last_msg)
          if (is_group) {
            await pushInfo(push_address, is_group, msg.join('\n'))
          } else {
            await pushInfo(player_id, is_group, msg.join('\n'))
          }
        }
      } else if (action.xijie == '-1') {
        //5分钟后开始结算阶段二
        const dur2Raw =
          typeof action.time === 'number'
            ? action.time
            : parseInt(String(action.time || 0), 10)
        const dur2 = isNaN(dur2Raw) ? 0 : dur2Raw
        end_time = (end_time as number) - dur2 + 60000 * 5
        //时间过了
        if (typeof end_time === 'number' && now_time >= end_time) {
          const weizhi = action.Place_address
          let thing = await existshop(weizhi.name)
          const arr = action
          let last_msg = ''
          const thing_name = []
          let shop = await readShop()
          let i
          for (i = 0; i < shop.length; i++) {
            if (shop[i].name == weizhi.name) {
              break
            }
          }
          if (!thing) {
            //没有物品,进入下一阶段
            last_msg += '已经被搬空了'
          } else {
            const gradeNum = Number(shop[i].Grade ?? 0) || 0
            let x = gradeNum * 2
            while (x > 0 && thing != false) {
              const t = (() => {
                const thing_index = Math.trunc(Math.random() * thing.length)
                return thing[thing_index]
              })() //临时存储物品名
              thing_name.push(t)
              shop = await readShop()
              for (let j = 0; j < shop[i].one.length; j++) {
                if (shop[i].one[j].name == t.name && shop[i].one[j].数量 > 0) {
                  shop[i].one[j].数量 = 0
                  await writeShop(shop)
                  break
                }
              }
              thing = await existshop(weizhi.name)
              x--
            }
            last_msg += '经过一番搜寻' + arr.A_player.名号 + '找到了'
            for (let j = 0; j < thing_name.length; j++) {
              last_msg += '\n' + thing_name[j].name + ' x ' + thing_name[j].数量
            }
            last_msg +=
              '\n刚出门就被万仙盟的人盯上了,他们仗着人多，你一人无法匹敌，于是撒腿就跑'
          }
          arr.action = '逃跑'
          const time = 30 //时间（分钟）
          const action_time = 60000 * time //持续时间，单位毫秒
          arr.end_time = Date.now() + action_time
          arr.time = action_time
          arr.xijie = -2 //进入三阶段
          arr.thing = thing_name
          const gradeNumFinal = Number(action.Place_address?.Grade ?? 0) || 0
          arr.cishu = gradeNumFinal + 1
          //写入redis
          await setDataByUserId(player_id, 'action', JSON.stringify(arr))

          msg.push('\n' + last_msg)
          if (is_group) {
            await pushInfo(push_address, is_group, msg.join('\n'))
          } else {
            await pushInfo(player_id, is_group, msg.join('\n'))
          }
        }
      }
    }
  }
})
