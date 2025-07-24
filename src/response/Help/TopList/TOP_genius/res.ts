import { Image, useSend, Text } from 'alemonjs'
import fs from 'fs'
import { __PATH, existplayer, Read_player, sortBy } from '@src/model'
import puppeteer from '@src/image/index.js'
import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?至尊榜$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false
  //数组
  let temp = []
  const files = fs
    .readdirSync(__PATH.player_path)
    .filter(file => file.endsWith('.json'))
  for (let file of files) {
    file = file.replace('.json', '')
    //(攻击+防御+生命*0.5)*暴击率=理论战力
    const player = await Read_player(file)
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
  logger.info(temp)
  //取前10名
  const top = temp.slice(0, 10)
  const image = await puppeteer.screenshot('immortal_genius', usr_qq, {
    allplayer: top
  })
  if (!image) {
    Send(Text('图片生产失败'))
    return false
  }
  Send(Image(image))
})
// #至尊榜
