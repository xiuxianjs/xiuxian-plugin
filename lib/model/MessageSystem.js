import { getIoRedis } from '@alemonjs/db';
import './api.js';
import { keysAction } from './keys.js';
import './DataList.js';
import { getAppConfig } from './Config.js';
import { Mention } from 'alemonjs';
import dayjs from 'dayjs';
import './settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../resources/img/state.jpg.js';
import '../resources/styles/tw.scss.js';
import '../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../resources/img/player.jpg.js';
import '../resources/img/player_footer.png.js';
import '../resources/img/user_state.png.js';
import '../resources/img/fairyrealm.jpg.js';
import '../resources/img/card.jpg.js';
import '../resources/img/road.jpg.js';
import '../resources/img/user_state2.png.js';
import '../resources/html/help.js';
import '../resources/img/najie.jpg.js';
import '../resources/img/shituhelp.jpg.js';
import '../resources/img/icon.png.js';
import '../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import './currency.js';
import 'crypto';
import 'posthog-node';
import './message.js';

const createMessageId = () => {
    const now = dayjs().valueOf();
    const rand = Math.floor(Math.random() * 1000);
    return String(now * 1000 + rand);
};
const getIdsByBotId = async () => {
    const redis = getIoRedis();
    const value = getAppConfig();
    const botId = value?.botId ?? 'xiuxian';
    const cidsArr = await redis.smembers(keysAction.system('message:cids', botId));
    const uidsArr = await redis.smembers(keysAction.system('message:uids', botId));
    const midArr = await redis.smembers(keysAction.system('message:mid', botId));
    const cidsSet = new Set(cidsArr);
    const uidsSet = new Set(uidsArr);
    const tagSet = new Set(midArr);
    return {
        cids: cidsSet,
        uids: uidsSet,
        mids: tagSet
    };
};
const setIds = async ({ cid, uid, mid }) => {
    const value = getAppConfig();
    const botId = value?.botId ?? 'xiuxian';
    const redis = getIoRedis();
    if (cid) {
        await redis.sadd(keysAction.system('message:cids', botId), cid);
    }
    if (uid) {
        await redis.sadd(keysAction.system('message:uids', botId), uid);
    }
    if (mid) {
        await redis.sadd(keysAction.system('message:mid', botId), mid);
    }
};
async function setMessage(message) {
    const redis = getIoRedis();
    const now = dayjs().valueOf();
    const zsetKey = keysAction.system('message:zset', 'g');
    message.id = message?.id || createMessageId();
    if (!message.id) {
        return;
    }
    if (!message.cid && !message.uid) {
        return;
    }
    if (!message.data) {
        return;
    }
    await redis.zadd(zsetKey, now, JSON.stringify(message));
}
async function getRecentMessages(minutes = 5) {
    const redis = getIoRedis();
    const now = dayjs();
    const min = now.subtract(minutes, 'minute').valueOf();
    const zsetKey = keysAction.system('message:zset', 'g');
    const result = await redis.zrangebyscore(zsetKey, min, now.valueOf());
    return result.map(str => JSON.parse(str));
}
const clearOldMessages = async () => {
    const redis = getIoRedis();
    const now = dayjs();
    const zsetKey = keysAction.system('message:zset', 'g');
    await redis.zremrangebyscore(zsetKey, 0, now.subtract(30, 'minute').valueOf());
};
const getLastRunTime = async () => {
    const redis = getIoRedis();
    const value = getAppConfig();
    const botId = value?.botId ?? 'xiuxian';
    const lastRunKey = keysAction.system('message:lasttime', botId);
    const lastRunStr = await redis.get(lastRunKey);
    return lastRunStr ? dayjs(Number(lastRunStr)) : null;
};
const setLastRunTime = async () => {
    const redis = getIoRedis();
    const value = getAppConfig();
    const botId = value?.botId ?? 'xiuxian';
    const lastRunKey = keysAction.system('message:lasttime', botId);
    const time = dayjs();
    await redis.set(lastRunKey, time.valueOf());
};
const pushMessage = ({ uid, cid }, data) => {
    if (cid && uid) {
        void setMessage({
            id: '',
            uid: uid ?? '',
            cid: cid ?? '',
            data: JSON.stringify(format(Mention(uid), ...data))
        });
        return;
    }
    void setMessage({
        id: '',
        uid: uid ?? '',
        cid: cid ?? '',
        data: JSON.stringify(format(...data))
    });
};

export { clearOldMessages, getIdsByBotId, getLastRunTime, getRecentMessages, pushMessage, setIds, setLastRunTime, setMessage };
