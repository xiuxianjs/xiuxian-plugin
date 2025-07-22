import { Text, useSend } from 'alemonjs'
import fs from 'fs'
import { existplayer, Read_player, sortBy } from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)镇妖塔榜$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let msg = ['___[镇妖塔榜]___']
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
        '\n镇妖塔层数：' +
        temp[j].power +
        '\nQQ:' +
        temp[j].qq
    )
  }
  // await ForwardMsg(e, msg)
  Send(Text(msg.join('\n')))
})
