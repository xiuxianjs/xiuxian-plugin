import { Image, useSend, Text } from 'alemonjs'

import { data } from '@src/model/api'

import { selects } from '@src/response/mw'
import mw from '@src/response/mw'
import { screenshot } from '@src/image'
export const regular = /^(#|＃|\/)?金银坊记录$/

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  const qq = e.UserId

  const player_raw = await data.getData('player', qq)
  if (!player_raw || player_raw === 'error' || Array.isArray(player_raw)) {
    return false
  }
  const player_data = player_raw

  const toNum = (v): number => {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }
  const victory = toNum(player_data.金银坊胜场)
  const victory_num = toNum(player_data.金银坊收入)
  const defeated = toNum(player_data.金银坊败场)
  const defeated_num = toNum(player_data.金银坊支出)

  const totalRounds = victory + defeated
  const shenglv =
    totalRounds > 0 ? ((victory / totalRounds) * 100).toFixed(2) : '0'

  const img = await screenshot('moneyCheck', e.UserId, {
    user_qq: qq,
    victory,
    victory_num,
    defeated,
    defeated_num,
    shenglv
  })
  if (!img) {
    Send(Text('生成记录失败'))
    return false
  }
  Send(Image(img))
  return false
})

export default onResponse(selects, [mw.current, res.current])
