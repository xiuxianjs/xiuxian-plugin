import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import { existplayer, readPlayer } from '@src/model/index'
import { readTiandibang, Write_tiandibang } from '../tian'

import { selects } from '@src/response/mw'
import mw from '@src/response/mw'
export const regular = /^(#|＃|\/)?报名比赛/

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  //查看存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let tiandibang = []
  try {
    tiandibang = await readTiandibang()
  } catch {
    //没有表要先建立一个！
    await Write_tiandibang([])
  }

  if (!tiandibang.find(item => item.qq === usr_qq)) {
    const player = await readPlayer(usr_qq)
    const level_id = data.Level_list.find(
      item => item.level_id == player.level_id
    ).level_id
    const A_player = {
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
    return
  } else {
    Send(Text('你已经参赛了!'))
    return
  }
})

export default onResponse(selects, [mw.current, res.current])
