import { InitWorldBoss } from '@src/response/Boss/boss.ts'
import { scheduleJob } from 'node-schedule'

scheduleJob('0 0 20 * * ?', async () => {
  await InitWorldBoss()
})
