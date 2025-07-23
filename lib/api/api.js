import config from '../model/Config.js';
export { default as data } from '../model/XiuxianData.js';
import { getIoRedis } from '@alemonjs/db';
export { default as puppeteer } from '../image/index.js';
import { sendToChannel, Text, Image, sendToUser } from 'alemonjs';

const verc = ({ e }) => {
    const { whitecrowd, blackid } = config.getConfig('parameter', 'namelist');
    if (whitecrowd.indexOf(e.group_id) == -1)
        return false;
    if (blackid.indexOf(e.UserId) != -1)
        return false;
    return true;
};
const redis = getIoRedis();
async function pushInfo(_platform, guild_id, isGroup, msg) {
    if (isGroup) {
        sendToChannel(guild_id, format(typeof msg === 'string' ? Text(msg) : Image(msg)));
        return;
    }
    sendToUser(guild_id, format(typeof msg === 'string' ? Text(msg) : Image(msg)));
}

export { config, pushInfo, redis, verc };
