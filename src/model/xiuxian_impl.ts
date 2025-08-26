import type { Player, Equipment, Najie } from '../types/player.js';
import { createPlayerRepository } from './repository/playerRepository.js';
import { createNajieRepository } from './repository/najieRepository.js';
import { keys } from './keys.js';
import { getDataList } from './DataList.js';
import { existDataByKey, getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';

const experienceList = (await getDataList('experience')) as Array<{
  id: number;
  name: string;
  experience: number;
  rate: number;
}>;

const playerRepo = createPlayerRepository(() => experienceList);
const najieRepo = createNajieRepository();

// 辅助函数：安全获取玩家数据
export async function getPlayerDataSafe(usrid: string): Promise<Player | null> {
  return await getDataJSONParseByKey(keys.player(usrid));
}

// 辅助函数：安全获取装备数据
export async function getEquipmentDataSafe(usrid: string): Promise<Equipment | null> {
  const equipmentData = await getDataJSONParseByKey(keys.equipment(usrid));

  return equipmentData;
}

/**
 * 检查玩家存档是否存在
 * @param usr_qq 玩家QQ
 * @returns
 */
export function existplayer(usrid: string): Promise<boolean> {
  return existDataByKey(keys.player(usrid));
}

// 读取存档信息，返回成一个 JavaScript 对象
export async function readPlayer(usrid: string): Promise<Player | null> {
  return await getDataJSONParseByKey(keys.player(usrid));
}

// 读取纳戒信息
export async function readNajie(usrid: string): Promise<Najie | null> {
  return await getDataJSONParseByKey(keys.najie(usrid));
}

/**
 * 写入纳戒信息
 * @param usr_qq 玩家QQ
 * @param najie 纳戒信息
 */
export async function writeNajie(usrid: string, najie: Najie): Promise<void> {
  await setDataJSONStringifyByKey(keys.najie(usrid), najie);
}

export async function addExp4(usrid: string, exp = 0) {
  if (exp === 0 || isNaN(exp)) {
    return;
  }
  await playerRepo.addOccupationExp(usrid, exp);
}

export async function addConFaByUser(usrid: string, gongfaName: string) {
  const player = await readPlayer(usrid);

  if (!player) {
    return;
  }
  if (!Array.isArray(player.学习的功法)) {
    player.学习的功法 = [];
  }
  player.学习的功法.push(gongfaName);
  await setDataJSONStringifyByKey(keys.player(usrid), player);
  import('./efficiency.js').then(m => m.playerEfficiency(usrid)).catch(() => {});
}

export async function addBagCoin(usrid: string, lingshi: number) {
  const delta = Math.trunc(Number(lingshi));

  if (delta === 0) {
    return;
  }
  await najieRepo.addLingShi(usrid, delta);
}

export { writePlayer } from './pub.js';
