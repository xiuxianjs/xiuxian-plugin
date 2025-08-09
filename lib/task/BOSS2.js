import { InitWorldBoss2 } from '../response/Boss/boss.js';
import { scheduleJob } from 'node-schedule';

scheduleJob('0 0 20 * * ?', async () => {
    await InitWorldBoss2();
});
