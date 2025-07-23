import fs from 'fs'
import path from 'path'
import { __PATH } from './paths.js'
import type { Player } from '../types/player.js'

export async function Writeit(custom: any): Promise<void> {
  const dir = path.join(__PATH.custom, `custom.json`)
  const new_ARR = JSON.stringify(custom, null, '\t')
  fs.writeFileSync(dir, new_ARR, 'utf8')
  return
}

//写入存档信息,第二个参数是一个JavaScript对象
export async function Write_player(
  usr_qq: string,
  player: Player
): Promise<void> {
  let dir = path.join(__PATH.player_path, `${usr_qq}.json`)
  let new_ARR = JSON.stringify(player)
  fs.writeFileSync(dir, new_ARR, 'utf8')
  return
}
