import { Text, useSend, createSelects } from 'alemonjs'
import fs from 'fs'
import { createEventName } from '@src/response/util'
import { existplayer, Read_player, sortBy } from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)封神榜$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let msg = ['___[封神榜]___']
  let playerList = []
  //数组
  let temp = []
  let files = fs
    .readdirSync('./resources/data/xiuxian_player')
    .filter(file => file.endsWith('.json'))
  for (let file of files) {
    file = file.replace('.json', '')
    playerList.push(file)
  }
  let i = 0
  for (let player_id of playerList) {
    //(攻击+防御*0.8+生命*0.5)*暴击率=理论战力
    let player = await Read_player(player_id)
    //计算并保存到数组
    let power =
      player.攻击 * 0.9 +
      player.防御 * 1.1 +
      player.血量上限 * 0.6 +
      player.暴击率 * player.攻击 * 0.5
    if (player.level_id < 42) {
      //跳过凡人
      continue
    }
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
  if (temp.length > 10) {
    //只要十个
    length = 10
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
        '\n战力：' +
        temp[j].power +
        '\nQQ:' +
        temp[j].qq
    )
  }
  // await ForwardMsg(e, msg)
  Send(Text(msg.join('\n')))
})
