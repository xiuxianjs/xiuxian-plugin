import { __PATH } from './paths.js'
import type { Player } from '../types/player.js'
import { redis } from '@src/api/api.js'

export async function writeIt(custom: any): Promise<void> {
  const new_ARR = JSON.stringify(custom, null, '\t')
  redis.set(`${__PATH.custom}:custom`, new_ARR)
  return
}

//写入存档信息,第二个参数是一个JavaScript对象
export async function writePlayer(
  usr_qq: string,
  player: Player
): Promise<void> {
  redis.set(`${__PATH.player_path}:${usr_qq}`, JSON.stringify(player))
  return
}
