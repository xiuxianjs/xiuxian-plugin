import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import {
  existplayer,
  readPlayer,
  convert2integer,
  notUndAndNull,
  existNajieThing,
  addNajieThing,
  addExp4
} from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?炼制.*(\*[0-9]*)?$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  const player = await readPlayer(usr_qq)
  if (player.occupation != '炼丹师') {
    Send(Text('丹是上午炼的,药是中午吃的,人是下午走的'))
    return false
  }
  let t: any = e.MessageText.replace(/^(#|＃|\/)?炼制/, '').split('*')
  if (+t <= 0) {
    t = 1
  }
  const danyao = t[0]
  let n = await convert2integer(t[1])
  let tmp_msg = ''
  const danfang = data.danfang_list.find(item => item.name == danyao)
  if (!notUndAndNull(danfang)) {
    Send(Text(`世界上没有丹药[${danyao}]的配方`))
    return false
  }
  if (danfang.level_limit > player.occupation_level) {
    Send(Text(`${danfang.level_limit}级炼丹师才能炼制${danyao}`))
    return false
  }
  const materials = danfang.materials
  const exp = danfang.exp
  tmp_msg += '消耗'
  for (const i in materials) {
    const material = materials[i]
    let x = await existNajieThing(usr_qq, material.name, '草药')
    if (x == false) {
      x = 0
    }
    if (x < material.amount * n) {
      Send(
        Text(
          `纳戒中拥有${material.name}${x}份，炼制需要${material.amount * n}份`
        )
      )
      return false
    }
  }
  for (const i in materials) {
    const material = materials[i]
    tmp_msg += `${material.name}×${material.amount * n}，`
    await addNajieThing(usr_qq, material.name, '草药', -material.amount * n)
  }
  const total_exp = exp[1] * n
  if (player.仙宠.type == '炼丹') {
    const random = Math.random()
    if (random < player.仙宠.加成) {
      n *= 2
      Send(
        Text(
          '你的仙宠' + player.仙宠.name + '辅佐了你进行炼丹,成功获得了双倍丹药'
        )
      )
    } else {
      Send(Text('你的仙宠只是在旁边看着'))
    }
  }
  if (
    danyao == '神心丹' ||
    danyao == '九阶淬体丹' ||
    danyao == '九阶玄元丹' ||
    danyao == '起死回生丹'
  ) {
    await addNajieThing(usr_qq, danyao, '丹药', n)
    Send(Text(`${tmp_msg}得到${danyao}${n}颗，获得炼丹经验${total_exp}`))
  } else {
    const dengjixiuzheng = player.occupation_level
    const newrandom = Math.random()
    const newrandom2 = Math.random()
    if (newrandom >= 0.1 + (dengjixiuzheng * 3) / 100) {
      await addNajieThing(usr_qq, '凡品' + danyao, '丹药', n)
      Send(
        Text(`${tmp_msg}得到"凡品"${danyao}${n}颗，获得炼丹经验${total_exp}`)
      )
    } else {
      if (newrandom2 >= 0.4) {
        await addNajieThing(usr_qq, '极品' + danyao, '丹药', n)
        Send(
          Text(`${tmp_msg}得到"极品"${danyao}${n}颗，获得炼丹经验${total_exp}`)
        )
      } else {
        await addNajieThing(usr_qq, '仙品' + danyao, '丹药', n)
        Send(
          Text(`${tmp_msg}得到"仙品"${danyao}${n}颗，获得炼丹经验${total_exp}`)
        )
      }
    }
  }
  await addExp4(usr_qq, total_exp)
})
