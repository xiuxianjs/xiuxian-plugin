import { useSend, Text } from 'alemonjs';
import fs from 'fs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import 'path';
import { __PATH } from '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import 'jsxp';
import 'react';
import '../../../../resources/html/adminset/adminset.css.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/html/association/association.css.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/html/danfang/danfang.css.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/html/gongfa/gongfa.css.js';
import '../../../../resources/html/equipment/equipment.css.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/html/supermarket/supermarket.css.js';
import '../../../../resources/html/Ranking/tailwindcss.css.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help/help.js';
import '../../../../resources/html/log/log.css.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../../resources/html/najie/najie.css.js';
import '../../../../resources/html/player/player.css.js';
import '../../../../resources/html/playercopy/player.css.js';
import '../../../../resources/html/secret_place/secret_place.css.js';
import '../../../../resources/html/shenbing/shenbing.css.js';
import '../../../../resources/html/shifu/shifu.css.js';
import '../../../../resources/html/shitu/shitu.css.js';
import '../../../../resources/html/shituhelp/common.css.js';
import '../../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/html/shop/shop.css.js';
import '../../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../../resources/html/sudoku/sudoku.css.js';
import '../../../../resources/html/talent/talent.css.js';
import '../../../../resources/html/temp/temp.css.js';
import '../../../../resources/html/time_place/time_place.css.js';
import '../../../../resources/html/tujian/tujian.css.js';
import '../../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../../resources/html/valuables/valuables.css.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import '../../../../resources/html/updateRecord/updateRecord.css.js';
import 'lodash-es';
import { getTimeStr } from '../../../../model/time.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?备份存档$/;
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

export { res as default, regular };
