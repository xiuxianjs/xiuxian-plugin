import { Text, useSend } from 'alemonjs'
// import { Add_najie_thing } from '@src/model/xiuxian'

import { selects } from '@src/response/index'
export const regular =
  /^(#|＃|\/)?将米娜桑的纳戒里叫.*的的的(装备|道具|丹药|功法|草药|材料|仙宠|口粮)(抹除|替换为叫.*之之之(装备|道具|丹药|功法|草药|材料|仙宠|口粮))$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  Send(Text('功能暂未开放'))
  //   {
  //   if (!e.IsMaster) return false
  //   const msg1 = e.MessageText.replace(/^(#|＃|\/)?将米娜桑的纳戒里叫/, '')
  //   const [thingName, msg2] = msg1.split('的的的')

  //   // #将米娜桑的纳戒里叫.*的的的(装备|道具|丹药|功法|草药|材料|盒子|仙宠|口粮|项链|食材)(抹除|替换为叫.*之之之(装备|道具|丹药|功法|草药|材料|盒子|仙宠|口粮|项链|食材))$
  //   if (e.MessageText.endsWith('抹除')) {
  //     const thingType = msg2.replace(/抹除$/, '')
  //     if (!thingName || !thingType)
  //       return Send(Text(
  //         '格式错误，正确格式范例：#将米娜桑的纳戒里叫1w的的的道具替换为叫1k之之之道具'
  //       ))
  //     // await clearNajieThing(thingType, thingName)
  //     return Send(Text('全部抹除完成'))
  //   }

  //   // 替换为
  //   const N = 1 // 倍数
  //   const [thingType, msg3] = msg2.split('替换为叫')
  //   const [newThingName, newThingType] = msg3.split('之之之')
  //   // const objArr = await clearNajieThing(thingType, thingName)
  //   objArr.map((uid_tnum) => {
  //     const usrId = Object.entries(uid_tnum)[0][0]
  //     Add_najie_thing(usrId, newThingName, newThingType, uid_tnum.usrId * N)
  //   })
  //   return Send(Text('全部替换完成'))
  // }
})
