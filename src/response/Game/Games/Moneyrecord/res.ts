import { Image, useSend } from 'alemonjs'

import { data, puppeteer } from '@src/model/api'
import { notUndAndNull } from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?金银坊记录$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const qq = e.UserId
  let shenglv: string | number
  //获取人物信息
  const player_data = await data.getData('player', qq)
  const victory = notUndAndNull(player_data.金银坊胜场)
    ? player_data.金银坊胜场
    : 0
  const victory_num = notUndAndNull(player_data.金银坊收入)
    ? player_data.金银坊收入
    : 0
  const defeated = notUndAndNull(player_data.金银坊败场)
    ? player_data.金银坊败场
    : 0
  const defeated_num = notUndAndNull(player_data.金银坊支出)
    ? player_data.金银坊支出
    : 0
  if (parseInt(victory) + parseInt(defeated) == 0) {
    shenglv = 0
  } else {
    shenglv = ((victory / (victory + defeated)) * 100).toFixed(2)
  }

  const img = await puppeteer.screenshot('moneyCheck', e.UserId, {
    user_qq: qq,
    victory,
    victory_num,
    defeated,
    defeated_num,
    shenglv
  })
  if (img) Send(Image(img))
})
