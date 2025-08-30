import { screenshot } from '../image/index.js';
import { redis } from './api.js';
import { setDataJSONStringifyByKey, getDataJSONParseByKey } from './DataControl.js';
import { getDataList } from './DataList.js';
import { keys, keysByPath, __PATH, getRedisKey } from './keys.js';
import '@alemonjs/db';
import 'alemonjs';
import { shijianc } from './common.js';
import { readPlayer } from './xiuxiandata.js';
import 'lodash-es';
import './settions.js';
import 'dayjs';
import 'svg-captcha';
import 'sharp';
import './currency.js';
import 'crypto';
import 'posthog-node';
import './message.js';

async function writeTiandibang(wupin) {
    await setDataJSONStringifyByKey(keys.tiandibang('tiandibang'), wupin);
}
async function readTiandibang() {
    const data = await getDataJSONParseByKey(keys.tiandibang('tiandibang'));
    return data ?? [];
}
async function getLastbisai(usrId) {
    const timeStr = await redis.get(getRedisKey(String(usrId), 'lastbisai_time'));
    if (timeStr !== null) {
        const details = shijianc(parseInt(timeStr, 10));
        return details;
    }
    return false;
}
async function getTianditangImage(e, jifen) {
    const userId = e.UserId;
    const player = await readPlayer(userId);
    const commodities_list = await getDataList('Tianditang');
    const tianditang_data = {
        name: player.名号,
        jifen,
        commodities_list: commodities_list
    };
    const img = await screenshot('tianditang', e.UserId, tianditang_data);
    return img;
}
async function reBangdang() {
    const playerList = await keysByPath(__PATH.player_path);
    const temp = [];
    for (let k = 0; k < playerList.length; k++) {
        const thisQqStr = playerList[k];
        const player = await readPlayer(thisQqStr);
        const levelList = await getDataList('Level1');
        const level_id = levelList.find(item => item.level_id === player.level_id)?.level_id;
        if (level_id === null) {
            continue;
        }
        temp.push({
            名号: player.名号,
            境界: level_id,
            攻击: player.攻击,
            防御: player.防御,
            当前血量: player.血量上限,
            暴击率: player.暴击率,
            灵根: player.灵根,
            法球倍率: player.灵根.法球倍率,
            学习的功法: player.学习的功法,
            魔道值: player.魔道值 ?? 0,
            神石: player.神石 ?? 0,
            qq: thisQqStr,
            次数: 3,
            积分: 0
        });
    }
    temp.sort((a, b) => b.积分 - a.积分);
    await writeTiandibang(temp);
    return false;
}

export { getLastbisai, getTianditangImage, reBangdang, readTiandibang, writeTiandibang };
