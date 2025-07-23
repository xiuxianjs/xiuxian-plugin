import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import {
  existplayer,
  exist_najie_thing,
  Add_najie_thing,
  Add_修为
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?一键服用修为丹$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  //检索方法
  let najie = await data.getData('najie', usr_qq)
  let xiuwei = 0
  for (let l of najie.丹药) {
    if (l.type == '修为') {
      //纳戒中的数量
      let quantity = await exist_najie_thing(usr_qq, l.name, l.class)
      await Add_najie_thing(usr_qq, l.name, l.class, -quantity)
      xiuwei = xiuwei + l.exp * quantity
    }
  }
  await Add_修为(usr_qq, xiuwei)
  Send(Text(`服用成功,修为增加${xiuwei}`))
})
