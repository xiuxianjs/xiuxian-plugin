import { Text, useSend } from 'alemonjs'

import { redis } from '@src/model/api'
import { getDataList } from '@src/model/DataList'
import { getRedisKey, __PATH } from '@src/model/keys'
import {
  Go,
  readPlayer,
  notUndAndNull,
  addCoin,
  getConfig
} from '@src/model/index'
import type { Player, AssociationDetailData } from '@src/types'

import { selects } from '@src/response/mw'
import mw from '@src/response/mw'
export const regular = /^(#|＃|\/)?探索宗门秘境.*$/

interface PlayerGuildRef {
  宗门名称: string
  职位: string
}
function isPlayerGuildRef(v): v is PlayerGuildRef {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v
}
interface ExtAss extends AssociationDetailData {
  宗门驻地?: string | number
  灵石池?: number
  power?: number
}
function isExtAss(v): v is ExtAss {
  return !!v && typeof v === 'object' && 'power' in v
}

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const flag = await Go(e)
  if (!flag) return false

  const player = (await readPlayer(usr_qq)) as Player | null
  if (!player || !player.宗门 || !isPlayerGuildRef(player.宗门)) {
    Send(Text('请先加入宗门'))
    return false
  }
  const assData = await redis.get(`${__PATH.association}:${player.宗门.宗门名称}`)
  if (!assData) {
    Send(Text('宗门数据异常'))
    return
  }
  const assRaw = JSON.parse(assData)
  if (assRaw === 'error' || !isExtAss(assRaw)) {
    Send(Text('宗门数据不存在'))
    return false
  }
  const ass = assRaw
  if (!ass.宗门驻地 || ass.宗门驻地 === 0) {
    Send(Text('你的宗门还没有驻地，不能探索秘境哦'))
    return false
  }

  const didian = e.MessageText.replace(/^(#|＃|\/)?探索宗门秘境/, '').trim()
  if (!didian) {
    Send(Text('请在指令后面补充秘境名称'))
    return false
  }
  const listRaw = await getDataList('GuildSecrets')
  const weizhi = listRaw?.find(item => item.name === didian)
  if (!notUndAndNull(weizhi)) {
    Send(Text('未找到该宗门秘境'))
    return false
  }

  const playerCoin = Number(player.灵石 || 0)
  const price = Number(weizhi.Price || 0)
  if (price <= 0) {
    Send(Text('秘境费用配置异常'))
    return false
  }
  if (playerCoin < price) {
    Send(Text(`没有灵石寸步难行, 攒到${price}灵石才够哦~`))
    return false
  }

  // 灵石池收益 5% 向下取整
  const guildGain = Math.trunc(price * 0.05)
  ass.灵石池 = Math.max(0, Number(ass.灵石池 || 0)) + guildGain
  await redis.set(`${__PATH.association}:${ass.宗门名称}`, JSON.stringify(ass))

  await addCoin(usr_qq, -price)
  interface XiuxianConfig {
    CD?: { secretplace?: number }
  }
  const cfg = (await getConfig('xiuxian', 'xiuxian')) as XiuxianConfig
  const minute = cfg?.CD?.secretplace
  const time = typeof minute === 'number' && minute > 0 ? minute : 10
  const action_time = 60000 * time
  const arr = {
    action: '历练',
    end_time: Date.now() + action_time,
    time: action_time,
    shutup: '1',
    working: '1',
    Place_action: '0',
    Place_actionplus: '1',
    power_up: '1',
    group_id: e.ChannelId,
    Place_address: weizhi,
    XF: ass.power
  }
  await redis.set(getRedisKey(String(usr_qq), 'action'), JSON.stringify(arr))
  Send(
    Text(
      `开始探索 ${didian} 宗门秘境，${time} 分钟后归来! (扣除${price}灵石，上缴宗门${guildGain}灵石)`
    )
  )
  return false
})
export default onResponse(selects, [mw.current, res.current])
