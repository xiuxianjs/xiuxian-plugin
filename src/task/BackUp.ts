import { __PATH } from '@src/model'
import { scheduleJob } from 'node-schedule'

scheduleJob('0 0 4 * * ?', async () => {})
