import type { Player, Najie } from '../types/player.js';
import { keys } from './keys.js';
import { existDataByKey, getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';
import { CustomRecord } from '@src/types/model.js';

/**
 * 检查玩家存档是否存在
 * @param userId 玩家QQ
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

// 写入纳戒信息
export async function writeNajie(usrid: string, najie: Najie): Promise<void> {
  await setDataJSONStringifyByKey(keys.najie(usrid), najie);
}

export async function writeIt(custom: CustomRecord): Promise<void> {
  await setDataJSONStringifyByKey(keys.custom('custom'), custom);
}

export async function writePlayer(usrQQ: string, player: Player): Promise<void> {
  await setDataJSONStringifyByKey(keys.player(usrQQ), player);
}
