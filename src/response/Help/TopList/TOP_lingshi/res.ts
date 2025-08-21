import { Image, useSend } from 'alemonjs'
import { data } from '@src/model/api'
import {
  existplayer,
  __PATH,
  sortBy,
  sleep,
  readPlayer,
  keysByPath
} from '@src/model/index'
import { selects } from '@src/response/mw'
import { getRankingMoneyImage } from '@src/model/image'

export const regular = /^(#|＃|\/)?灵榜$/
export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  // 计算排名
  const playerList = await keysByPath(__PATH.player_path)

  const temp = []
  for (let i = 0; i < playerList.length; i++) {
    const player = await readPlayer(playerList[i])
    if (!player) continue
    temp.push(player)
  }
  let File_length = temp.length
  temp.sort(sortBy('灵石'))
  const Data = []
  const usr_paiming = temp.findIndex(temp => temp.qq === usr_qq) + 1
  if (File_length > 10) {
    File_length = 10
  } //最多显示前十
  for (let i = 0; i < File_length; i++) {
    temp[i].名次 = i + 1
    Data[i] = temp[i]
  }
  await sleep(500)
  const thisplayer = await await data.getData('player', usr_qq)
  const thisnajie = await await data.getData('najie', usr_qq)
  const img = await getRankingMoneyImage(
    e,
    Data,
    usr_paiming,
    thisplayer,
    thisnajie
  )
  if (Buffer.isBuffer(img)) {
    Send(Image(img))
  }
})
