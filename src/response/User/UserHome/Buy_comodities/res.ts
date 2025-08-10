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

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?购买((.*)|(.*)*(.*))$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  //有无存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  const flag = await Go(e)
  if (!flag) {
    return false
  }
  const thing = e.MessageText.replace(/^(#|＃|\/)?购买/, '')
  const code = thing.split('*')
  const thing_name = code[0]
  const ifexist = data.commodities_list.find(item => item.name == thing_name)
  if (!ifexist) {
    Send(Text(`柠檬堂还没有这样的东西:${thing_name}`))
    return false
  }
  const quantity = await convert2integer(code[1])
  const player = await readPlayer(usr_qq)
  const lingshi: any = player.灵石
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
  await addNajieThing(usr_qq, thing_name, ifexist.class, quantity)
  await addCoin(usr_qq, -commodities_price)
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
