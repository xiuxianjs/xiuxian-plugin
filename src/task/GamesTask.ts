import { scheduleJob } from 'node-schedule'
import fs from 'fs'
import { redis } from '@src/api/api'
import { __PATH } from '@src/model'

scheduleJob('0 */5 * * * ?', async () => {
  //获取缓存中人物列表
  let playerList = []
  let files = fs
    .readdirSync(__PATH.player_path)
    .filter(file => file.endsWith('.json'))
  for (let file of files) {
    file = file.replace('.json', '')
    playerList.push(file)
  }
  for (let player_id of playerList) {
    //获取游戏状态
    let game_action = await redis.get(
      'xiuxian@1.3.0:' + player_id + ':game_action'
    )
    //防止继续其他娱乐行为
    if (+game_action == 0) {
      await redis.set('xiuxian@1.3.0:' + player_id + ':game_action', 1)
      return false
    }
  }
})
