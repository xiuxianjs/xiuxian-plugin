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
      const rawDy = await readDanyao(user_qq)
      interface LuckBuffLike {
        xingyun?: number
        beiyong5?: number
      }
      let needWrite = false
      // 兼容：遍历数组里包含 xingyun/beiyong5 字段的条目
      let xingyunAfter = -1
      for (const it of rawDy) {
        const ref = it as unknown as LuckBuffLike
        if (typeof ref.xingyun === 'number' && ref.xingyun >= 1) {
          ref.xingyun--
          xingyunAfter = ref.xingyun
          needWrite = true
        }
      }
      if (xingyunAfter === 0) {
        for (const it of rawDy) {
          const ref = it as unknown as LuckBuffLike
          if (typeof ref.beiyong5 === 'number' && ref.beiyong5 > 0) {
            ref.beiyong5 = 0
            needWrite = true
          }
        }
      }
      if (needWrite) await writeDanyao(user_qq, rawDy)
      await setValue(userKey(user_qq, 'action10'), arr)
      Send(Text(`现在开始锻造武器,最少需锻造30分钟,高级装备需要更多温养时间`))
      return false
    }
  }
})
