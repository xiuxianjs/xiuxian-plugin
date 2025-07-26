import { Text, useSend } from 'alemonjs'
import { readExchange, writeExchange, addNajieThing } from '@src/model'

import { selects } from '@src/response/index'
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

    for (let i of Exchange) {
      let usr_qq = i.qq
      let thing = i.name.name
      let quanity = i.aconut
      if (i.name.class == '装备' || i.name.class == '仙宠') thing = i.name
      await addNajieThing(usr_qq, thing, i.name.class, quanity, i.name.pinji)
    }
    await writeExchange([])
    Send(Text('清除完成！'))
    return false
  }
})
