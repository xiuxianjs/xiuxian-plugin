import { Text, useSend, Image } from 'alemonjs'
import fs from 'fs'
import { data } from '@src/api/api'
import {
  existplayer,
  __PATH,
  Read_player,
  Get_xiuwei,
  isNotNull,
  sortBy,
  get_ranking_power_img
} from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)天榜$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false

  let usr_paiming
  let File = fs.readdirSync(__PATH.player_path)
  File = File.filter(file => file.endsWith('.json'))
  let File_length = File.length
  let temp = []
  for (let i = 0; i < File_length; i++) {
    let this_qq = File[i].replace('.json', '')
    this_qq = parseInt(this_qq)
    let player = await Read_player(this_qq)
    let sum_exp = await Get_xiuwei(this_qq)
    if (!isNotNull(player.level_id)) {
      Send(Text('请先#同步信息'))
      return false
    }
    //境界名字需要查找境界名
    let level = data.Level_list.find(
      item => item.level_id == player.level_id
    ).level
    temp[i] = { 总修为: sum_exp, 境界: level, 名号: player.名号, qq: this_qq }
  }
  //排序
  temp.sort(sortBy('总修为'))
  usr_paiming = temp.findIndex(temp => temp.qq === usr_qq) + 1
  let Data = []
  if (File_length > 10) {
    File_length = 10
  } //最多显示前十
  for (let i = 0; i < File_length; i++) {
    temp[i].名次 = i + 1
    Data[i] = temp[i]
  }
  let thisplayer = await data.getData('player', usr_qq)
  let img = await get_ranking_power_img(e, Data, usr_paiming, thisplayer)
  if (img) Send(Image(img))
})
