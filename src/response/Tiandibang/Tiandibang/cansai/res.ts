import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import { existplayer, Read_player } from '@src/model'
import { Read_tiandibang, Write_tiandibang } from '../tian'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?报名比赛/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //查看存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let tiandibang
  try {
    tiandibang = await Read_tiandibang()
  } catch {
    //没有表要先建立一个！
    await Write_tiandibang([])
    tiandibang = await Read_tiandibang()
  }
  let x = tiandibang.length
  for (let i = 0; i < tiandibang.length; i++) {
    if (tiandibang[i].qq == usr_qq) {
      x = i
      break
    }
  }
  if (x == tiandibang.length) {
    let player = await Read_player(usr_qq)
    let level_id = data.Level_list.find(
      item => item.level_id == player.level_id
    ).level_id
    let A_player = {
      名号: player.名号,
      境界: level_id,
      攻击: player.攻击,
      防御: player.防御,
      当前血量: player.血量上限,
      暴击率: player.暴击率,
      灵根: player.灵根,
      法球倍率: player.灵根.法球倍率,
      学习的功法: player.学习的功法,
      qq: usr_qq,
      次数: 0,
      积分: 0
    }

    tiandibang.push(A_player)
    await Write_tiandibang(tiandibang)
    Send(Text('参赛成功!'))
    return false
  } else {
    Send(Text('你已经参赛了!'))
    return false
  }
})
