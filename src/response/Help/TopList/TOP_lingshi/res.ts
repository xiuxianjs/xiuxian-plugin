import { Image, useSend } from 'alemonjs'
import fs from 'fs'
import { data } from '@src/api/api'
import {
  existplayer,
  __PATH,
  readPlayer,
  readNajie,
  sortBy,
  sleep
} from '@src/model'
import { selects } from '@src/response/index'
import { getRankingMoneyImage } from '@src/model/image'

export const regular = /^(#|＃|\/)?灵榜$/
export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let usr_paiming
  let File = fs
    .readdirSync(__PATH.player_path)
    .filter(file => file.endsWith('.json'))
  let File_length = File.length
  let temp = []
  for (let i = 0; i < File_length; i++) {
    let this_qq = File[i].replace('.json', '')
    let player = await readPlayer(this_qq)
    let najie = await readNajie(this_qq)
    let lingshi: any = player.灵石 + najie.灵石
    temp[i] = {
      ls1: najie.灵石,
      ls2: player.灵石,
      灵石: lingshi,
      名号: player.名号,
      qq: this_qq
    }
  }
  //排序
  temp.sort(sortBy('灵石'))
  let Data = []
  usr_paiming = temp.findIndex(temp => temp.qq === usr_qq) + 1
  if (File_length > 10) {
    File_length = 10
  } //最多显示前十
  for (let i = 0; i < File_length; i++) {
    temp[i].名次 = i + 1
    Data[i] = temp[i]
  }
  await sleep(500)
  let thisplayer = await data.getData('player', usr_qq)
  let thisnajie = await data.getData('najie', usr_qq)
  let img = await getRankingMoneyImage(
    e,
    Data,
    usr_paiming,
    thisplayer,
    thisnajie
  )
  if (img) Send(Image(img))
})
