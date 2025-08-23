import { Text, useSend } from 'alemonjs'
// 直接引用底层模块，避免通过聚合 xiuxian.ts 引起的 chunk 循环
import { readExchange, writeExchange } from '@src/model/trade'
import { addNajieThing } from '@src/model/najie'

import { selects } from '@src/response/mw'
import mw from '@src/response/mw'
export const regular = /^(#|＃|\/)?清除冲水堂$/

const res = onResponse(selects, async e => {
  const Send = useSend(e)
  {
    if (!e.IsMaster) return false

    Send(Text('开始清除！'))
    let Exchange = []
    try {
      Exchange = await readExchange()
    } catch {
      //
    }

    for (const i of Exchange) {
      const usr_qq = i.qq
      let thing = i.thing.name
      const quanity = i.aconut
      if (i.thing.class == '装备' || i.thing.class == '仙宠') thing = i.thing
      await addNajieThing(usr_qq, thing, i.thing.class, quanity, i.thing.pinji)
    }
    await writeExchange([])
    Send(Text('清除完成！'))
    return false
  }
})

export default onResponse(selects, [mw.current, res.current])
