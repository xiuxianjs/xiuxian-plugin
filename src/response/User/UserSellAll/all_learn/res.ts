import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import {
  existplayer,
  Read_player,
  Add_najie_thing,
  Add_player_学习功法
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?一键学习$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  //检索方法
  let najie = await data.getData('najie', usr_qq)
  let gongfa = []
  let player = await Read_player(usr_qq)
  let name = ''
  for (let l of najie.功法) {
    let islearned = player.学习的功法.find(item => item == l.name)
    if (!islearned) {
      await Add_najie_thing(usr_qq, l.name, '功法', -1)
      await Add_player_学习功法(usr_qq, l.name)
      name = name + ' ' + l.name
    }
  }
  if (name) {
    Send(Text(`你学会了${name},可以在【#我的炼体】中查看`))
  } else {
    Send(Text('无新功法'))
  }
})
