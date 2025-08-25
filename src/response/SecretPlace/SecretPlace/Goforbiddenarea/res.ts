import { Text, useSend } from 'alemonjs'

import { data, redis, config } from '@src/model/api'
import { getDataList } from '@src/model/DataList'
import { getRedisKey } from '@src/model/keys'
import { startAction } from '@src/response/actionHelper'
import {
  Go,
  readPlayer,
  notUndAndNull,
  addCoin,
  addExp
} from '@src/model/index'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?前往禁地.*$/

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const flag = await Go(e)
  if (!flag) {
    return false
  }
  const player = await readPlayer(usr_qq)
  // 当前境界 id
  if (!notUndAndNull(player.level_id)) {
    Send(Text('请先#同步信息'))
    return false
  }
  if (!notUndAndNull(player.power_place)) {
    Send(Text('请#同步信息'))
    return false
  }
  const levelList = await getDataList('Level1')
  const now_level_id = levelList?.find(
    item => item.level_id == player.level_id
  )?.level_id
  if (now_level_id < 22) {
    Send(Text('没有达到化神之前还是不要去了'))
    return false
  }
  let didian = await e.MessageText.replace(/^(#|＃|\/)?前往禁地/, '')
  didian = didian.trim()
  const forbiddenAreaList = await getDataList('ForbiddenArea')
  const weizhiRaw = forbiddenAreaList?.find(item => item.name == didian)
  // if (player.power_place == 0 && weizhi.id != 666) {
  //     Send(Text("仙人不得下凡")
  //     return  false;
  //  }
  if (!notUndAndNull(weizhiRaw)) {
    return false
  }
  const weizhiUnknown = weizhiRaw
  const guardWeizhi = (
    v
  ): v is { name: string; Price: number; experience: number } => {
    if (!v || typeof v !== 'object') return false
    const r = v
    return (
      typeof r.Price === 'number' &&
      typeof r.experience === 'number' &&
      typeof r.name === 'string'
    )
  }
  if (!guardWeizhi(weizhiUnknown)) {
    return false
  }
  const weizhi = weizhiUnknown
  if (player.灵石 < weizhi.Price) {
    Send(Text('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~'))
    return false
  }
  if (player.修为 < weizhi.experience) {
    Send(Text('你需要积累' + weizhi.experience + '修为，才能抵抗禁地魔气！'))
    return false
  }
  const Price = weizhi.Price
  await addCoin(usr_qq, -Price)
  await addExp(usr_qq, -weizhi.experience)
  const cf = await config.getConfig('xiuxian', 'xiuxian')
  const time = cf.CD.forbiddenarea //时间（分钟）
  const action_time = 60000 * time //持续时间，单位毫秒
  const arr = await startAction(usr_qq, '禁地', action_time, {
    shutup: '1',
    working: '1',
    Place_action: '0',
    Place_actionplus: '1',
    power_up: '1',
    mojie: '1',
    xijie: '1',
    plant: '1',
    mine: '1',
    Place_address: weizhi,
    group_id: e.name == 'message.create' ? e.ChannelId : undefined
  })
  await redis.set(getRedisKey(String(usr_qq), 'action'), JSON.stringify(arr))
  Send(Text('正在前往' + weizhi.name + ',' + time + '分钟后归来!'))
})
import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
