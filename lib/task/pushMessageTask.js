import { redis } from '../model/api.js';
import { keys } from '../model/keys.js';
import '@alemonjs/db';
import '../model/DataList.js';
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
import dayjs from 'dayjs';
import 'buffer';
import { getAppConfig } from '../model/Config.js';
import { sendToChannel, sendToUser } from 'alemonjs';
import '../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../model/message.js';
import { clearOldMessages, getLastRunTime, getIdsByBotId, getRecentMessages, setIds, setLastRunTime } from '../model/MessageSystem.js';

const PushMessageTask = async () => {
    const now = dayjs();
    let windowMinutes = 5;
    try {
        await clearOldMessages();
        const lastRunStr = await getLastRunTime();
        if (lastRunStr) {
            const lastRun = dayjs(Number(lastRunStr));
            windowMinutes = Math.max(3, Math.min(30, Math.ceil(now.diff(lastRun, 'minute', true))));
        }
        const { cids, uids, mids } = await getIdsByBotId();
        const isMe = (item) => !mids.has(item.id) && (cids.has(item.cid) || uids.has(item.uid));
        const messages = (await getRecentMessages(windowMinutes)).filter(isMe);
        if (messages.length) {
            for (const item of messages) {
                try {
                    const isGroup = !!item.cid;
                    const value = getAppConfig();
                    const closeProactiveMessage = value?.close_proactive_message ?? false;
                    if (closeProactiveMessage) {
                        const id = String(item.uid);
                        if (!id) {
                            continue;
                        }
                        const data = JSON.parse(item.data);
                        void redis.lpush(keys.proactiveMessageLog(id), JSON.stringify({
                            message: data,
                            timestamp: Date.now()
                        }));
                        continue;
                    }
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
            }
        }
        void setLastRunTime();
    }
    catch (error) {
        logger.error(error);
    }
};

export { PushMessageTask };
