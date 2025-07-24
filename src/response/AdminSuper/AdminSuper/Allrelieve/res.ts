import { Text, useSend } from 'alemonjs'
import { redis } from '@src/api/api'
import fs from 'fs'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?解除所有$/
import { __PATH } from '@src/model'
export default onResponse(selects, async e => {
  const Send = useSend(e)
  {
    if (!e.IsMaster) return false

    Send(Text('开始行动！'))

    const files = fs
      .readdirSync(__PATH.player_path)
      .filter(file => file.endsWith('.json'))
    for (const file of files) {
      const player_id = file.replace('.json', '')
      //清除游戏状态
      await redis.set('xiuxian@1.3.0:' + player_id + ':game_action', 1)
      const record = 'xiuxian@1.3.0:' + player_id + ':action'
      const action: any = await redis.get(record)
      //不为空，存在动作
      if (action) {
        await redis.del(record)
        let arr = JSON.parse(action)
        arr.is_jiesuan = 1 //结算状态
        arr.shutup = 1 //闭关状态
        arr.working = 1 //降妖状态
        arr.power_up = 1 //渡劫状态
        arr.Place_action = 1 //秘境
        arr.Place_actionplus = 1 //沉迷状态
        arr.end_time = new Date().getTime() //结束的时间也修改为当前时间
        delete arr.group_id //结算完去除group_id
        await redis.set(record, JSON.stringify(arr))
      }
    }
    Send(Text('行动结束！'))
  }
})
