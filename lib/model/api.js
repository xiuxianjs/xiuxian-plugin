export { default as config } from './Config.js';
export { default as data } from './XiuxianData.js';
import { getIoRedis } from '@alemonjs/db';
import { Text, Image, sendToChannel, sendToUser } from 'alemonjs';

const redis = getIoRedis();
async function pushInfo(guild_id, isGroup, msg) {
    let message = [];
    if (typeof msg == 'string')
        message = format(Text(msg));
    else if (Buffer.isBuffer(msg))
        message = format(Image(msg));
    else if (Array.isArray(msg)) {
        const list = msg.map(item => (typeof item == 'string' ? Text(item) : item));
        message = format(...list);
    }
    if (message.length === 0) {
        return;
    }
    if (isGroup) {
        sendToChannel(String(guild_id), message);
        return;
    }
    sendToUser(String(guild_id), message);
}

export { pushInfo, redis };
