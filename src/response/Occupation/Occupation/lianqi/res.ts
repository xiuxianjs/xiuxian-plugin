import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import {
  existplayer,
  readPlayer,
  existNajieThing,
  addNajieThing,
  sleep,
  Add_职业经验
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?打造.*(\*[0-9]*)?$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let player = await readPlayer(usr_qq)
  if (player.occupation != '炼器师') {
    Send(Text('铜都不炼你还炼器？'))
    return false
  }
  let t = e.MessageText.replace(/^(#|＃|\/)?打造/, '').split('*')
  let equipment_name = t[0]
  let suc_rate = 0
  let tmp_msg1 = ''
  let tmp_msg2 = ''
  let tuzhi = data.tuzhi_list.find(item => item.name == equipment_name)
  if (!tuzhi) {
    Send(Text(`世界上没有[${equipment_name}]的图纸`))
    return false
  }
  let materials = tuzhi.materials
  let exp = tuzhi.exp
  let res_exp
  suc_rate += tuzhi.rate

  let rate = 0

  if (player.occupation_level > 0) {
    rate = data.occupation_exp_list.find(
      item => item.id == player.occupation_level
    ).rate
    rate = rate * 10
    rate = rate * 0.025
  }
  if (player.occupation == '炼器师') {
    tmp_msg1 += `你是炼器师，额外增加成功率${Math.floor(
      rate * 10
    )}%(以乘法算)，`
    suc_rate *= 1 + rate
    if (player.occupation_level >= 24) {
      suc_rate = 0.8
    }
    res_exp = exp[0]
    tmp_msg2 += `，获得炼器经验${res_exp}`
  }
  tmp_msg1 += '消耗'
  for (let i in materials) {
    let material = materials[i]
    let x = await existNajieThing(usr_qq, material.name, '材料')
    if (x < material.amount || !x) {
      Send(
        Text(`纳戒中拥有${material.name}×${x}，打造需要${material.amount}份`)
      )
      return false
    }
  }
  for (let i in materials) {
    let material = materials[i]
    tmp_msg1 += `${material.name}×${material.amount}，`
    await addNajieThing(usr_qq, material.name, '材料', -material.amount)
  }
  let rand1 = Math.random()
  if (rand1 > suc_rate) {
    let random = Math.random()
    if (random < 0.5) {
      Send(Text(`打造装备时不小心锤断了刃芯，打造失败！`))
    } else {
      Send(Text(`打造装备时没有把控好火候，烧毁了，打造失败！`))
    }
    return false
  }
  let pinji = Math.trunc(Math.random() * 7)
  if (pinji > 5) {
    Send(Text('在你细致的把控下，一把绝世极品即将问世！！！！'))
    await sleep(10000)
  }
  await addNajieThing(usr_qq, equipment_name, '装备', 1, pinji)
  await Add_职业经验(usr_qq, res_exp)
  Send(
    Text(
      `${tmp_msg1}打造成功，获得${equipment_name}(${
        ['劣', '普', '优', '精', '极', '绝', '顶'][pinji]
      })×1${tmp_msg2}`
    )
  )
})
