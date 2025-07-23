import { redis } from '../api/api.js';
import 'yaml';
import fs from 'fs';
import '../config/Association.yaml.js';
import '../config/help.yaml.js';
import '../config/help2.yaml.js';
import '../config/set.yaml.js';
import '../config/shituhelp.yaml.js';
import '../config/namelist.yaml.js';
import '../config/task.yaml.js';
import '../config/version.yaml.js';
import '../config/xiuxian.yaml.js';
import 'path';
import { __PATH } from '../model/paths.js';
import '../model/XiuxianData.js';
import 'alemonjs';
import 'jsxp';
import 'react';
import '../resources/html/adminset/adminset.css.js';
import '../resources/font/tttgbnumber.ttf.js';
import '../resources/img/state/state.jpg.js';
import '../resources/img/state/user_state.png.js';
import '../resources/html/association/association.css.js';
import '../resources/img/player/player.jpg.js';
import '../resources/html/danfang/danfang.css.js';
import '../resources/img/danfang/danfang.jpg.js';
import '../resources/html/gongfa/gongfa.css.js';
import '../resources/html/equipment/equipment.css.js';
import '../resources/img/equipment_pifu/0.jpg.js';
import '../resources/html/fairyrealm/fairyrealm.css.js';
import '../resources/img/fairyrealm/fairyrealm.jpg.js';
import '../resources/img/fairyrealm/card.jpg.js';
import '../resources/html/forbidden_area/forbidden_area.css.js';
import '../resources/img/forbidden_area/forbidden_area.jpg.js';
import '../resources/img/forbidden_area/card.jpg.js';
import '../resources/html/supermarket/supermarket.css.js';
import '../resources/img/supermarket/supermarket.jpg.js';
import '../resources/html/state/state.css.js';
import '../resources/html/help/help.js';
import '../resources/html/log/log.css.js';
import '../resources/img/najie/najie.jpg.js';
import '../resources/html/ningmenghome/ningmenghome.css.js';
import '../resources/img/ningmenghome/ningmenghome.jpg.js';
import '../resources/html/najie/najie.css.js';
import '../resources/img/player_pifu/0.jpg.js';
import '../resources/html/player/player.css.js';
import '../resources/img/player/user_state.png.js';
import '../resources/html/playercopy/player.css.js';
import '../resources/html/secret_place/secret_place.css.js';
import '../resources/img/secret_place/secret_place.jpg.js';
import '../resources/img/secret_place/card.jpg.js';
import '../resources/html/shenbing/shenbing.css.js';
import '../resources/html/shifu/shifu.css.js';
import '../resources/html/shitu/shitu.css.js';
import '../resources/html/shituhelp/common.css.js';
import '../resources/html/shituhelp/shituhelp.css.js';
import '../resources/img/help/shituhelp.jpg.js';
import '../resources/img/help/icon.png.js';
import '../resources/html/shop/shop.css.js';
import '../resources/html/statezhiye/statezhiye.css.js';
import '../resources/html/sudoku/sudoku.css.js';
import '../resources/html/talent/talent.css.js';
import '../resources/img/talent/talent.jpg.js';
import '../resources/html/temp/temp.css.js';
import '../resources/html/time_place/time_place.css.js';
import '../resources/img/time_place/time_place.jpg.js';
import '../resources/html/tujian/tujian.css.js';
import '../resources/html/tuzhi/tuzhi.css.js';
import '../resources/img/tuzhi/tuzhi.jpg.js';
import '../resources/html/valuables/valuables.css.js';
import '../resources/img/valuables/valuables-top.jpg.js';
import '../resources/img/valuables/valuables-danyao.jpg.js';
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
