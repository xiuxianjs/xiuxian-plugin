import { Text, useSend } from 'alemonjs'

import { data, redis, config } from '@src/model/api'
import { getDataList } from '@src/model/DataList'
import { getRedisKey } from '@src/model/keys'
import { startAction } from '@src/response/actionHelper'
import {
  Go,
  readPlayer,
  notUndAndNull,
  existNajieThing,
  addNajieThing,
  addCoin
} from '@src/model/index'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?镇守仙境.*$/

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const flag = await Go(e)
  if (!flag) {
    return false
  }
  const player = await readPlayer(usr_qq)
  let didian = e.MessageText.replace(/^(#|＃|\/)?镇守仙境/, '')
  didian = didian.trim()
  const fairyRealmList = await getDataList('FairyRealm')
  const weizhiRaw = fairyRealmList?.find(item => item.name == didian)
  if (!notUndAndNull(weizhiRaw)) {
    return false
  }
  const weizhiUnknown = weizhiRaw
  const guardWeizhi = (v): v is { name: string; Price: number } => {
    if (!v || typeof v !== 'object') return false
    const r = v
    return typeof r.Price === 'number' && typeof r.name === 'string'
  }
  if (!guardWeizhi(weizhiUnknown)) {
    return false
  }
  const weizhi = weizhiUnknown
  if (player.灵石 < weizhi.Price) {
    Send(Text('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~'))
    return false
  }
  const levelList = await getDataList('Level1')
  const now_level_id = levelList?.find(
    item => item.level_id == player.level_id
  )?.level_id
  if (now_level_id < 42 && player.lunhui == 0) {
    return false
  }
  let dazhe = 1
  if (
    (await existNajieThing(usr_qq, '杀神崖通行证', '道具')) &&
    player.魔道值 < 1 &&
    (player.灵根.type == '转生' || player.level_id > 41) &&
    didian == '杀神崖'
  ) {
    dazhe = 0
    Send(Text(player.名号 + '使用了道具杀神崖通行证,本次仙境免费'))
    await addNajieThing(usr_qq, '杀神崖通行证', '道具', -1)
  } else if (
    (await existNajieThing(usr_qq, '仙境优惠券', '道具')) &&
    player.魔道值 < 1 &&
    (player.灵根.type == '转生' || player.level_id > 41)
  ) {
    dazhe = 0.5
    Send(Text(player.名号 + '使用了道具仙境优惠券,本次消耗减少50%'))
    await addNajieThing(usr_qq, '仙境优惠券', '道具', -1)
  }
  const Price = weizhi.Price * dazhe
  await addCoin(usr_qq, -Price)
  const cf = await config.getConfig('xiuxian', 'xiuxian')
  const time = cf.CD.secretplace //时间（分钟）
  const action_time = 60000 * time //持续时间，单位毫秒
  const arr = await startAction(usr_qq, '历练', action_time, {
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
  Send(Text('开始镇守' + didian + ',' + time + '分钟后归来!'))
})
import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
