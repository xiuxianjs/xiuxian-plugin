import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { data } from '@src/api/api'
import { isNotNull } from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)召唤神兽$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  //8级宗门，有驻地，灵石200w

  let usr_qq = e.UserId
  //用户不存在
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = data.getData('player', usr_qq)
  //无宗门
  if (!isNotNull(player.宗门)) {
    Send(Text('你尚未加入宗门'))
    return false
  }
  //职位不符
  if (player.宗门.职位 == '宗主') {
    logger.info('通过')
  } else {
    Send(Text('只有宗主可以操作'))
    return false
  }

  let ass = data.getAssociation(player.宗门.宗门名称)
  if (ass.宗门等级 < 8) {
    Send(Text(`宗门等级不足，尚不具备召唤神兽的资格`))
    return false
  }
  if (ass.宗门建设等级 < 50) {
    Send(Text(`宗门建设等级不足,木头墙木头地板的不怕神兽把宗门拆了？`))
    return false
  }
  if (ass.宗门驻地 == 0) {
    Send(Text(`驻地都没有，让神兽跟你流浪啊？`))
    return false
  }
  if (ass.灵石池 < 2000000) {
    Send(Text(`宗门就这点钱，还想神兽跟着你干活？`))
    return false
  }
  if (ass.宗门神兽 != 0) {
    Send(Text(`你的宗门已经有神兽了`))
    return false
  }
  //校验都通过了，可以召唤神兽了
  let random = Math.random()
  if (random > 0.8) {
    //给丹药,隐藏神兽,赐福时气血和修为都加,宗门驻地等级提高一级
    ass.宗门神兽 = '麒麟'
  } else if (random > 0.6) {
    //给功法，赐福加修为
    ass.宗门神兽 = '青龙'
  } else if (random > 0.4) {
    //给护具，赐福加气血
    ass.宗门神兽 = '玄武'
  } else if (random > 0.2) {
    //给法宝，赐福加修为
    ass.宗门神兽 = '朱雀'
  } else {
    //给武器 赐福加气血
    ass.宗门神兽 = '白虎'
  }

  ass.灵石池 -= 2000000
  await data.setAssociation(ass.宗门名称, ass)
  Send(
    Text(
      `召唤成功，神兽${ass.宗门神兽}投下一道分身，开始守护你的宗门，绑定神兽后不可更换哦`
    )
  )
  return false
})
