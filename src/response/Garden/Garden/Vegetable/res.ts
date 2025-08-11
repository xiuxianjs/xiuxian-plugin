import { Text, useSend } from 'alemonjs'

import { data, redis } from '@src/model/api'
import type { AssociationData } from '@src/types'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?药园*$/

interface GardenCrop {
  name: string
  start_time?: number
  ts?: number
  desc?: string
  who_plant?: string
}
interface GardenData {
  药园等级?: number
  作物?: GardenCrop[]
}
interface GuildData {
  药园?: GardenData
  宗门等级?: number
  宗门名称: string
}
interface PlayerGuild {
  宗门?: { 宗门名称: string }
}
interface AssociationLike extends AssociationData {
  药园?: GardenData
  宗门等级?: number
  宗门名称: string
}

function isAssociationLike(v: unknown): v is AssociationLike {
  return !!v && typeof v === 'object' && '宗门名称' in v
}

function cap(n: number, max: number) {
  return n > max ? max : n
}
function toInt(v: unknown, d = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : d
}
function fmtRemain(ms: number) {
  if (ms <= 0) return '0天0小时0分钟'
  const d = Math.trunc(ms / 86400000)
  const h = Math.trunc((ms % 86400000) / 3600000)
  const m = Math.trunc((ms % 3600000) / 60000)
  return `${d}天${h}小时${m}分钟`
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await data.existData('player', usr_qq))) return false
  const player = (await data.getData('player', usr_qq)) as PlayerGuild | null
  const guildName = player?.宗门?.宗门名称
  if (!guildName) return false

  let ass = (await data.getAssociation(guildName)) as unknown as GuildData
  const garden = ass.药园
  const guildLevel = toInt(ass.宗门等级, 1)

  if (
    !garden ||
    toInt(garden.药园等级, 1) === 1 ||
    toInt(garden.药园等级) !== guildLevel
  ) {
    await createGarden(guildName, usr_qq, guildLevel)
    Send(Text('新建药园，种下了一棵草'))
    ass = (await data.getAssociation(guildName)) as unknown as GuildData
  }

  const finalGarden = ass.药园 || { 药园等级: 1, 作物: [] }
  const capacity = cap(guildLevel, 6)
  const msg: string[] = [
    `宗门名称: ${ass.宗门名称}`,
    `药园可栽种: ${capacity} 棵药草`,
    `药园药草如下:`
  ]
  const now = Date.now()
  for (const crop of finalGarden.作物 || []) {
    if (!crop || !crop.name) continue
    if (['天灵花', '皇草', '创世花'].includes(crop.name)) continue
    const matureKey = `xiuxian:${guildName}${crop.name}`
    const matureAtRaw = await redis.get(matureKey)
    const matureAt = toInt(matureAtRaw, now)
    const remain = matureAt - now
    const remainStr = fmtRemain(remain)
    msg.push(
      `作物: ${crop.name}\n描述: ${crop.desc || ''}\n成长时间:${remainStr}`
    )
  }
  Send(Text(msg.join('\n')))
  return false
})

async function createGarden(
  association_name: string,
  user_qq: string,
  level: number
) {
  const now = Date.now()
  const cropTemplates: GardenCrop[] = [
    { name: '凝血草', ts: 1, desc: '汲取了地脉灵气形成的草' },
    {
      name: '掣电树',
      ts: 2,
      desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸'
    },
    { name: '小吉祥草', ts: 3, desc: '小吉祥草的护佑，拥有抵御雷劫的力量' },
    { name: '大吉祥草', ts: 7, desc: '大吉祥草的护佑' },
    { name: '仙草', ts: 7, desc: '仙草' },
    { name: '龙火', ts: 7, desc: '龙火，不详' }
  ]
  const levelMap: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 6,
    8: 6,
    9: 6
  }
  const count = levelMap[level] || 1
  const crops = cropTemplates
    .slice(0, count)
    .map(c => ({ ...c, start_time: now, who_plant: user_qq }))
  const garden: GardenData = { 药园等级: level, 作物: crops }
  const res = await data.getAssociation(association_name)
  if (res === 'error' || !isAssociationLike(res)) return
  const ass: AssociationLike = res as AssociationLike
  ass.药园 = garden
  await data.setAssociation(association_name, ass)
  // 初始化成熟时间戳
  for (const c of crops) {
    const matureAt = now + 24 * 60 * 60 * 1000 * toInt(c.ts, 1)
    await redis.set(`xiuxian:${association_name}${c.name}`, matureAt)
  }
}
