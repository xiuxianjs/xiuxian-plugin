import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import {
  Add_najie_thing,
  Add_灵石,
  convert2integer,
  existplayer,
  Go,
  Read_player
} from 'model'
import { data } from 'api/api'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)购买((.*)|(.*)*(.*))$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let flag = await Go(e)
  if (!flag) {
    return false
  }
  let thing = e.MessageText.replace('#', '')
  thing = thing.replace('购买', '')
  let code = thing.split('*')
  let thing_name = code[0]
  let ifexist = data.commodities_list.find(item => item.name == thing_name)
  if (!ifexist) {
    Send(Text(`柠檬堂还没有这样的东西:${thing_name}`))
    return false
  }
  let quantity = await convert2integer(code[1])
  let player = await Read_player(usr_qq)
  let lingshi: any = player.灵石
  //如果没钱，或者为负数
  if (lingshi <= 0) {
    Send(Text(`掌柜：就你这穷酸样，也想来柠檬堂？走走走！`))
    return false
  }
  // 价格倍率
  //价格
  let commodities_price = ifexist.出售价 * 1.2 * quantity
  commodities_price = Math.trunc(commodities_price)
  //判断金额
  if (lingshi < commodities_price) {
    Send(
      Text(
        `口袋里的灵石不足以支付${thing_name},还需要${
          commodities_price - lingshi
        }灵石`
      )
    )
    return false
  }
  //符合就往戒指加
  await Add_najie_thing(usr_qq, thing_name, ifexist.class, quantity)
  await Add_灵石(usr_qq, -commodities_price)
  //发送消息
  Send(
    Text(
      [
        `购买成功!  获得[${thing_name}]*${quantity},花[${commodities_price}]灵石,剩余[${
          lingshi - commodities_price
        }]灵石  `,
        '\n可以在【我的纳戒】中查看'
      ].join('')
    )
  )
})
