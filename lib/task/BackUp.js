import { scheduleJob } from 'node-schedule';

scheduleJob('0 0 4 * * ?', async () => { });
