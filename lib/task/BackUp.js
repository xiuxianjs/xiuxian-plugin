import { redis } from '../api/api.js';
import '../model/Config.js';
import fs from 'fs';
import 'path';
import { __PATH } from '../model/paths.js';
import '../model/XiuxianData.js';
import 'alemonjs';
import 'lodash-es';
import '@alemonjs/db';
import { getTimeStr } from '../model/time.js';
import { scheduleJob } from 'node-schedule';

scheduleJob('0 0 4 * * ?', async () => {
    try {
        logger.info('开始备份存档');
        const needSave = [
            'association',
            'Exchange',
            'qinmidu',
            'duanlu',
            'shitu',
            'tiandibang',
            'equipment_path',
            'najie_path',
            'player_path',
            'custom',
            'shop',
            'danyao_path'
        ];
        const readFnameTask = needSave.map(folderName => {
            return fs.promises.readdir(__PATH[folderName]);
        });
        const dataFname = await Promise.all(readFnameTask);
        const readDoneTask = needSave.map((folderName, index) => {
            dataFname[index] = dataFname[index].filter(fn => fn.endsWith('.json'));
            const readTask = dataFname[index].map(fn => fs.promises.readFile(`${__PATH[folderName]}/${fn}`));
            return Promise.all(readTask);
        });
        const dataProm = Promise.all(readDoneTask);
        const redisObj = {};
        const redisKeys = await redis.keys('xiuxian:*');
        const redisTypes = await Promise.all(redisKeys.map(key => redis.type(key)));
        const redisValues = await Promise.all(redisKeys.map((key, i) => {
            switch (redisTypes[i]) {
                case 'string':
                    return redis.get(key);
                case 'set':
                    return redis.smembers(key);
            }
        }));
        redisKeys.forEach((key, i) => (redisObj[key] = [redisTypes[i], redisValues[i]]));
        if (!fs.existsSync(__PATH.backup)) {
            fs.mkdirSync(__PATH.backup, { recursive: true });
        }
        const nowTimeStamp = Date.now();
        const saveFolder = `${__PATH.backup}/${nowTimeStamp}`;
        if (fs.existsSync(saveFolder)) {
            logger.error('致命错误...');
            return;
        }
        fs.mkdirSync(saveFolder);
        const saveData = await dataProm;
        const finishTask = needSave.map((folderName, index) => {
            fs.mkdirSync(`${saveFolder}/${folderName}`);
            const writeTask = saveData[index].map((sd, i) => fs.promises.writeFile(`${saveFolder}/${folderName}/${dataFname[index][i]}`, sd));
            return Promise.all(writeTask);
        });
        fs.writeFileSync(`${saveFolder}/redis.json`, JSON.stringify(redisObj));
        await Promise.all(finishTask);
        const timeStr = getTimeStr(nowTimeStamp);
        logger.info(`存档已备份：${timeStr}`);
        return false;
    }
    catch (err) {
        logger.error(`备份失败，${err}`);
        throw err;
    }
});
