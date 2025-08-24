import { Text, useSend } from 'alemonjs'

import {
  addNajieThing,
  addCoin,
  convert2integer,
  existplayer,
  Go,
  readPlayer
} from '@src/model/index'
import { data } from '@src/model/api'
import type { NajieCategory } from '@src/types/model'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?购买((.*)|(.*)*(.*))$/

interface Commodity {
  name: string
  出售价: number
  class: NajieCategory | string
}
function toInt(v, d = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : d
}

const PRICE_RATE = 1.2
const MAX_QTY = 9999

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false
  if (!(await Go(e))) return false

  const raw = e.MessageText.replace(/^(#|＃|\/)?购买/, '').trim()
  if (!raw) {
    Send(Text('格式: 购买物品名*数量 (数量可省略)'))
    return false
  }
  const [rawName, rawQty] = raw.split('*')
  const thing_name = rawName?.trim()
  if (!thing_name) {
    Send(Text('物品名称不能为空'))
    return false
  }

  const commodity = (data.commodities_list as Commodity[]).find(
    item => item.name === thing_name
  )
  if (!commodity) {
    Send(Text(`柠檬堂还没有这样的东西: ${thing_name}`))
    return false
  }

  let qty = toInt(await convert2integer(rawQty), 1)
  if (!Number.isFinite(qty) || qty <= 0) qty = 1
  if (qty > MAX_QTY) qty = MAX_QTY

  const player = await readPlayer(usr_qq)
  if (!player) {
    Send(Text('存档异常'))
    return false
  }
  const lingshi = Number(player.灵石) || 0
  if (lingshi <= 0) {
    Send(Text('掌柜：就你这穷酸样，也想来柠檬堂？走走走！'))
    return false
  }

  const unitPrice = Math.max(0, Number(commodity.出售价) || 0)
  let totalPrice = Math.trunc(unitPrice * PRICE_RATE * qty)
  if (totalPrice <= 0) totalPrice = 1
  // 防溢出
  if (!Number.isFinite(totalPrice) || totalPrice > 1e15) {
    Send(Text('价格异常，购买已取消'))
    return false
  }

  if (lingshi < totalPrice) {
    Send(
      Text(
        `口袋里的灵石不足以支付 ${thing_name}, 还需要 ${totalPrice - lingshi} 灵石`
      )
    )
    return false
  }

  await addNajieThing(usr_qq, thing_name, commodity.class as NajieCategory, qty)
  await addCoin(usr_qq, -totalPrice)
  Send(
    Text(
      `购买成功! 获得[${thing_name}]*${qty}, 花费[${totalPrice}]灵石, 剩余[${lingshi - totalPrice}]灵石\n可以在【我的纳戒】中查看`
    )
  )
  return false
})
import mw from '@src/response/mw'
export default onResponse(selects, [mw.current, res.current])
