import { Text, useMessage, Image } from 'alemonjs'
import { data, redis } from '@src/model/api'
import { selects } from '@src/response/index'
import { __PATH } from '@src/model/index'
import { screenshot } from '@src/image'
import type { AssociationDetailData } from '@src/types'

export const regular = /^(#|＃|\/)?洞天福地列表$/

interface ExtAss extends AssociationDetailData {
  宗门驻地?: string | number
  宗门名称: string
}
function isExtAss(v: unknown): v is ExtAss {
  return !!v && typeof v === 'object' && 'power' in v && '宗门名称' in v
}
interface BlessPlace {
  name: string
  level: number
  efficiency: number
}
function isBlessPlace(v: unknown): v is BlessPlace {
  return (
    !!v &&
    typeof v === 'object' &&
    'name' in v &&
    'level' in v &&
    'efficiency' in v
  )
}

export default onResponse(selects, async e => {
  const [message] = useMessage(e)
  const blessRaw = data.bless_list as unknown[] | undefined
  const blessList: BlessPlace[] = Array.isArray(blessRaw)
    ? blessRaw.filter(isBlessPlace)
    : []
  if (!blessList.length) {
    message.send([Text('暂无洞天福地配置')])
    return false
  }

  const keys = await redis.keys(`${__PATH.association}:*`)
  const guildNames = keys.map(k => k.replace(`${__PATH.association}:`, ''))
  const assListRaw = await Promise.all(
    guildNames.map(n => data.getAssociation(n))
  )
  const locationMap = new Map<string | number, string>()
  for (let idx = 0; idx < assListRaw.length; idx++) {
    const a = assListRaw[idx]
    if (a === 'error' || !isExtAss(a)) continue
    if (a.宗门驻地 != null && !locationMap.has(a.宗门驻地)) {
      locationMap.set(a.宗门驻地, a.宗门名称)
    }
  }

  const rows = blessList.map(b => ({
    name: b.name,
    level: b.level,
    efficiency: b.efficiency * 100,
    ass: locationMap.get(b.name) || '无'
  }))

  try {
    const image = await screenshot('BlessPlace', e.UserId, {
      didian_list: rows
    })
    if (!image) {
      message.send([Text('图片生成失败')])
      return false
    }
    message.send([Image(image)])
  } catch (_err) {
    message.send([Text('生成洞天福地列表时出错')])
  }
  return false
})
