import data from './XiuxianData.js'
import { __PATH } from './paths.js'
import { writePlayer } from './pub.js'
import type { Player, Equipment } from '../types/player.js'
import { getIoRedis } from '@alemonjs/db'
import { readPlayer } from './xiuxian_impl.js'
import { addHP } from './economy.js'
import { safeParse } from './utils/safe.js'

const redis = getIoRedis()

export async function readEquipment(usr_qq: string): Promise<Equipment | null> {
  const equipment = await redis.get(`${__PATH.equipment_path}:${usr_qq}`)
  if (!equipment) return null
  return safeParse<Equipment | null>(equipment, null)
}

export async function writeEquipment(
  usr_qq: string,
  equipment: Equipment
): Promise<void> {
  const player: Player | null = await readPlayer(usr_qq)
  if (!player) return
  const levelInfo = data.Level_list.find(
    item => item.level_id == player.level_id
  )
  const physiqueInfo = data.LevelMax_list.find(
    item => item.level_id == player.Physique_id
  )
  player.攻击 =
    (levelInfo?.基础攻击 || 0) + player.攻击加成 + (physiqueInfo?.基础攻击 || 0)
  player.防御 =
    (levelInfo?.基础防御 || 0) + player.防御加成 + (physiqueInfo?.基础防御 || 0)
  player.血量上限 =
    (levelInfo?.基础血量 || 0) + player.生命加成 + (physiqueInfo?.基础血量 || 0)
  player.暴击率 = (levelInfo?.基础暴击 || 0) + (physiqueInfo?.基础暴击 || 0)

  const types = ['武器', '护具', '法宝'] as const
  for (const t of types) {
    const equipItem = equipment[t]
    if (!equipItem) continue
    if (equipItem.atk > 10 || equipItem.def > 10 || equipItem.HP > 10) {
      player.攻击 += equipItem.atk
      player.防御 += equipItem.def
      player.血量上限 += equipItem.HP
    } else {
      player.攻击 = Math.trunc(player.攻击 * (1 + equipItem.atk))
      player.防御 = Math.trunc(player.防御 * (1 + equipItem.def))
      player.血量上限 = Math.trunc(player.血量上限 * (1 + equipItem.HP))
    }
    player.暴击率 += equipItem.bao
  }
  player.暴击伤害 = player.暴击率 + 1.5
  if (player.暴击伤害 > 2.5) player.暴击伤害 = 2.5
  if (player.仙宠.type == '暴伤') player.暴击伤害 += player.仙宠.加成
  await writePlayer(usr_qq, player)
  await addHP(usr_qq, 0)
  await redis.set(
    `${__PATH.equipment_path}:${usr_qq}`,
    JSON.stringify(equipment)
  )
}

export default { readEquipment, writeEquipment }
