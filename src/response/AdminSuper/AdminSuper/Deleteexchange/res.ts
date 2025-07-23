import { Text, useSend } from 'alemonjs'
import { Read_Exchange, Write_Exchange, Add_najie_thing } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)清除冲水堂$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  {
    if (!e.IsMaster) return false

    Send(Text('开始清除！'))
    let Exchange
    try {
      Exchange = await Read_Exchange()
    } catch {
      //没有表要先建立一个！
      await Write_Exchange([])
      Exchange = await Read_Exchange()
    }
    for (let i of Exchange) {
      let usr_qq = i.qq
      let thing = i.name.name
      let quanity = i.aconut
      if (i.name.class == '装备' || i.name.class == '仙宠') thing = i.name
      await Add_najie_thing(usr_qq, thing, i.name.class, quanity, i.name.pinji)
    }
    await Write_Exchange([])
    Send(Text('清除完成！'))
    return false
  }
})
