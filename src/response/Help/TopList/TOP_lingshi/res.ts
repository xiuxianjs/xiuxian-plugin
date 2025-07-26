import { Image, useSend } from 'alemonjs'
import { data, redis } from '@src/api/api'
import { existplayer, __PATH, sortBy, sleep } from '@src/model'
import { selects } from '@src/response/index'
import { getRankingMoneyImage } from '@src/model/image'

export const regular = /^(#|＃|\/)?灵榜$/
export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let usr_paiming
  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  let temp = []
  let TotalPlayer = 0
  for (const player_id of playerList) {
    const player = await await data.getData('player', player_id)
    if (player.level_id > 21 && player.level_id < 42 && player.lunhui == 0) {
      temp[TotalPlayer] = parseInt(player.攻击)
      logger.info(`[灵榜] ${player_id}玩家攻击:${temp[TotalPlayer]}`)
      TotalPlayer++
    }
  }
  //排序
  temp.sort(function (a, b) {
    return b - a
  })
  let File_length = temp.length
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
  let thisplayer = await await data.getData('player', usr_qq)
  let thisnajie = await await data.getData('najie', usr_qq)
  let img = await getRankingMoneyImage(
    e,
    Data,
    usr_paiming,
    thisplayer,
    thisnajie
  )
  if (img) Send(Image(img))
})
