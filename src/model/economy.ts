// 经济/资源增减逻辑（增加原子操作）
import { readPlayer } from './xiuxian_impl.js'
import type { Player } from '../types/player.js'
import { playerRepo } from './utils/safe.js'

export interface EconomyDelta {
  coin?: number
  hp?: number
  exp?: number
  exp2?: number
  exp3?: number
  exp4?: number
}

export async function addCoin(userId: string, delta: number) {
  delta = Math.trunc(delta)
  if (!delta) return
  const val = await playerRepo.atomicAdjust(userId, '灵石', delta)
  return val ?? (await readPlayer(userId))?.灵石
}

export async function addHP(userId: string, delta: number) {
  delta = Math.trunc(delta)
  if (!delta) return
  // 先原子调整，再读取并做上限/下限修正一次（写回）
  await playerRepo.atomicAdjust(userId, '当前血量', delta)
  const player = (await readPlayer(userId)) as Player
  if (!player) return
  if (player.当前血量 > player.血量上限) player.当前血量 = player.血量上限
  if (player.当前血量 < 0) player.当前血量 = 0
  await playerRepo.setObject(userId, player)
  return player.当前血量
}

export async function addExp(userId: string, delta: number) {
  delta = Math.trunc(delta)
  if (!delta) return
  const val = await playerRepo.atomicAdjust(userId, '修为', delta)
  return val ?? (await readPlayer(userId))?.修为
}

export async function addExp2(userId: string, delta: number) {
  delta = Math.trunc(delta)
  if (!delta) return
  const val = await playerRepo.atomicAdjust(userId, '血气', delta)
  return val ?? (await readPlayer(userId))?.血气
}

export async function addExp3(userId: string, delta: number) {
  delta = Math.trunc(delta)
  if (!delta) return
  const val = await playerRepo.atomicAdjust(userId, '魔道值', delta)
  return val ?? (await readPlayer(userId))?.魔道值
}

export default { addCoin, addHP, addExp, addExp2, addExp3 }
