import { Image, Text, useSend } from 'alemonjs'

import { redis, puppeteer } from '@src/model/api'
import { existplayer } from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?赏金榜$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let action: any = await redis.get('xiuxian@1.3.0:' + 1 + ':shangjing')
  action = await JSON.parse(action)
  if (action == null) {
    Send(Text('悬赏已经被抢空了')) //没人被悬赏
    return false
  }
  for (let i = 0; i < action.length - 1; i++) {
    let count = 0
    for (let j = 0; j < action.length - i - 1; j++) {
      if (action[j].赏金 < action[j + 1].赏金) {
        const t = action[j]
        action[j] = action[j + 1]
        action[j + 1] = t
        count = 1
      }
    }
    if (count == 0) break
  }
  await redis.set('xiuxian@1.3.0:' + 1 + ':shangjing', JSON.stringify(action))
  const type = 1
  const msg_data = { msg: action, type }

  const img = await puppeteer.screenshot('msg', e.UserId, msg_data)
  if (img) Send(Image(img))
})
