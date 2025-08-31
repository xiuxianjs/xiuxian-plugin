import { screenshot } from '../image/index.js';
import { redis } from './api.js';
import { setDataJSONStringifyByKey, getDataJSONParseByKey } from './DataControl.js';
import { getDataList } from './DataList.js';
import { keys, getRedisKey } from './keys.js';
import '@alemonjs/db';
import 'alemonjs';
import { shijianc } from './common.js';
import { readPlayer } from './xiuxiandata.js';
import './settions.js';
import 'dayjs';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
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
    if (!player) {
        return;
    }
    const commoditiesList = await getDataList('Tianditang');
    const img = await screenshot('tianditang', e.UserId, {
        name: player.名号,
        jifen,
        commodities_list: commoditiesList
    });
    return img;
}

export { getLastbisai, getTianditangImage, readTiandibang, writeTiandibang };
