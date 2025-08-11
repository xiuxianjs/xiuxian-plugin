import { Image, useSend } from 'alemonjs'
import { data, redis } from '@src/model/api'
import {
  existplayer,
  __PATH,
  getRandomTalent,
  writePlayer,
  writeEquipment,
  Write_najie,
  addHP,
  writeDanyao
} from '@src/model/index'

import { selects } from '@src/response/index'
import { getPlayerImage } from '@src/model/image'
import type { Player } from '@src/types'
export const regular = /^(#|＃|\/)?踏入仙途$/

interface Talent {
  eff: number
  [k: string]: unknown
}
function normalizeTalent(t: unknown): Talent {
  if (t && typeof t === 'object') {
    const obj = t as Record<string, unknown>
    const eff = typeof obj.eff === 'number' ? obj.eff : 0
    return { ...obj, eff }
  }
  return { eff: 0 }
}

function pickEquip(name: string) {
  return data.equipment_list.find(i => i.name === name) || null
}

function isPublicMessage(evt: unknown): evt is { Guild: unknown } {
  return !!evt && typeof evt === 'object' && 'Guild' in evt
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (await existplayer(usr_qq)) {
    if (isPublicMessage(e)) {
      const img = await getPlayerImage(
        e as Parameters<typeof getPlayerImage>[0]
      )
      if (img) {
        if (Buffer.isBuffer(img)) Send(Image(img))
        else if (typeof img === 'string') {
          try {
            Send(Image(Buffer.from(img)))
          } catch {
            /* ignore */
          }
        }
      }
    }
    return false
  }
  // 玩家计数：使用 redis key 数量作为序号（若需精确可改为读取文件系统）
  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const n = keys.length + 1
  const talentRaw = await getRandomTalent()
  const talent = normalizeTalent(talentRaw)
  const new_player: Player = {
    id: usr_qq,
    sex: '0',
    名号: `路人甲${n}号`,
    宣言: '这个人很懒还没有写',
    avatar: e.UserAvatar || 'https://s1.ax1x.com/2022/08/09/v8XV3q.jpg',
    level_id: 1,
    Physique_id: 1,
    race: 1,
    修为: 1,
    血气: 1,
    灵石: 10000,
    灵根: talent as unknown as Player['灵根'],
    神石: 0,
    favorability: 0,
    breakthrough: false,
    linggen: [],
    linggenshow: 1,
    学习的功法: [],
    修炼效率提升: talent.eff,
    连续签到天数: 0,
    攻击加成: 0,
    防御加成: 0,
    生命加成: 0,
    power_place: 1,
    当前血量: 8000,
    lunhui: 0,
    lunhuiBH: 0,
    轮回点: 10,
    occupation: [],
    occupation_level: 1,
    镇妖塔层数: 0,
    神魄段数: 0,
    魔道值: 0,
    仙宠: [],
    练气皮肤: 0,
    装备皮肤: 0,
    幸运: 0,
    addluckyNo: 0,
    师徒任务阶段: 0,
    师徒积分: 0
  } as unknown as Player
  await writePlayer(usr_qq, new_player)
  const new_equipment = {
    武器: pickEquip('烂铁匕首'),
    护具: pickEquip('破铜护具'),
    法宝: pickEquip('廉价炮仗')
  }
  await writeEquipment(usr_qq, new_equipment)
  const new_najie: Parameters<typeof Write_najie>[1] = {
    等级: 1,
    灵石上限: 5000,
    灵石: 0,
    装备: [],
    丹药: [],
    道具: [],
    功法: [],
    草药: [],
    材料: [],
    仙宠: [],
    武器: null,
    护具: null,
    法宝: null
  }
  await Write_najie(usr_qq, new_najie)
  await addHP(usr_qq, 999999)
  const danyaoInit: Record<string, number> = {
    biguan: 0,
    biguanxl: 0,
    xingyun: 0,
    lianti: 0,
    ped: 0,
    modao: 0,
    beiyong1: 0,
    beiyong2: 0,
    beiyong3: 0,
    beiyong4: 0,
    beiyong5: 0
  }
  await writeDanyao(
    usr_qq,
    danyaoInit as unknown as Parameters<typeof writeDanyao>[1]
  )
  const img = isPublicMessage(e)
    ? await getPlayerImage(e as Parameters<typeof getPlayerImage>[0])
    : null
  if (img) {
    if (Buffer.isBuffer(img)) Send(Image(img))
    else if (typeof img === 'string') {
      try {
        Send(Image(Buffer.from(img)))
      } catch {
        /* ignore */
      }
    }
  }
  return false
})
