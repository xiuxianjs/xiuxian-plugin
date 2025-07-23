import { Image, useSend } from 'alemonjs'

import { data, puppeteer } from '@src/api/api'
import { isNotNull } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)金银坊记录$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let qq = e.UserId
  let shenglv
  //获取人物信息
  let player_data = data.getData('player', qq)
  let victory = isNotNull(player_data.金银坊胜场) ? player_data.金银坊胜场 : 0
  let victory_num = isNotNull(player_data.金银坊收入)
    ? player_data.金银坊收入
    : 0
  let defeated = isNotNull(player_data.金银坊败场) ? player_data.金银坊败场 : 0
  let defeated_num = isNotNull(player_data.金银坊支出)
    ? player_data.金银坊支出
    : 0
  if (parseInt(victory) + parseInt(defeated) == 0) {
    shenglv = 0
  } else {
    shenglv = ((victory / (victory + defeated)) * 100).toFixed(2)
  }

  let img = await puppeteer.screenshot('moneyCheck', e.UserId, {
    user_qq: qq,
    victory,
    victory_num,
    defeated,
    defeated_num
  })
  if (img) Send(Image(img))
})
