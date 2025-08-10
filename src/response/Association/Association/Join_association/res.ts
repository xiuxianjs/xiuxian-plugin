import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import { notUndAndNull, timestampToTime, playerEfficiency } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?加入宗门.*$/

const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27]
export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) return false
  const player = await data.getData('player', usr_qq)
  if (notUndAndNull(player.宗门)) return false
  if (!notUndAndNull(player.level_id)) {
    Send(Text('请先#同步信息'))
    return false
  }
  const now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  let association_name = e.MessageText.replace(/^(#|＃|\/)?加入宗门/, '')
  association_name = association_name.trim()
  const ifexistass = await data.existData('association', association_name)
  if (!ifexistass) {
    Send(Text('这方天地不存在' + association_name))
    return false
  }
  const assRaw = await data.getAssociation(association_name)
  if (assRaw === 'error') {
    Send(Text('没有这个宗门'))
    return
  }
  const ass = assRaw as {
    power: number
    最低加入境界: number
    宗门等级: number
    所有成员: string[]
    外门弟子: string[]
  }
  // now_level_id 已获取
  if (now_level_id >= 42 && ass.power == 0) {
    Send(Text('仙人不可下界！'))
    return false
  }
  if (now_level_id < 42 && ass.power == 1) {
    Send(Text('你在仙界吗？就去仙界宗门'))
    return false
  }

  if (ass.最低加入境界 > now_level_id) {
    const level = data.Level_list.find(
      item => item.level_id === ass.最低加入境界
    ).level
    Send(
      Text(
        `${association_name}招收弟子的最低境界要求为:${level},当前未达到要求`
      )
    )
    return false
  }
  const mostmem = 宗门人数上限[ass.宗门等级 - 1] //该宗门目前人数上限
  const nowmem = ass.所有成员.length //该宗门目前人数
  if (mostmem <= nowmem) {
    Send(Text(`${association_name}的弟子人数已经达到目前等级最大,无法加入`))
    return false
  }
  const now = new Date()
  const nowTime = now.getTime() //获取当前时间戳
  const date = timestampToTime(nowTime)
  player.宗门 = {
    宗门名称: association_name,
    职位: '外门弟子',
    time: [date, nowTime]
  }
  data.setData('player', usr_qq, player)
  ass.所有成员.push(usr_qq)
  ass.外门弟子.push(usr_qq)
  await playerEfficiency(usr_qq)
  data.setAssociation(association_name, ass)
  Send(Text(`恭喜你成功加入${association_name}`))
})
