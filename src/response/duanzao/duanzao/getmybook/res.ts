import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { data } from 'api/api'
import { existplayer, settripod } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)炼器师能力评测/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const user_qq = e.UserId //用户qq
  //有无存档
  if (!(await existplayer(user_qq))) {
    return false
  }
  const player = await data.getData('player', user_qq)
  if (player.occupation != '炼器师') {
    Send(Text(`你还不是炼器师哦,宝贝`))
    return false
  }
  if (player.锻造天赋) {
    Send(Text(`您已经测评过了`))
    return false
  }
  const b = await settripod(user_qq)
  Send(Text(b))
})
