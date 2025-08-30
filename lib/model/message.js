import { getIoRedis } from '@alemonjs/db';
import { keys } from './keys.js';
import { MessageStatus, MessagePriority, MessageType } from '../types/message.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';

const redis = getIoRedis();
const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
const getUserMessages = async (userId, params = {}) => {
    try {
        const { page = 1, pageSize = 10, type, status, priority, startTime, endTime, keyword } = params;
        const messageKey = keys.message(userId);
        const messagesData = await getDataJSONParseByKey(messageKey);
        let messages = Array.isArray(messagesData) ? messagesData : [];
        messages = messages.filter(msg => msg.status !== MessageStatus.DELETED);
        if (type) {
            messages = messages.filter(msg => msg.type === type);
        }
        if (status !== undefined) {
            messages = messages.filter(msg => msg.status === status);
        }
        if (priority) {
            messages = messages.filter(msg => msg.priority === priority);
        }
        if (startTime) {
            messages = messages.filter(msg => msg.createTime >= startTime);
        }
        if (endTime) {
            messages = messages.filter(msg => msg.createTime <= endTime);
        }
        if (keyword) {
            const lowerKeyword = keyword.toLowerCase();
            messages = messages.filter(msg => msg.title.toLowerCase().includes(lowerKeyword) || msg.content.toLowerCase().includes(lowerKeyword));
        }
        messages.sort((a, b) => b.createTime - a.createTime);
        const total = messages.length;
        const totalPages = Math.ceil(total / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedMessages = messages.slice(startIndex, endIndex);
        return {
            messages: paginatedMessages,
            total,
            page,
            pageSize,
            totalPages
        };
    }
    catch (error) {
        logger.error('获取用户站内信失败:', error);
        return {
            messages: [],
            total: 0,
            page: params.page || 1,
            pageSize: params.pageSize || 10,
            totalPages: 0
        };
    }
};
const getMessage = async (userId, messageId) => {
    try {
        const messageKey = keys.message(userId);
        const messagesData = await getDataJSONParseByKey(messageKey);
        const messages = Array.isArray(messagesData) ? messagesData : [];
        const message = messages.find(msg => msg.id === messageId);
        return message || null;
    }
    catch (error) {
        logger.error('获取单条消息失败:', error);
        return null;
    }
};
const sendMessage = async (params) => {
    try {
        const { title, content, type, priority = MessagePriority.NORMAL, receivers, expireTime, attachments, metadata } = params;
        const messageId = generateMessageId();
        const now = Date.now();
        const message = {
            id: messageId,
            title,
            content,
            type,
            priority,
            status: MessageStatus.UNREAD,
            sender: 'system',
            senderName: '系统',
            receiver: receivers.length === 0 ? 'all' : receivers[0],
            createTime: now,
            expireTime,
            attachments,
            metadata
        };
        if (receivers.length === 0) {
            const playerKeys = await redis.keys(`${keys.player('*').replace('*', '*')}`);
            const playerIds = playerKeys.map(key => key.split(':').pop() || '').filter(Boolean);
            for (const playerId of playerIds) {
                await addMessageToUser(playerId, message);
            }
            return {
                success: true,
                message: `全服消息发送成功，共发送给 ${playerIds.length} 个玩家`,
                data: { messageId, receiverCount: playerIds.length }
            };
        }
        else {
            for (const receiverId of receivers) {
                await addMessageToUser(receiverId, message);
            }
            return {
                success: true,
                message: `消息发送成功，共发送给 ${receivers.length} 个玩家`,
                data: { messageId, receiverCount: receivers.length }
            };
        }
    }
    catch (error) {
        logger.error('发送站内信失败:', error);
        return {
            success: false,
            message: `发送站内信失败: ${error}`
        };
    }
};
const addMessageToUser = async (userId, message) => {
    try {
        const messageKey = keys.message(userId);
        const messagesData = await getDataJSONParseByKey(messageKey);
        const messages = Array.isArray(messagesData) ? messagesData : [];
        const userMessage = {
            ...message,
            id: `${message.id}_${userId}`,
            receiver: userId
        };
        messages.push(userMessage);
        await setDataJSONStringifyByKey(messageKey, messages);
    }
    catch (error) {
        logger.error(`为用户 ${userId} 添加消息失败:`, error);
    }
};
const markMessageAsRead = async (userId, messageId) => {
    try {
        const messageKey = keys.message(userId);
        const messagesData = await getDataJSONParseByKey(messageKey);
        const messages = Array.isArray(messagesData) ? messagesData : [];
        const messageIndex = messages.findIndex(msg => msg.id === messageId);
        if (messageIndex === -1) {
            return {
                success: false,
                message: '消息不存在'
            };
        }
        messages[messageIndex].status = MessageStatus.READ;
        messages[messageIndex].readTime = Date.now();
        await setDataJSONStringifyByKey(messageKey, messages);
        return {
            success: true,
            message: '消息已标记为已读'
        };
    }
    catch (error) {
        logger.error('标记消息为已读失败:', error);
        return {
            success: false,
            message: `标记消息为已读失败: ${error}`
        };
    }
};
const deleteMessage = async (userId, messageId) => {
    try {
        const messageKey = keys.message(userId);
        const messagesData = await getDataJSONParseByKey(messageKey);
        const messages = Array.isArray(messagesData) ? messagesData : [];
        const messageIndex = messages.findIndex(msg => msg.id === messageId);
        if (messageIndex === -1) {
            return {
                success: false,
                message: '消息不存在'
            };
        }
        messages[messageIndex].status = MessageStatus.DELETED;
        await setDataJSONStringifyByKey(messageKey, messages);
        return {
            success: true,
            message: '消息已删除'
        };
    }
    catch (error) {
        logger.error('删除消息失败:', error);
        return {
            success: false,
            message: `删除消息失败: ${error}`
        };
    }
};
const getUserMessageStats = async (userId) => {
    try {
        const messageKey = keys.message(userId);
        const messagesData = await getDataJSONParseByKey(messageKey);
        const messages = Array.isArray(messagesData) ? messagesData : [];
        const activeMessages = messages.filter(msg => msg.status !== MessageStatus.DELETED);
        const stats = {
            total: activeMessages.length,
            unread: activeMessages.filter(msg => msg.status === MessageStatus.UNREAD).length,
            read: activeMessages.filter(msg => msg.status === MessageStatus.READ).length,
            deleted: messages.filter(msg => msg.status === MessageStatus.DELETED).length,
            byType: {
                [MessageType.SYSTEM]: 0,
                [MessageType.ANNOUNCEMENT]: 0,
                [MessageType.REWARD]: 0,
                [MessageType.ACTIVITY]: 0,
                [MessageType.PERSONAL]: 0
            },
            byPriority: {
                [MessagePriority.LOW]: 0,
                [MessagePriority.NORMAL]: 0,
                [MessagePriority.HIGH]: 0,
                [MessagePriority.URGENT]: 0
            }
        };
        activeMessages.forEach(msg => {
            stats.byType[msg.type]++;
            stats.byPriority[msg.priority]++;
        });
        return stats;
    }
    catch (error) {
        logger.error('获取用户消息统计失败:', error);
        return {
            total: 0,
            unread: 0,
            read: 0,
            deleted: 0,
            byType: {
                [MessageType.SYSTEM]: 0,
                [MessageType.ANNOUNCEMENT]: 0,
                [MessageType.REWARD]: 0,
                [MessageType.ACTIVITY]: 0,
                [MessageType.PERSONAL]: 0
            },
            byPriority: {
                [MessagePriority.LOW]: 0,
                [MessagePriority.NORMAL]: 0,
                [MessagePriority.HIGH]: 0,
                [MessagePriority.URGENT]: 0
            }
        };
    }
};
const getGlobalMessageStats = async () => {
    try {
        const cacheKey = 'global_message_stats_cache';
        const cachedStats = await redis.get(cacheKey);
        if (cachedStats) {
            try {
                const parsed = JSON.parse(cachedStats);
                const cacheTime = parsed.cacheTime || 0;
                if (Date.now() - cacheTime < 5 * 60 * 1000) {
                    return parsed.stats;
                }
            }
            catch (error) {
                logger.warn('解析缓存的全服统计失败:', error);
            }
        }
        const messageKeys = await redis.keys(`${keys.message('*').replace('*', '*')}`);
        let totalMessages = 0;
        let totalUnread = 0;
        let totalRead = 0;
        let totalDeleted = 0;
        const byType = {
            [MessageType.SYSTEM]: 0,
            [MessageType.ANNOUNCEMENT]: 0,
            [MessageType.REWARD]: 0,
            [MessageType.ACTIVITY]: 0,
            [MessageType.PERSONAL]: 0
        };
        const byPriority = {
            [MessagePriority.LOW]: 0,
            [MessagePriority.NORMAL]: 0,
            [MessagePriority.HIGH]: 0,
            [MessagePriority.URGENT]: 0
        };
        for (const key of messageKeys) {
            const messagesData = await getDataJSONParseByKey(key);
            const messages = Array.isArray(messagesData) ? messagesData : [];
            messages.forEach(msg => {
                totalMessages++;
                if (msg.status === MessageStatus.UNREAD) {
                    totalUnread++;
                }
                else if (msg.status === MessageStatus.READ) {
                    totalRead++;
                }
                else if (msg.status === MessageStatus.DELETED) {
                    totalDeleted++;
                }
                byType[msg.type]++;
                byPriority[msg.priority]++;
            });
        }
        const stats = {
            total: totalMessages,
            unread: totalUnread,
            read: totalRead,
            deleted: totalDeleted,
            byType,
            byPriority
        };
        try {
            await redis.setex(cacheKey, 300, JSON.stringify({
                stats,
                cacheTime: Date.now()
            }));
        }
        catch (error) {
            logger.warn('缓存全服统计失败:', error);
        }
        return stats;
    }
    catch (error) {
        logger.error('获取全服消息统计失败:', error);
        return {
            total: 0,
            unread: 0,
            read: 0,
            deleted: 0,
            byType: {
                [MessageType.SYSTEM]: 0,
                [MessageType.ANNOUNCEMENT]: 0,
                [MessageType.REWARD]: 0,
                [MessageType.ACTIVITY]: 0,
                [MessageType.PERSONAL]: 0
            },
            byPriority: {
                [MessagePriority.LOW]: 0,
                [MessagePriority.NORMAL]: 0,
                [MessagePriority.HIGH]: 0,
                [MessagePriority.URGENT]: 0
            }
        };
    }
};
const cleanExpiredMessages = async () => {
    try {
        const messageKeys = await redis.keys(`${keys.message('*').replace('*', '*')}`);
        const now = Date.now();
        let cleanedCount = 0;
        for (const key of messageKeys) {
            const messagesData = await getDataJSONParseByKey(key);
            const messages = Array.isArray(messagesData) ? messagesData : [];
            const validMessages = messages.filter(msg => {
                if (msg.expireTime && msg.expireTime < now) {
                    cleanedCount++;
                    return false;
                }
                return true;
            });
            if (validMessages.length !== messages.length) {
                await setDataJSONStringifyByKey(key, validMessages);
            }
        }
        return cleanedCount;
    }
    catch (error) {
        logger.error('清理过期消息失败:', error);
        return 0;
    }
};

export { cleanExpiredMessages, deleteMessage, getGlobalMessageStats, getMessage, getUserMessageStats, getUserMessages, markMessageAsRead, sendMessage };
