import config from '../model/Config.js';
export { default as data } from '../model/XiuxianData.js';
import { getIoRedis } from '@alemonjs/db';
export { default as puppeteer } from '../image/index.js';
import { Text, Image, sendToChannel, sendToUser } from 'alemonjs';

const verc = ({ e }) => {
    const { whitecrowd, blackid } = config.getConfig('parameter', 'namelist');
    if (whitecrowd.indexOf(e.group_id) == -1)
        return false;
    if (blackid.indexOf(e.UserId) != -1)
        return false;
    return true;
};
const redis = getIoRedis();
async function pushInfo(guild_id, isGroup, msg) {
    let message;
    if (typeof msg == 'string')
        message = format(Text(msg));
    else if (Buffer.isBuffer(msg))
        message = format(Image(msg));
    else {
        const list = msg.map(item => {
            if (typeof item == 'string')
                return Text(item);
            else
                return item;
        });
        message = format(...list);
    }
    if (isGroup) {
        sendToChannel(String(guild_id), message);
        return;
    }
    sendToUser(String(guild_id), message);
}

export { config, pushInfo, redis, verc };
