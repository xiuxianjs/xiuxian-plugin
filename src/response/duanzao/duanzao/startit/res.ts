import { Text, useSend } from 'alemonjs'

import {
  existplayer,
  looktripod,
  readTripod,
  writeDuanlu,
  readDanyao,
  writeDanyao
} from '@src/model/index'
import {
  readActionWithSuffix,
  isActionRunning,
  startActionWithSuffix,
  remainingMs,
  formatRemaining
} from '@src/response/actionHelper'
import { setValue, userKey } from '@src/model/utils/redisHelper'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?开始炼制/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const user_qq = e.UserId
  if (!(await existplayer(user_qq))) return false
  const A = await looktripod(user_qq)
  if (A != 1) {
    Send(Text(`请先去#炼器师能力评测,再来锻造吧`))
    return false
  }

  let newtripod = []
  try {
    newtripod = await readTripod()
  } catch {
    await writeDuanlu([])
  }
  for (const item of newtripod) {
    if (user_qq == item.qq) {
      if (item.材料.length == 0) {
        Send(Text(`炉子为空,无法炼制`))
        return false
      }
      const action = await readActionWithSuffix(user_qq, 'action10')
      if (isActionRunning(action)) {
        Send(
          Text(
            `正在${action!.action}中，剩余时间:${formatRemaining(remainingMs(action!))}`
          )
        )
        return false
      }
      item.状态 = 1
      item.TIME = Date.now()
      await writeDuanlu(newtripod)
      const action_time = 180 * 60 * 1000 //持续时间，单位毫秒
      const arr = await startActionWithSuffix(
        user_qq,
        'action10',
        '锻造',
        action_time,
        {}
      )
      const dy = await readDanyao(user_qq)
      if (dy.xingyun >= 1) {
        dy.xingyun--
        if (dy.xingyun == 0) {
          dy.beiyong5 = 0
        }
      }
      await writeDanyao(user_qq, dy)
      await setValue(userKey(user_qq, 'action10'), arr)
      Send(Text(`现在开始锻造武器,最少需锻造30分钟,高级装备需要更多温养时间`))
      return false
    }
  }
})
