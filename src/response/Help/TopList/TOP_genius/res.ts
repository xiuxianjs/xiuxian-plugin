import { Image, useSend, Text } from 'alemonjs'
import {
  __PATH,
  existplayer,
  keysByPath,
  readPlayer,
  sortBy
} from '@src/model/index'
import { screenshot } from '@src/image/index.js'
import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?至尊榜$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false
  //数组
  const temp = []

  const playerList = await keysByPath(__PATH.player_path)

  for (const file of playerList) {
    //(攻击+防御+生命*0.5)*暴击率=理论战力
    const player = await readPlayer(file)
    if (player.level_id >= 42) {
      //跳过仙人的记录
      continue
    }
    //计算并保存到数组
    const power = Math.trunc(
      (player.攻击 + player.防御 * 0.8 + player.血量上限 * 0.6) *
        (player.暴击率 + 1)
    )

    temp.push({
      power: power,
      qq: file,
      name: player.名号,
      level_id: player.level_id,
      灵石: player.灵石
    })
  }

  //根据力量排序
  temp.sort(sortBy('power'))

  //取前10名
  const top = temp.slice(0, 10)
  const image = await screenshot('immortal_genius', usr_qq, {
    allplayer: top,
    title: '至尊榜',
    label: '战力'
  })

  if (Buffer.isBuffer(image)) {
    Send(Image(image))
    return
  }

  Send(Text('图片生产失败'))
})
// #至尊榜
