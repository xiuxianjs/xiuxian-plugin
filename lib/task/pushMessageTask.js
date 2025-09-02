import { getIoRedis } from '@alemonjs/db';
import '../model/api.js';
import { keysAction } from '../model/keys.js';
import { getAppCofig } from '../model/Config.js';
import { sendToChannel, sendToUser } from 'alemonjs';
import dayjs from 'dayjs';
import '../model/DataList.js';
import '../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../resources/img/state.jpg.js';
import '../resources/styles/tw.scss.js';
import '../resources/font/tttgbnumber.ttf.js';
import '../resources/img/player.jpg.js';
import '../resources/img/player_footer.png.js';
import '../resources/img/user_state.png.js';
import 'classnames';
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
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../model/message.js';
import { clearOldMessages, getIdsByBotId, getRecentMessages, setIds } from '../model/MessageSystem.js';

const PushMessageTask = async () => {
    const redis = getIoRedis();
    const value = getAppCofig();
    const botId = value?.botId ?? 'xiuxian';
    const now = dayjs();
    let windowMinutes = 5;
    const lastRunKey = keysAction.system('push-lastRunTime', botId);
    try {
        await clearOldMessages();
        const lastRunStr = await redis.get(lastRunKey);
        if (lastRunStr) {
            const lastRun = dayjs(Number(lastRunStr));
            windowMinutes = Math.max(3, Math.min(30, Math.ceil(now.diff(lastRun, 'minute', true))));
        }
        const { cids, uids, mids } = await getIdsByBotId();
        const isMe = (item) => !mids.has(item.id) && (cids.has(item.cid) || uids.has(item.uid));
        const messages = (await getRecentMessages(windowMinutes)).filter(isMe);
        if (messages.length) {
            void Promise.all(messages.map(item => {
                try {
                    const isGroup = !!item.cid;
                    if (isGroup) {
                        const id = String(item.cid);
                        const data = JSON.parse(item.data);
                        void sendToChannel(id, data);
                    }
                    else {
                        const id = String(item.uid);
                        const data = JSON.parse(item.data);
                        void sendToUser(id, data);
                    }
                    void setIds({ mid: item.id });
                }
                catch (err) {
                    logger.error(`推送单条消息失败: ${item.id}`, err);
                }
            }));
        }
        void redis.set(lastRunKey, now.valueOf());
        logger.debug('消息池', {
            botId,
            lastRun: lastRunStr,
            windowMinutes,
            messages: messages
        });
    }
    catch (error) {
        logger.error(error);
    }
};

export { PushMessageTask };
