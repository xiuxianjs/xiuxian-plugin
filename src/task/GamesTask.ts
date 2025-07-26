import { scheduleJob } from 'node-schedule'
import { redis } from '@src/api/api'
import { __PATH } from '@src/model'
import { setDataByUserId } from '@src/model/Redis'

scheduleJob('0 */5 * * * ?', async () => {
  //获取缓存中人物列表

  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  for (let player_id of playerList) {
    //获取游戏状态
    let game_action = await redis.get(
      'xiuxian@1.3.0:' + player_id + ':game_action'
    )
    //防止继续其他娱乐行为
    if (+game_action == 0) {
      await setDataByUserId(player_id, 'game_action', 1)
      return false
    }
  }
})
