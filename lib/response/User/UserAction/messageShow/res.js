import { onResponse, useSend, Text, Image } from 'alemonjs';
import '../../../../model/api.js';
import { getRedisKey } from '../../../../model/keys.js';
import { getIoRedis } from '@alemonjs/db';
import '../../../../model/DataList.js';
import { screenshot } from '../../../../image/index.js';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import { getUserMessageStats, getUserMessages, markMessageAsRead } from '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';
import { CD_MS, PAGINATION_CONFIG } from './constants.js';
import { prepareImageData } from './helpers.js';

const redis = getIoRedis();
const regular = /^(#|＃|\/)?传信符$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        void Send(Text('请先创建角色！'));
        return false;
    }
    const cdKey = getRedisKey(userId, 'messageShowCD');
    const lastTs = Number(await redis.get(cdKey)) || 0;
    const now = Date.now();
    if (now < lastTs + CD_MS) {
        const remain = Math.ceil((lastTs + CD_MS - now) / 1000);
        void Send(Text(`请求过于频繁，请${remain}秒后再试`));
        return false;
    }
    await redis.set(cdKey, String(now));
    try {
        const stats = await getUserMessageStats(userId);
        const messageList = await getUserMessages(userId, {
            page: PAGINATION_CONFIG.DEFAULT_PAGE,
            pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE
        });
        const imageData = prepareImageData(userId, stats, messageList.messages, {
            page: messageList.page,
            totalPages: messageList.totalPages,
            total: messageList.total
        });
        const img = await screenshot('message', userId, imageData);
        if (Buffer.isBuffer(img)) {
            void Send(Image(img));
            if (stats.unread > 0 && messageList.messages.length > 0) {
                const firstUnread = messageList.messages.find(msg => msg.status === 0);
                if (firstUnread) {
                    await markMessageAsRead(userId, firstUnread.id);
                }
            }
            return false;
        }
        logger.warn('图片生成失败，使用文本降级方案');
        let textMessage = '📬 道友的传信符\n\n';
        textMessage += `📊 统计信息：总消息 ${stats.total} 条，未读 ${stats.unread} 条，已读 ${stats.read} 条\n\n`;
        if (messageList.messages.length === 0) {
            textMessage += '📭 暂无消息记录';
        }
        else {
            textMessage += '📋 最新消息列表：\n';
            messageList.messages.forEach((msg, index) => {
                const statusText = msg.status === 0 ? '🔴未读' : msg.status === 1 ? '🟢已读' : '⚫已删';
                const priorityText = msg.priority === 1 ? '低' : msg.priority === 2 ? '普通' : msg.priority === 3 ? '高' : '紧急';
                const timeText = new Date(msg.createTime).toLocaleString('zh-CN');
                textMessage += `${index + 1}. [${statusText}] [${priorityText}] ${msg.title}\n`;
                textMessage += `   内容：${msg.content.length > 30 ? msg.content.substring(0, 30) + '...' : msg.content}\n`;
                textMessage += `   时间：${timeText}\n\n`;
            });
            if (messageList.totalPages > 1) {
                textMessage += `📄 第 ${messageList.page}/${messageList.totalPages} 页，共 ${messageList.total} 条消息`;
            }
        }
        void Send(Text(textMessage));
        if (stats.unread > 0 && messageList.messages.length > 0) {
            const firstUnread = messageList.messages.find(msg => msg.status === 0);
            if (firstUnread) {
                await markMessageAsRead(userId, firstUnread.id);
            }
        }
        return false;
    }
    catch (error) {
        logger.error('获取站内信失败:', error);
        void Send(Text('获取站内信失败，请稍后重试'));
        return false;
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
