import { useSend, Text } from 'alemonjs';
import fs from 'fs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import { join } from 'path';
import { __PATH } from '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import 'lodash-es';
import '@alemonjs/db';
import { getTimeStr } from '../../../../model/time.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?读取存档(.*)/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    try {
        if (!e.IsMaster) {
            Send(Text('只有主人可以执行操作'));
            return false;
        }
        const saveDataNum = Number(e.MessageText.replace(/^(#|＃|\/)?读取存档/, '').trim());
        if (!(1 <= saveDataNum && saveDataNum <= 80)) {
            Send(Text('正确格式：#读取存档[1~80]\n如：#读取存档18'));
            return false;
        }
        await Send(Text('开始读取存档...'));
        let backUpList = fs.readdirSync(__PATH.backup).filter(folderName => {
            const stat = fs.statSync(`${__PATH.backup}/${folderName}`);
            return folderName === `${Number(folderName)}` && stat.isDirectory();
        });
        if (backUpList.length > 80)
            backUpList = backUpList.slice(-80);
        const backUpPath = `${__PATH.backup}/${backUpList[saveDataNum - 1]}`;
        if (!fs.existsSync(backUpPath)) {
            Send(Text('该存档已损坏'));
            return false;
        }
        const needLoad = [
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
        const readFnameTask = needLoad.map(folderName => {
            return fs.promises.readdir(`${backUpPath}/${folderName}`);
        });
        const dataFname = await Promise.all(readFnameTask);
        const readDoneTask = needLoad.map((folderName, index) => {
            dataFname[index] = dataFname[index].filter(fn => fn.endsWith('.json'));
            const readTask = dataFname[index].map(fn => fs.promises.readFile(`${backUpPath}/${folderName}/${fn}`));
            return Promise.all(readTask);
        });
        let redisObj = {};
        let includeBackup = true;
        try {
            const dir = join(backUpPath, 'redis.json');
            if (!fs.existsSync(dir)) {
                includeBackup = false;
            }
            else {
                redisObj = JSON.parse(fs.readFileSync(dir, 'utf8'));
            }
        }
        catch (_) {
            includeBackup = false;
        }
        const loadData = await Promise.all(readDoneTask);
        const finishTask = needLoad.map(async (folderName, index) => {
            const originFname = fs.readdirSync(`${__PATH[folderName]}`);
            const clearTask = originFname.map(fn => {
                if (!fn.endsWith('.json'))
                    return Promise.resolve();
                return fs.promises.rm(`${__PATH[folderName]}/${fn}`);
            });
            await Promise.all(clearTask);
            if (includeBackup) {
                const originRedisKeys = await redis.keys('xiuxian:*');
                const clearRedisTask = originRedisKeys.map(key => redis.del(key));
                await Promise.all(clearRedisTask);
            }
            const writeTask = loadData[index].map((ld, i) => fs.promises.writeFile(`${__PATH[folderName]}/${dataFname[index][i]}`, ld));
            if (includeBackup) {
                await Promise.all(Object.keys(redisObj).map(key => {
                    switch (redisObj[key][0]) {
                        case 'string':
                            redis.set(key, redisObj[key][1]);
                            return;
                        case 'set':
                            redis.sadd(key, redisObj[key][1]);
                            return;
                    }
                }));
            }
            return Promise.all(writeTask);
        });
        await Promise.all(finishTask);
        const timeStr = getTimeStr(backUpList[saveDataNum - 1]);
        Send(Text(`存档已读取：${timeStr}`));
        return false;
    }
    catch (err) {
        await Send(Text(`读取失败，${err}`));
        throw err;
    }
});

export { res as default, regular };
