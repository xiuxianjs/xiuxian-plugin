import { Text, useSend } from 'alemonjs'

import { redis } from '@src/api/api'
import {
  existplayer,
  looktripod,
  readTripod,
  writeDuanlu,
  readDanyao,
  writeDanyao
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?开始炼制/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let user_qq = e.UserId
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
  for (let item of newtripod) {
    if (user_qq == item.qq) {
      if (item.材料.length == 0) {
        Send(Text(`炉子为空,无法炼制`))
        return false
      }
      let action_res = await redis.get('xiuxian@1.3.0:' + user_qq + ':action10')
      const action = JSON.parse(action_res)
      if (action != null) {
        //人物有动作查询动作结束时间
        let action_end_time = action.end_time
        let now_time = new Date().getTime()
        if (now_time <= action_end_time) {
          let m = Math.floor((action_end_time - now_time) / 1000 / 60)
          let s = Math.floor(
            (action_end_time - now_time - m * 60 * 1000) / 1000
          )
          Send(
            Text('正在' + action.action + '中，剩余时间:' + m + '分' + s + '秒')
          )
          return false
        }
      }
      item.状态 = 1
      item.TIME = Date.now()
      await writeDuanlu(newtripod)
      let action_time = 180 * 60 * 1000 //持续时间，单位毫秒
      let arr = {
        action: '锻造', //动作
        end_time: new Date().getTime() + action_time, //结束时间
        time: action_time //持续时间
      }
      let dy = await readDanyao(user_qq)
      if (dy.xingyun >= 1) {
        dy.xingyun--
        if (dy.xingyun == 0) {
          dy.beiyong5 = 0
        }
      }
      await writeDanyao(user_qq, dy)
      await redis.set(
        'xiuxian@1.3.0:' + user_qq + ':action10',
        JSON.stringify(arr)
      ) //redis设置动作
      Send(Text(`现在开始锻造武器,最少需锻造30分钟,高级装备需要更多温养时间`))
      return false
    }
  }
})
