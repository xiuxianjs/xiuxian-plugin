import { Text, useSend } from 'alemonjs'

import { __PATH, existplayer, readPlayer, sortBy } from '@src/model'

import { selects } from '@src/response/index'
import { redis } from '@src/model/api'
export const regular = /^(#|＃|\/)?强化榜$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  const msg = ['___[强化榜]___']

  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  //数组
  const temp = []

  let i = 0
  for (const player_id of playerList) {
    //(攻击+防御+生命*0.5)*暴击率=理论战力
    const player = await readPlayer(player_id)
    //计算并保存到数组
    let power = player.攻击加成 + player.防御加成 + player.生命加成
    power = Math.trunc(power)
    temp[i] = {
      power: power,
      qq: player_id,
      name: player.名号,
      level_id: player.level_id
    }
    i++
  }
  //根据力量排序
  temp.sort(sortBy('power'))
  logger.info(temp)
  let length
  if (temp.length > 20) {
    //只要十个
    length = 20
  } else {
    length = temp.length
  }
  let j
  for (j = 0; j < length; j++) {
    msg.push(
      '第' +
        (j + 1) +
        '名' +
        '\n道号：' +
        temp[j].name +
        '\n强化值：' +
        temp[j].power +
        '\nQQ:' +
        temp[j].qq
    )
  }
  // await ForwardMsg(e, msg)
  Send(Text(msg.join('\n')))
  return false
})
