import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { data } from 'api/api'
import { isNotNull, timestampToTime, player_efficiency } from 'model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)加入宗门.*$/

const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27]
export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = data.getData('player', usr_qq)
  if (isNotNull(player.宗门)) return false
  let now_level_id
  if (!isNotNull(player.level_id)) {
    Send(Text('请先#同步信息'))
    return false
  }
  let association_name = e.MessageText.replace('#加入宗门', '')
  association_name = association_name.trim()
  let ifexistass = data.existData('association', association_name)
  if (!ifexistass) {
    Send(Text('这方天地不存在' + association_name))
    return false
  }
  let ass = data.getAssociation(association_name)
  now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  if (now_level_id >= 42 && ass.power == 0) {
    Send(Text('仙人不可下界！'))
    return false
  }
  if (now_level_id < 42 && ass.power == 1) {
    Send(Text('你在仙界吗？就去仙界宗门'))
    return false
  }

  if (ass.最低加入境界 > now_level_id) {
    let level = data.Level_list.find(
      item => item.level_id === ass.最低加入境界
    ).level
    Send(
      Text(
        `${association_name}招收弟子的最低境界要求为:${level},当前未达到要求`
      )
    )
    return false
  }
  let mostmem = 宗门人数上限[ass.宗门等级 - 1] //该宗门目前人数上限
  let nowmem = ass.所有成员.length //该宗门目前人数
  if (mostmem <= nowmem) {
    Send(Text(`${association_name}的弟子人数已经达到目前等级最大,无法加入`))
    return false
  }
  let now = new Date()
  let nowTime = now.getTime() //获取当前时间戳
  let date = timestampToTime(nowTime)
  player.宗门 = {
    宗门名称: association_name,
    职位: '外门弟子',
    time: [date, nowTime]
  }
  data.setData('player', usr_qq, player)
  ass.所有成员.push(usr_qq)
  ass.外门弟子.push(usr_qq)
  await player_efficiency(usr_qq)
  data.setAssociation(association_name, ass)
  Send(Text(`恭喜你成功加入${association_name}`))
})
