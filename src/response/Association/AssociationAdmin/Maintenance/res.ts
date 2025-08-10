import { Text, useSend } from 'alemonjs'

import { config, data } from '@src/api/api'
import { notUndAndNull, shijianc } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?(宗门维护|维护宗门)$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = await await data.getData('player', usr_qq)
  if (!notUndAndNull(player.宗门)) {
    return false
  }
  if (player.宗门.职位 != '宗主' && player.宗门.职位 != '副宗主') {
    Send(Text('只有宗主、副宗主可以操作'))
    return false
  }
  let ass = await await data.getAssociation(player.宗门.宗门名称)
  let now = new Date()
  let nowTime = now.getTime() //获取当前日期的时间戳
  let time: any = config.getConfig('xiuxian', 'xiuxian').CD.association
  let nextmt_time = await shijianc(ass.维护时间 + 60000 * time) //获得下次宗门维护日期,7天后
  if (ass.维护时间 > nowTime - 1000 * 60 * 60 * 24 * 7) {
    Send(
      Text(
        `当前无需维护,下次维护时间:${nextmt_time.Y}年${nextmt_time.M}月${nextmt_time.D}日${nextmt_time.h}时${nextmt_time.m}分${nextmt_time.s}秒`
      )
    )
    return false
  }
  if (ass.灵石池 < ass.宗门等级 * 50000) {
    Send(
      Text(`目前宗门维护需要${ass.宗门等级 * 50000}灵石,本宗门灵石池储量不足`)
    )
    return false
  }
  ass.灵石池 -= ass.宗门等级 * 50000
  ass.维护时间 = nowTime
  await data.setAssociation(ass.宗门名称, ass) //记录到宗门
  nextmt_time = await shijianc(ass.维护时间 + 60000 * time)
  Send(
    Text(
      `宗门维护成功,下次维护时间:${nextmt_time.Y}年${nextmt_time.M}月${nextmt_time.D}日${nextmt_time.h}时${nextmt_time.m}分${nextmt_time.s}秒`
    )
  )
})
