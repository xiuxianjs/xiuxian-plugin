import { data, pushInfo } from '@src/model/api'
import { addNajieThing, addExp4 } from '@src/model/index'
import { DataMention, Mention } from 'alemonjs'

interface PlayerLite {
  level_id: number
  occupation_level: number
  occupation?: string
  神魄段数?: number
}

function toNum(v: unknown, d = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : d
}

// 计算职业系数（使用经验表 experience 做近似归一化）
function calcOccupationFactor(occupation_level: number): number {
  const row = data.occupation_exp_list.find(r => r.id === occupation_level)
  if (!row) return 0
  const base = toNum(row.experience)
  // 经验越高系数越高，缩放到 0~1 区间再做一定倍率（经验表未知上限，做软归一）
  const factor = Math.min(base / 10000, 1)
  return factor
}

export async function plant_jiesuan(
  user_id: string,
  time: number,
  group_id?: string
) {
  const usr_qq = user_id
  const player = (await data.getData('player', usr_qq)) as PlayerLite | null
  if (!player) return false
  time = Math.max(1, toNum(time))
  // 经验
  const exp = time * 10
  // 基础倍率 (低境界减半)
  const k = player.level_id < 22 ? 0.5 : 1
  const occFactor = calcOccupationFactor(player.occupation_level)
  // 基础产量
  let sum = (time / 480) * (player.occupation_level * 2 + 12) * k
  if (player.level_id >= 36) {
    sum = (time / 480) * (player.occupation_level * 3 + 11)
  }
  // names 与概率向量
  const names = [
    '万年凝血草',
    '万年何首乌',
    '万年血精草',
    '万年甜甜花',
    '万年清心草',
    '古神藤',
    '万年太玄果',
    '炼骨花',
    '魔蕴花',
    '万年清灵草',
    '万年天魂菊',
    '仙蕴花',
    '仙缘草',
    '太玄仙草'
  ]
  // 低于36级时使用 sum2，之后使用 sum3。再乘一个职业系数上浮 (1 + occFactor*0.3)
  const sum2 = [0.2, 0.3, 0.2, 0.2, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const sum3 = [
    0.17, 0.22, 0.17, 0.17, 0.17, 0.024, 0.024, 0.024, 0.024, 0.024, 0.024,
    0.024, 0.012, 0.011
  ]
  const baseVec = player.level_id < 36 ? sum2 : sum3
  const mult = 1 + occFactor * 0.3
  const amounts = baseVec.map(p => p * sum * mult)

  const msg: Array<DataMention | string> = [Mention(usr_qq)]
  msg.push(`\n恭喜你获得了经验${exp},草药:`)
  for (let i = 0; i < amounts.length; i++) {
    const val = Math.floor(amounts[i])
    if (val <= 0) continue
    msg.push(`\n${names[i]}${val}个`)
    await addNajieThing(usr_qq, names[i], '草药', val)
  }
  await addExp4(usr_qq, exp)
  if (group_id) {
    await pushInfo(group_id, true, msg)
  } else {
    await pushInfo(usr_qq, false, msg)
  }
  return false
}

export async function mine_jiesuan(
  user_id: string,
  time: number,
  group_id?: string
) {
  const usr_qq = user_id
  const player = (await data.getData('player', usr_qq)) as PlayerLite | null
  if (!player) return false
  time = Math.max(1, toNum(time))
  // 基础经验
  const exp = time * 10
  const occFactor = calcOccupationFactor(player.occupation_level)
  // 使用 occupation_factor 代替原先不存在的 rate 字段，构造一个 0~1.5 的动态倍率
  const rate = occFactor * 1.5
  const mine_amount1 = Math.floor((1.8 + Math.random() * 0.4) * time)
  const ext = `你是采矿师，获得采矿经验${exp}，额外获得矿石${Math.floor(
    rate * 100
  )}%,`
  // 普通矿石量：4 * (rate + 1) * 基础 * 等级缩放
  let end_amount = Math.floor(4 * (rate + 1) * mine_amount1)
  end_amount = Math.floor(end_amount * (player.level_id / 40))
  // 锻造材料数量：按时间 & rate 缩放
  const num = Math.max(1, Math.floor(((rate / 12) * time) / 30))
  const A = [
    '金色石胚',
    '棕色石胚',
    '绿色石胚',
    '红色石胚',
    '蓝色石胚',
    '金色石料',
    '棕色石料',
    '绿色石料',
    '红色石料',
    '蓝色石料'
  ]
  const B = [
    '金色妖石',
    '棕色妖石',
    '绿色妖石',
    '红色妖石',
    '蓝色妖石',
    '金色妖丹',
    '棕色妖丹',
    '绿色妖丹',
    '红色妖丹',
    '蓝色妖丹'
  ]
  const xuanze = Math.trunc(Math.random() * A.length)
  await addNajieThing(usr_qq, '庚金', '材料', end_amount)
  await addNajieThing(usr_qq, '玄土', '材料', end_amount)
  await addNajieThing(usr_qq, A[xuanze], '材料', num)
  await addNajieThing(
    usr_qq,
    B[xuanze],
    '材料',
    Math.max(1, Math.trunc(num / 48))
  )
  await addExp4(usr_qq, exp)
  const msg: string[] = []
  msg.push(`\n采矿归来，${ext}\n收获庚金×${end_amount}\n玄土×${end_amount}`)
  msg.push(
    `\n${A[xuanze]}x${num}\n${B[xuanze]}x${Math.max(1, Math.trunc(num / 48))}`
  )
  if (group_id) {
    await pushInfo(group_id, true, msg.join(''))
  } else {
    await pushInfo(usr_qq, false, msg.join(''))
  }
  return false
}
