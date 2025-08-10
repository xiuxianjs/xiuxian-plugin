import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import {
  existplayer,
  existNajieThing,
  addNajieThing,
  addExp2
} from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?一键服用血气丹$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  //有无存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false

  //检索方法
  const najie = await await data.getData('najie', usr_qq)
  let xueqi = 0
  for (const l of najie.丹药) {
    if (l.type == '血气') {
      //纳戒中的数量
      const quantity = await existNajieThing(usr_qq, l.name, l.class)
      await addNajieThing(usr_qq, l.name, l.class, -quantity)
      xueqi = xueqi + l.xueqi * quantity
    }
  }
  await addExp2(usr_qq, xueqi)
  Send(Text(`服用成功,血气增加${xueqi}`))
})
