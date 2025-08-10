import { data, pushInfo } from '@src/model/api'
import { addNajieThing, addExp4 } from '@src/model'
import { DataMention, Mention } from 'alemonjs'

export async function plant_jiesuan(user_id, time, group_id?) {
  const usr_qq = user_id
  const player = await data.getData('player', usr_qq)
  const msg: Array<DataMention | string> = [Mention(usr_qq)]
  let exp = 0
  exp = time * 10
  let k = 1
  if (player.level_id < 22) {
    k = 0.5
  }
  let sum = (time / 480) * (player.occupation_level * 2 + 12) * k
  if (player.level_id >= 36) {
    sum = (time / 480) * (player.occupation_level * 3 + 11)
  }
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
  const sum2 = [0.2, 0.3, 0.2, 0.2, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const sum3 = [
    0.17, 0.22, 0.17, 0.17, 0.17, 0.024, 0.024, 0.024, 0.024, 0.024, 0.024,
    0.024, 0.012, 0.011
  ]
  msg.push(`\n恭喜你获得了经验${exp},草药:`)
  let newsum = sum3.map(item => item * sum)
  if (player.level_id < 36) {
    newsum = sum2.map(item => item * sum)
  }
  for (const item in sum3) {
    if (newsum[item] < 1) {
      continue
    }
    msg.push(`\n${names[item]}${Math.floor(newsum[item])}个`)
    await addNajieThing(usr_qq, names[item], '草药', Math.floor(newsum[item]))
  }
  await addExp4(usr_qq, exp)
  if (group_id) {
    await pushInfo(group_id, true, msg)
  } else {
    await pushInfo(usr_qq, false, msg)
  }

  return false
}

export async function mine_jiesuan(user_id, time, group_id?) {
  const usr_qq = user_id
  const player = await data.getData('player', usr_qq)
  const msg = []
  const mine_amount1 = Math.floor((1.8 + Math.random() * 0.4) * time)
  const rate =
    data.occupation_exp_list.find(item => item.id == player.occupation_level)
      .rate * 10
  let exp = 0
  let ext = ''
  exp = time * 10
  ext = `你是采矿师，获得采矿经验${exp}，额外获得矿石${Math.floor(
    rate * 100
  )}%,`
  let end_amount = Math.floor(4 * (rate + 1) * mine_amount1) //普通矿石
  const num = Math.floor(((rate / 12) * time) / 30) //锻造
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
  end_amount *= player.level_id / 40
  end_amount = Math.floor(end_amount)
  await addNajieThing(usr_qq, '庚金', '材料', end_amount)
  await addNajieThing(usr_qq, '玄土', '材料', end_amount)
  await addNajieThing(usr_qq, A[xuanze], '材料', num)
  await addNajieThing(usr_qq, B[xuanze], '材料', Math.trunc(num / 48))
  await addExp4(usr_qq, exp)
  msg.push(`\n采矿归来，${ext}\n收获庚金×${end_amount}\n玄土×${end_amount}`)
  msg.push(`\n${A[xuanze]}x${num}\n${B[xuanze]}x${Math.trunc(num / 48)}`)
  if (group_id) {
    await pushInfo(group_id, true, msg.join(''))
  } else {
    await pushInfo(usr_qq, false, msg.join(''))
  }
  return false
}
