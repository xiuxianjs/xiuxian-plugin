import { InitWorldBoss } from '../response/Boss/boss.js';
import { scheduleJob } from 'node-schedule';

scheduleJob('0 0 21 * * ?', async () => {
    await InitWorldBoss();
});
