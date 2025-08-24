import { Text, useSend } from 'alemonjs'

import {
  existplayer,
  looktripod,
  readTripod,
  writeDuanlu
} from '@src/model/index'
import { stopActionWithSuffix } from '@src/response/actionHelper'
import { setValue, userKey } from '@src/model/utils/redisHelper'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?清空锻炉/

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  const user_qq = e.UserId //用户qq
  //有无存档
  if (!(await existplayer(user_qq))) return false
  const A = await looktripod(user_qq)
  if (A == 1) {
    const newtripod = await readTripod()
    for (const item of newtripod) {
      if (user_qq == item.qq) {
        item.材料 = []
        item.数量 = []
        item.TIME = 0
        item.时长 = 30000
        item.状态 = 0
        item.预计时长 = 0
        await writeDuanlu(newtripod)
        await stopActionWithSuffix(user_qq, 'action10')
        // 显式清空 key（兼容旧逻辑使用 null）
        await setValue(userKey(user_qq, 'action10'), null)
        Send(Text('材料成功清除'))
        return false
      }
    }
  }
})
import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
