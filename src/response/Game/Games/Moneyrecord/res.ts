import { Image, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { data, Show, puppeteer } from 'api/api'
import { isNotNull } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
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
  const data1 = await new Show(e).get_jinyin({
    user_qq: qq,
    victory,
    victory_num,
    defeated,
    defeated_num
  })
  let img = await puppeteer.screenshot('moneyCheck', e.UserId, { ...data1 })
  if (img) Send(Image(img))
})
