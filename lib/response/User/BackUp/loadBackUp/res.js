import { useSend, Text } from 'alemonjs';
import fs from 'fs';
import { redis } from '../../../../api/api.js';
import 'yaml';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import 'path';
import { __PATH } from '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import 'jsxp';
import 'react';
import '../../../../resources/html/adminset/adminset.css.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/state/state.jpg.js';
import '../../../../resources/img/state/user_state.png.js';
import '../../../../resources/html/association/association.css.js';
import '../../../../resources/img/player/player.jpg.js';
import '../../../../resources/html/danfang/danfang.css.js';
import '../../../../resources/img/danfang/danfang.jpg.js';
import '../../../../resources/html/gongfa/gongfa.css.js';
import '../../../../resources/html/equipment/equipment.css.js';
import '../../../../resources/img/equipment_pifu/0.jpg.js';
import '../../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../../resources/img/fairyrealm/fairyrealm.jpg.js';
import '../../../../resources/img/fairyrealm/card.jpg.js';
import '../../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../../resources/img/forbidden_area/forbidden_area.jpg.js';
import '../../../../resources/img/forbidden_area/card.jpg.js';
import '../../../../resources/html/supermarket/supermarket.css.js';
import '../../../../resources/img/supermarket/supermarket.jpg.js';
import '../../../../resources/html/state/state.css.js';
import '../../../../resources/html/help/help.js';
import '../../../../resources/html/log/log.css.js';
import '../../../../resources/img/najie/najie.jpg.js';
import '../../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../../resources/img/ningmenghome/ningmenghome.jpg.js';
import '../../../../resources/html/najie/najie.css.js';
import '../../../../resources/img/player_pifu/0.jpg.js';
import '../../../../resources/html/player/player.css.js';
import '../../../../resources/img/player/user_state.png.js';
import '../../../../resources/html/playercopy/player.css.js';
import '../../../../resources/html/secret_place/secret_place.css.js';
import '../../../../resources/img/secret_place/secret_place.jpg.js';
import '../../../../resources/img/secret_place/card.jpg.js';
import '../../../../resources/html/shenbing/shenbing.css.js';
import '../../../../resources/html/shifu/shifu.css.js';
import '../../../../resources/html/shitu/shitu.css.js';
import '../../../../resources/html/shituhelp/common.css.js';
import '../../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../../resources/img/help/shituhelp.jpg.js';
import '../../../../resources/img/help/icon.png.js';
import '../../../../resources/html/shop/shop.css.js';
import '../../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../../resources/html/sudoku/sudoku.css.js';
import '../../../../resources/html/talent/talent.css.js';
import '../../../../resources/img/talent/talent.jpg.js';
import '../../../../resources/html/temp/temp.css.js';
import '../../../../resources/html/time_place/time_place.css.js';
import '../../../../resources/img/time_place/time_place.jpg.js';
import '../../../../resources/html/tujian/tujian.css.js';
import '../../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../../resources/img/tuzhi/tuzhi.jpg.js';
import '../../../../resources/html/valuables/valuables.css.js';
import '../../../../resources/img/valuables/valuables-top.jpg.js';
import '../../../../resources/img/valuables/valuables-danyao.jpg.js';
import { getTimeStr } from '../../../../model/time.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)读取存档(.*)/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    try {
        if (!e.IsMaster) {
            Send(Text('只有主人可以执行操作'));
            return false;
        }
        const saveDataNum = Number(e.MessageText.replace('#读取存档', '').trim());
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
            redisObj = JSON.parse(fs.readFileSync(`${backUpPath}/redis.json`, 'utf8'));
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

export { res as default, regular, selects };
