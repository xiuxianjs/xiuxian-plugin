import { Image, Text, useSend } from 'alemonjs'

import { __PATH, existplayer, readPlayer, sortBy } from '@src/model/index'

import { selects } from '@src/response/index'
import { redis } from '@src/model/api'
import { screenshot } from '@src/image'
export const regular = /^(#|＃|\/)?镇妖塔榜$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false

  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  //数组
  const temp = []

  let i = 0
  for (const player_id of playerList) {
    //(攻击+防御*0.8+生命*0.5)*暴击率=理论战力
    const player = await readPlayer(player_id)
    //计算并保存到数组
    let power = player.镇妖塔层数
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

  const image = await screenshot('immortal_genius', usr_qq, {
    allplayer: top,
    title: '镇妖塔榜'
  })

  if (Buffer.isBuffer(image)) {
    Send(Image(image))
    return
  }

  Send(Text('图片生产失败'))
})
