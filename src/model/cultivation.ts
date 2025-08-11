// 修行/渡劫/物品查询等逻辑抽离
import data from './XiuxianData.js'
import { useSend, Text, EventsMessageCreateEnum } from 'alemonjs'
import type { Player, TalentInfo } from '../types/player.js'
import { writePlayer, writeIt } from './pub.js'
import { readItTyped } from './duanzaofu.js'
import { existNajieThing, addNajieThing } from './najie.js'
import { readPlayer } from './xiuxian_impl.js'
import { getRandomFromARR, notUndAndNull } from './common.js'

// 概率常量保持与原文件一致
const 体质概率 = 0.2
const 伪灵根概率 = 0.37
const 真灵根概率 = 0.29
const 天灵根概率 = 0.08
const 圣体概率 = 0.01

export async function dujie(user_qq: string): Promise<number> {
  const player: Player | null = await readPlayer(user_qq)
  if (!player) return 0
  let new_blood = player.当前血量 / 100000
  let new_defense = player.防御 / 100000
  let new_attack = player.攻击 / 100000
  new_blood = (new_blood * 4) / 10
  new_defense = (new_defense * 6) / 10
  new_attack = (new_attack * 2) / 10
  const N = new_blood + new_defense
  let x = N * new_attack
  if (player.灵根.type == '真灵根') x = x * 1.5
  else if (player.灵根.type == '天灵根') x = x * 1.75
  else x = x * 2
  return Number(Number(x).toFixed(2))
}

export async function LevelTask(
  e: EventsMessageCreateEnum,
  power_n: number,
  power_m: number,
  power_Grade: number,
  aconut: number
): Promise<number> {
  const usr_qq = e.UserId
  const Send = useSend(e)
  const msg: string[] = [Number(usr_qq).toString()]
  const player: Player | null = await readPlayer(usr_qq)
  if (!player) {
    Send(Text('玩家数据不存在'))
    return 0
  }
  let power_distortion = await dujie(usr_qq)
  const yaocaolist = ['凝血草', '小吉祥草', '大吉祥草']
  for (const j in yaocaolist) {
    const num = await existNajieThing(usr_qq, yaocaolist[j], '草药')
    if (num) {
      msg.push(`[${yaocaolist[j]}]为你提高了雷抗\n`)
      power_distortion = Math.trunc(power_distortion * (1 + 0.2 * Number(j)))
      await addNajieThing(usr_qq, yaocaolist[j], '草药', -1)
    }
    let variable = Math.random() * (power_m - power_n) + power_n
    variable = variable + aconut / 10
    variable = Number(variable)
    if (power_distortion >= variable) {
      if (aconut >= power_Grade) {
        player.power_place = 0
        await writePlayer(usr_qq, player)
        msg.push(
          `\n${player.名号}成功度过了第${aconut}道雷劫！可以#登仙，飞升仙界啦！`
        )
        Send(Text(msg.join('')))
        return 0
      } else {
        const act = (variable - power_n) / (power_m - power_n)
        player.当前血量 = Math.trunc(player.当前血量 - player.当前血量 * act)
        await writePlayer(usr_qq, player)
        msg.push(
          `\n本次雷伤：${variable.toFixed(2)}\n本次雷抗：${power_distortion}\n${player.名号}成功度过了第${aconut}道雷劫！\n下一道雷劫在一分钟后落下！`
        )
        Send(Text(msg.join('')))
        return 1
      }
    } else {
      player.当前血量 = 1
      player.修为 = Math.trunc(player.修为 * 0.5)
      player.power_place = 1
      await writePlayer(usr_qq, player)
      msg.push(
        `\n本次雷伤${variable.toFixed(2)}\n本次雷抗：${power_distortion}\n第${aconut}道雷劫落下了，可惜${player.名号}未能抵挡，渡劫失败了！`
      )
      Send(Text(msg.join('')))
      return 0
    }
  }
  return 0
}

export function sortBy<T extends Record<string, number>>(field: keyof T) {
  return function (b: T, a: T) {
    return (a[field] as number) - (b[field] as number)
  }
}

export async function getAllExp(usr_qq: string) {
  const player = await readPlayer(usr_qq)
  let sum_exp = 0
  if (!notUndAndNull(player?.level_id)) return
  const now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  if (now_level_id < 65) {
    for (let i = 1; i < now_level_id; i++) {
      sum_exp += data.Level_list.find(temp => temp.level_id == i).exp
    }
  } else {
    sum_exp = -999999999
  }
  sum_exp += player.修为
  return sum_exp
}

export function getRandomRes(P: number) {
  if (P > 1) P = 1
  if (P < 0) P = 0
  return Math.random() < P
}

export async function getRandomTalent(): Promise<TalentInfo> {
  let talent
  if (getRandomRes(体质概率)) {
    talent = data.talent_list.filter(item => item.type == '体质')
  } else if (getRandomRes(伪灵根概率 / (1 - 体质概率))) {
    talent = data.talent_list.filter(item => item.type == '伪灵根')
  } else if (getRandomRes(真灵根概率 / (1 - 伪灵根概率 - 体质概率))) {
    talent = data.talent_list.filter(item => item.type == '真灵根')
  } else if (
    getRandomRes(天灵根概率 / (1 - 真灵根概率 - 伪灵根概率 - 体质概率))
  ) {
    talent = data.talent_list.filter(item => item.type == '天灵根')
  } else if (
    getRandomRes(
      圣体概率 / (1 - 真灵根概率 - 伪灵根概率 - 体质概率 - 天灵根概率)
    )
  ) {
    talent = data.talent_list.filter(item => item.type == '圣体')
  } else {
    talent = data.talent_list.filter(item => item.type == '变异灵根')
  }
  return getRandomFromARR<TalentInfo>(talent as TalentInfo[])
}

export async function setFileValue(
  user_qq: string,
  num: number,
  type: string
): Promise<void> {
  const user_data = await data.getData('player', user_qq)
  if (user_data === 'error' || Array.isArray(user_data)) return
  const player = user_data as Player
  const current_raw = (player as Record<string, unknown>)[type]
  const current_num = typeof current_raw === 'number' ? current_raw : 0
  let new_num = current_num + num
  if (type == '当前血量' && new_num > player.血量上限) new_num = player.血量上限
  ;(player as Record<string, unknown>)[type] = new_num
  // DataControl.setData 在 XiuxianData 上被继承；使用可选链防御
  const maybe = data as {
    setData?: (k: string, id: string, v: unknown) => void
  }
  if (typeof maybe.setData === 'function') {
    maybe.setData('player', user_qq, player)
  }
}

export type FoundThing = { name: string; [k: string]: unknown }
export async function foundthing(
  thing_name: string
): Promise<FoundThing | false> {
  const primaryGroups = [
    'equipment_list',
    'danyao_list',
    'daoju_list',
    'gongfa_list',
    'caoyao_list',
    'timegongfa_list',
    'timeequipmen_list',
    'timedanyao_list',
    'newdanyao_list',
    'xianchon',
    'xianchonkouliang',
    'duanzhaocailiao'
  ] as const
  const hasName = (obj: unknown): obj is FoundThing =>
    typeof obj === 'object' && obj !== null && 'name' in obj
  for (const key of primaryGroups) {
    const arr = (data as unknown as Record<string, unknown>)[key]
    if (Array.isArray(arr)) {
      for (const j of arr) if (hasName(j) && j.name === thing_name) return j
    }
  }
  let customList: unknown
  try {
    customList = await readItTyped()
  } catch {
    await writeIt([])
    customList = []
  }
  if (Array.isArray(customList)) {
    for (const j of customList)
      if (hasName(j) && j.name === thing_name) return j
  }
  const simplifiedName = thing_name.replace(/[0-9]+/g, '')
  const secondaryGroups = [
    'duanzhaowuqi',
    'duanzhaohuju',
    'duanzhaobaowu',
    'zalei'
  ] as const
  for (const key of secondaryGroups) {
    const arr = (data as unknown as Record<string, unknown>)[key]
    if (Array.isArray(arr)) {
      for (const j of arr) if (hasName(j) && j.name === simplifiedName) return j
    }
  }
  return false
}

export default {
  LevelTask,
  dujie,
  sortBy,
  getAllExp,
  getRandomTalent,
  getRandomRes,
  setFileValue,
  foundthing
}
