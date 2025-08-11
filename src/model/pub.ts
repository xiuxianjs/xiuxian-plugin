import { __PATH } from './paths.js'
import type { Player } from '../types/player.js'
import { getIoRedis } from '@alemonjs/db'
import type { CustomRecord } from '../types/model'

export async function writeIt(custom: CustomRecord): Promise<void> {
  const new_ARR = JSON.stringify(custom, null, '\t')
  const redis = getIoRedis()
  redis.set(`${__PATH.custom}:custom`, new_ARR)
}

//写入存档信息,第二个参数是一个JavaScript对象
export async function writePlayer(
  usr_qq: string,
  player: Player
): Promise<void> {
  const redis = getIoRedis()
  redis.set(`${__PATH.player_path}:${usr_qq}`, JSON.stringify(player))
  return
}
