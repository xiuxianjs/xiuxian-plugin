import { __PATH } from './keys.js'
import type { Player, Equipment, Najie } from '../types/player.js'
import { getIoRedis } from '@alemonjs/db'
import { createPlayerRepository } from './repository/playerRepository.js'
import { createNajieRepository } from './repository/najieRepository.js'
import { keys } from './keys.js'
import { getDataList } from './DataList.js'
import {
  existDataByKey,
  getDataJSONParseByKey,
  setDataJSONStringifyByKey
} from './DataControl.js'

const experienceList = (await getDataList('experience')) as Array<{
  id: number
  name: string
  experience: number
  rate: number
}>

const playerRepo = createPlayerRepository(() => experienceList)
const najieRepo = createNajieRepository()

// 辅助函数：安全获取玩家数据
export async function getPlayerDataSafe(
  usr_qq: string
): Promise<Player | null> {
  return await getDataJSONParseByKey(keys.player(usr_qq))
}

// 辅助函数：安全获取装备数据
export async function getEquipmentDataSafe(
  usr_qq: string
): Promise<Equipment | null> {
  const equipmentData = await getDataJSONParseByKey(keys.equipment(usr_qq))
  return equipmentData
}

/**
 * 检查玩家存档是否存在
 * @param usr_qq 玩家QQ
 * @returns
 */
export async function existplayer(usr_qq: string): Promise<boolean> {
  return existDataByKey(keys.player(usr_qq))
}

// 读取存档信息，返回成一个 JavaScript 对象
export async function readPlayer(usr_qq: string): Promise<Player | null> {
  return await getDataJSONParseByKey(keys.player(usr_qq))
}

// 读取纳戒信息
export async function readNajie(usr_qq: string): Promise<Najie | null> {
  return await getDataJSONParseByKey(keys.najie(usr_qq))
}

/**
 * 写入纳戒信息
 * @param usr_qq 玩家QQ
 * @param najie 纳戒信息
 */
export async function writeNajie(usr_qq: string, najie: Najie): Promise<void> {
  await setDataJSONStringifyByKey(keys.najie(usr_qq), najie)
}

export async function addExp4(usr_qq: string, exp = 0) {
  if (exp === 0 || isNaN(exp)) return
  await playerRepo.addOccupationExp(usr_qq, exp)
}

export async function addConFaByUser(usr_qq: string, gongfa_name: string) {
  const player = await readPlayer(usr_qq)
  if (!player) return
  if (!Array.isArray(player.学习的功法)) player.学习的功法 = []
  player.学习的功法.push(gongfa_name)
  await setDataJSONStringifyByKey(keys.player(usr_qq), player)
  import('./efficiency.js')
    .then(m => m.playerEfficiency(usr_qq))
    .catch(() => {})
}

export async function addBagCoin(usr_qq: string, lingshi: number) {
  const delta = Math.trunc(Number(lingshi))
  if (delta === 0) return
  await najieRepo.addLingShi(usr_qq, delta)
}

export { writePlayer } from './pub.js'
