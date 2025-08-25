import { __PATH } from './keys.js'
import type { Player } from '../types/player.js'
import type { CustomRecord } from '../types/model'
import { keys } from './keys.js'
import { setDataJSONStringifyByKey } from './DataControl.js'

export async function writeIt(custom: CustomRecord): Promise<void> {
  await setDataJSONStringifyByKey(keys.custom('custom'), custom)
}

export async function writePlayer(
  usr_qq: string,
  player: Player
): Promise<void> {
  await setDataJSONStringifyByKey(keys.player(usr_qq), player)
  return
}
