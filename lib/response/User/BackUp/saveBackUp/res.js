import { useSend, Text } from 'alemonjs';
import fs from 'fs';
import { createEventName } from '../../../util.js';
import { redis } from '../../../../api/api.js';
import { getTimeStr } from '../../../../model/index.js';
import { __PATH } from '../../../../model/paths.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)备份存档$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    try {
        if (!e.IsMaster) {
            Send(Text('只有主人可以执行操作'));
            return false;
        }
        await e?.reply('开始备份...');
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
            e?.reply('致命错误...');
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
        Send(Text(`存档已备份：${timeStr}`));
        return false;
    }
    catch (err) {
        await e?.reply(`备份失败，${err}`);
        throw err;
    }
});

export { res as default, name, regular, selects };
