import { __PATH } from '@src/model'
import { scheduleJob } from 'node-schedule'
scheduleJob('20 0/5 * * * ?', async () => {})
