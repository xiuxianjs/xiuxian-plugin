import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import type { PlayerData } from '@src/types/domain'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?设置门槛.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const player = (await data.getData('player', usr_qq)) as PlayerData | null
  if (!player || typeof player !== 'object') {
    return false
  }
  if (!player.宗门) {
    Send(Text('你尚未加入宗门'))
    return false
  }
  const role = player.宗门?.职位
  const allow = role === '宗主' || role === '副宗主' || role === '长老'
  if (!allow) {
    Send(Text('只有宗主、副宗主或长老可以操作'))
    return false
  }

  const jiar = e.MessageText.replace(/^(#|＃|\/)?设置门槛/, '').trim()
  if (!jiar) {
    Send(Text('请输入境界名称'))
    return false
  }
  const levelInfo = data.Level_list.find(item => item.level === jiar)
  if (!levelInfo) {
    Send(Text('境界不存在'))
    return false
  }
  let jr_level_id = levelInfo.level_id

  const ass = await data.getAssociation(player.宗门.宗门名称)
  if (ass === 'error') return false
  if (ass.power === 0 && jr_level_id > 41) {
    jr_level_id = 41
    Send(Text('不知哪位大能立下誓言：凡界无仙！'))
  }
  if (ass.power === 1 && jr_level_id < 42) {
    jr_level_id = 42
    Send(Text('仅仙人可加入仙宗'))
  }

  ass.最低加入境界 = jr_level_id
  await data.setAssociation(ass.宗门名称, ass)
  Send(Text('已成功设置宗门门槛，当前门槛:' + jiar))
  return false
})
