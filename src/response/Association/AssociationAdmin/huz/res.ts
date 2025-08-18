import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import { notUndAndNull } from '@src/model/index'
import type { AssociationDetailData, Player } from '@src/types'

import { selects } from '@src/response/mw'
export const regular = /^(#|＃|\/)?查看护宗大阵$/

interface PlayerGuildRef {
  宗门名称: string
  职位: string
}
function isPlayerGuildRef(v): v is PlayerGuildRef {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v
}
function isAssDetail(v): v is AssociationDetailData {
  return !!v && typeof v === 'object' && '宗门名称' in v
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await data.existData('player', usr_qq))) return false
  const player = (await data.getData('player', usr_qq)) as Player | null
  if (
    !player ||
    !notUndAndNull(player.宗门) ||
    !isPlayerGuildRef(player.宗门)
  ) {
    Send(Text('你尚未加入宗门'))
    return false
  }
  const assRaw = await data.getAssociation(player.宗门.宗门名称)
  if (assRaw === 'error' || !isAssDetail(assRaw)) {
    Send(Text('宗门数据不存在'))
    return false
  }
  const hp = typeof assRaw.大阵血量 === 'number' ? assRaw.大阵血量 : 0
  Send(Text(`护宗大阵血量:${hp}`))
  return false
})
