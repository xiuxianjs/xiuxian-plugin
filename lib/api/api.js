import config from '../model/Config.js';
export { default as data } from '../model/XiuxianData.js';
export { default as Show } from '../model/show.js';
import { Redis } from 'ioredis';
export { default as puppeteer } from '../image/index.js';
import { getConfigValue, sendToChannel, Text, Image, sendToUser } from 'alemonjs';

const verc = ({ e }) => {
    const { whitecrowd, blackid } = config.getConfig('parameter', 'namelist');
    if (whitecrowd.indexOf(e.group_id) == -1)
        return false;
    if (blackid.indexOf(e.UserId) != -1)
        return false;
    return true;
};
const value = getConfigValue();
const redisValue = value.redis || {};
const redis = new Redis({
    port: redisValue.port || 6379,
    host: redisValue.host || '127.0.0.1',
    db: redisValue.db || 3,
    password: redisValue.password || ''
});
async function pushInfo(_platform, guild_id, isGroup, msg) {
    if (isGroup) {
        sendToChannel(guild_id, format(typeof msg === 'string' ? Text(msg) : Image(msg)));
        return;
    }
    sendToUser(guild_id, format(typeof msg === 'string' ? Text(msg) : Image(msg)));
}

export { config, pushInfo, redis, verc };
