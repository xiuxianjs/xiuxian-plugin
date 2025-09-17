import { getAppConfig } from './Config.js';
export { default as config } from './Config.js';
import { getIoRedis } from '@alemonjs/db';
import { Text, Image, sendToChannel, sendToUser } from 'alemonjs';

const redis = getIoRedis();
function pushInfo(guildId, isGroup, msg) {
    let message = [];
    if (typeof msg === 'string') {
        message = format(Text(msg));
    }
    else if (Buffer.isBuffer(msg)) {
        message = format(Image(msg));
    }
    else if (Array.isArray(msg)) {
        const list = msg.map(item => (typeof item === 'string' ? Text(item) : item));
        message = format(...list);
    }
    if (message.length === 0) {
        return;
    }
    const value = getAppConfig();
    const closeProactiveMessage = value?.close_proactive_message ?? false;
    if (closeProactiveMessage) {
        return;
    }
    if (isGroup) {
        void sendToChannel(String(guildId), message);
        return;
    }
    void sendToUser(String(guildId), message);
}

export { pushInfo, redis };
