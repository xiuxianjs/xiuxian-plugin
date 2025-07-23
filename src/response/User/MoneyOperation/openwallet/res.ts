import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import {
  existplayer,
  exist_najie_thing,
  Add_najie_thing,
  Add_灵石
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?打开钱包$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let player = await data.getData('player', usr_qq)
  let thing_name = '水脚脚的钱包'
  //x是纳戒内有的数量
  let acount = await exist_najie_thing(usr_qq, thing_name, '装备')
  //没有
  if (!acount) {
    Send(Text(`你没有[${thing_name}]这样的装备`))
    return false
  }
  //扣掉装备
  await Add_najie_thing(usr_qq, thing_name, '装备', -1)
  //获得随机
  const x = 0.4
  let random1 = Math.random()
  const y = 0.3
  let random2 = Math.random()
  const z = 0.2
  let random3 = Math.random()
  const p = 0.1
  let random4 = Math.random()
  let m = ''
  let lingshi: any = 0
  //查找秘境
  if (random1 < x) {
    if (random2 < y) {
      if (random3 < z) {
        if (random4 < p) {
          lingshi = 2000000
          m =
            player.名号 +
            '打开了[' +
            thing_name +
            ']金光一现！' +
            lingshi +
            '颗灵石！'
        } else {
          lingshi = 1000000
          m =
            player.名号 +
            '打开了[' +
            thing_name +
            ']金光一现!' +
            lingshi +
            '颗灵石！'
        }
      } else {
        lingshi = 400000
        m =
          player.名号 +
          '打开了[' +
          thing_name +
          ']你很开心的得到了' +
          lingshi +
          '颗灵石！'
      }
    } else {
      lingshi = 180000
      m =
        player.名号 +
        '打开了[' +
        thing_name +
        ']你很开心的得到了' +
        lingshi +
        '颗灵石！'
    }
  } else {
    lingshi = 100000
    m =
      player.名号 +
      '打开了[' +
      thing_name +
      ']你很开心的得到了' +
      lingshi +
      '颗灵石！'
  }
  await Add_灵石(usr_qq, lingshi)
  Send(Text(m))
  return false
})
