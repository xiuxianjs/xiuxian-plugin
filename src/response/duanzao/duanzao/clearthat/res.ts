import { Text, useSend } from 'alemonjs'

import { redis } from '@src/api/api'
import { existplayer, looktripod, readTripod, writeDuanlu } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?清空锻炉/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const user_qq = e.UserId //用户qq
  //有无存档
  if (!(await existplayer(user_qq))) return false
  const A = await looktripod(user_qq)
  if (A == 1) {
    let newtripod = await readTripod()
    for (let item of newtripod) {
      if (user_qq == item.qq) {
        item.材料 = []
        item.数量 = []
        item.TIME = 0
        item.时长 = 30000
        item.状态 = 0
        item.预计时长 = 0
        await writeDuanlu(newtripod)
        let action: any = null
        await redis.set(
          'xiuxian@1.3.0:' + user_qq + ':action10',
          JSON.stringify(action)
        )
        Send(Text('材料成功清除'))
        return false
      }
    }
  }
})
