import { Text, useSend } from 'alemonjs'
// 直接引用底层模块，避免通过聚合 xiuxian.ts 引起的 chunk 循环
import { readExchange, writeExchange } from '@src/model/trade'
import { addNajieThing } from '@src/model/najie'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?清除冲水堂$/

export default onResponse(selects, async e => {
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
      let thing = i.name.name
      const quanity = i.aconut
      if (i.name.class == '装备' || i.name.class == '仙宠') thing = i.name
      await addNajieThing(usr_qq, thing, i.name.class, quanity, i.name.pinji)
    }
    await writeExchange([])
    Send(Text('清除完成！'))
    return false
  }
})
