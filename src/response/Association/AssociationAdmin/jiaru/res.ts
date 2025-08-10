import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import { notUndAndNull } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?设置门槛.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const player = await await data.getData('player', usr_qq)
  if (!notUndAndNull(player.宗门)) return false
  if (
    player.宗门.职位 == '宗主' ||
    player.宗门.职位 == '副宗主' ||
    player.宗门.职位 == '长老'
  ) {
  } else {
    Send(Text('只有宗主、副宗主或长老可以操作'))
    return false
  }
  let jiar = e.MessageText.replace(/^(#|＃|\/)?设置门槛/, '')
  jiar = jiar.trim()
  if (!data.Level_list.some(item => item.level == jiar)) return false
  let jr_level_id = data.Level_list.find(item => item.level == jiar).level_id
  const ass = await data.getAssociation(player.宗门.宗门名称)
  if (ass.power == 0 && jr_level_id > 41) {
    jr_level_id = 41
    Send(Text('不知哪位大能立下誓言：凡界无仙！'))
  }
  if (ass.power == 1 && jr_level_id < 42) {
    jr_level_id = 42
    Send(Text('仅仙人可加入仙宗'))
  }
  ass.最低加入境界 = jr_level_id
  Send(Text('已成功设置宗门门槛，当前门槛:' + jiar))
  data.setAssociation(ass.宗门名称, ass)
})
