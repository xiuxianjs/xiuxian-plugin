import { Read_najie, __PATH } from 'model'
import { scheduleJob } from 'node-schedule'
import fs from 'fs'

scheduleJob('20 0/5 * * * ?', async () => {
  let playerList = []
  let files = fs
    .readdirSync('./resources/data/xiuxian_player')
    .filter(file => file.endsWith('.json'))
  for (let file of files) {
    file = file.replace('.json', '')
    playerList.push(file)
  }
  for (let player_id of playerList) {
    let usr_qq = player_id
    try {
      await Read_najie(usr_qq)
      fs.copyFileSync(
        `${__PATH.najie_path}/${usr_qq}.json`,
        `${__PATH.auto_backup}/najie/${usr_qq}.json`
      )
    } catch {
      continue
    }
  }
})
