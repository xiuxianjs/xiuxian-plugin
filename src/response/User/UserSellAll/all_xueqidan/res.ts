import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { data } from 'api/api'
import {
  existplayer,
  exist_najie_thing,
  Add_najie_thing,
  Add_血气
} from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)一键服用血气丹$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false

  //检索方法
  let najie = await data.getData('najie', usr_qq)
  let xueqi = 0
  for (let l of najie.丹药) {
    if (l.type == '血气') {
      //纳戒中的数量
      let quantity = await exist_najie_thing(usr_qq, l.name, l.class)
      await Add_najie_thing(usr_qq, l.name, l.class, -quantity)
      xueqi = xueqi + l.xueqi * quantity
    }
  }
  await Add_血气(usr_qq, xueqi)
  Send(Text(`服用成功,血气增加${xueqi}`))
})
