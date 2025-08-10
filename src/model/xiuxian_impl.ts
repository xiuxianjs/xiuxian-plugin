import data from './XiuxianData.js'
import { __PATH } from './paths.js'
import type { Player, Equipment, Najie } from '../types/player.js'
import { getIoRedis } from '@alemonjs/db'
import { createPlayerRepository } from './repository/playerRepository.js'
import { createNajieRepository } from './repository/najieRepository.js'

const redis = getIoRedis()
const playerRepo = createPlayerRepository(() => data.occupation_exp_list)
const najieRepo = createNajieRepository()

// 辅助函数：安全获取玩家数据
export async function getPlayerDataSafe(usr_qq: string): Promise<Player> {
  const playerData = await data.getData('player', usr_qq)
  if (!playerData || Array.isArray(playerData)) {
    return null
  }
  return playerData as Player
}

// 辅助函数：安全设置玩家数据
export function setPlayerDataSafe(usr_qq: string, player: Player): void {
  data.setData('player', usr_qq, player)
}

// 辅助函数：安全获取装备数据
export async function getEquipmentDataSafe(usr_qq: string): Promise<Equipment> {
  const equipmentData = await data.getData('equipment', usr_qq)
  if (equipmentData === 'error' || Array.isArray(equipmentData)) {
    return null
  }
  return equipmentData as Equipment
}

// 检查存档是否存在，存在返回 true
export async function existplayer(usr_qq: string): Promise<boolean> {
  const res = await redis.exists(`${__PATH.player_path}:${usr_qq}`)
  return res === 1
}

// 读取存档信息，返回成一个 JavaScript 对象
export async function readPlayer(usr_qq: string): Promise<Player | null> {
  const player = await redis.get(`${__PATH.player_path}:${usr_qq}`)
  if (!player) return null
  const playerData = JSON.parse(decodeURIComponent(player))
  return playerData as Player
}

// 读取纳戒信息
export async function readNajie(usr_qq: string): Promise<Najie> {
  const raw = await redis.get(`${__PATH.najie_path}:${usr_qq}`)
  if (!raw) return null
  return JSON.parse(raw) as Najie
}

// 写入纳戒信息
export async function Write_najie(usr_qq: string, najie: Najie): Promise<void> {
  await redis.set(`${__PATH.najie_path}:${usr_qq}`, JSON.stringify(najie))
}

export async function addExp4(usr_qq, exp = 0) {
  if (exp === 0) return
  await playerRepo.addOccupationExp(usr_qq, exp)
}

export async function addConFaByUser(usr_qq, gongfa_name) {
  const player = await readPlayer(usr_qq)
  player.学习的功法.push(gongfa_name)
  data.setData('player', usr_qq, player)
  // 动态加载效率计算，避免与 efficiency.ts 形成静态循环依赖
  import('./efficiency.js')
    .then(m => m.playerEfficiency(usr_qq))
    .catch(() => {})
}

export async function addBagCoin(usr_qq, lingshi) {
  const delta = Math.trunc(lingshi)
  if (delta === 0) return
  await najieRepo.addLingShi(usr_qq, delta)
}

// Re-export to keep backward compatibility for modules that previously imported from xiuxian.ts
export { writePlayer } from './pub.js'
