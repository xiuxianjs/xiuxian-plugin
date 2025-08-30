import { getIoRedis } from '@alemonjs/db';
import { keys } from './keys.js';
import {
  Message,
  MessageQueryParams,
  MessageListResponse,
  SendMessageParams,
  MessageStats,
  MessageOperationResult,
  MessageStatus,
  MessageType,
  MessagePriority
} from '@src/types/message';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';

const redis = getIoRedis();

// 生成消息ID
const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 获取用户站内信列表
export const getUserMessages = async (userId: string, params: MessageQueryParams = {}): Promise<MessageListResponse> => {
  try {
    const { page = 1, pageSize = 10, type, status, priority, startTime, endTime, keyword } = params;

    // 获取用户所有消息
    const messageKey = keys.message(userId);
    const messagesData = await getDataJSONParseByKey(messageKey);
    let messages: Message[] = Array.isArray(messagesData) ? messagesData : [];

    // 过滤已删除的消息
    messages = messages.filter(msg => msg.status !== MessageStatus.DELETED);

    // 应用过滤条件
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

    // 按创建时间倒序排序
    messages.sort((a, b) => b.createTime - a.createTime);

    // 分页处理
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
  } catch (error) {
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

// 获取单条消息
export const getMessage = async (userId: string, messageId: string): Promise<Message | null> => {
  try {
    const messageKey = keys.message(userId);
    const messagesData = await getDataJSONParseByKey(messageKey);
    const messages: Message[] = Array.isArray(messagesData) ? messagesData : [];

    const message = messages.find(msg => msg.id === messageId);

    return message || null;
  } catch (error) {
    logger.error('获取单条消息失败:', error);

    return null;
  }
};

// 发送站内信
export const sendMessage = async (params: SendMessageParams): Promise<MessageOperationResult> => {
  try {
    const { title, content, type, priority = MessagePriority.NORMAL, receivers, expireTime, attachments, metadata } = params;

    const messageId = generateMessageId();
    const now = Date.now();

    // 创建消息对象
    const message: Message = {
      id: messageId,
      title,
      content,
      type,
      priority,
      status: MessageStatus.UNREAD,
      sender: 'system',
      senderName: '系统',
      receiver: receivers.length === 0 ? 'all' : receivers[0], // 简化处理，实际应该为每个接收者创建消息
      createTime: now,
      expireTime,
      attachments,
      metadata
    };

    // 如果是全服消息
    if (receivers.length === 0) {
      // 获取所有玩家ID
      const playerKeys = await redis.keys(`${keys.player('*').replace('*', '*')}`);
      const playerIds = playerKeys.map(key => key.split(':').pop() || '').filter(Boolean);

      // 为每个玩家创建消息
      for (const playerId of playerIds) {
        await addMessageToUser(playerId, message);
      }

      return {
        success: true,
        message: `全服消息发送成功，共发送给 ${playerIds.length} 个玩家`,
        data: { messageId, receiverCount: playerIds.length }
      };
    } else {
      // 为指定玩家发送消息
      for (const receiverId of receivers) {
        await addMessageToUser(receiverId, message);
      }

      return {
        success: true,
        message: `消息发送成功，共发送给 ${receivers.length} 个玩家`,
        data: { messageId, receiverCount: receivers.length }
      };
    }
  } catch (error) {
    logger.error('发送站内信失败:', error);

    return {
      success: false,
      message: `发送站内信失败: ${error}`
    };
  }
};

// 添加消息到用户
const addMessageToUser = async (userId: string, message: Message): Promise<void> => {
  try {
    const messageKey = keys.message(userId);
    const messagesData = await getDataJSONParseByKey(messageKey);
    const messages: Message[] = Array.isArray(messagesData) ? messagesData : [];

    // 为每个用户创建独立的消息副本
    const userMessage: Message = {
      ...message,
      id: `${message.id}_${userId}`,
      receiver: userId
    };

    messages.push(userMessage);
    await setDataJSONStringifyByKey(messageKey, messages);
  } catch (error) {
    logger.error(`为用户 ${userId} 添加消息失败:`, error);
  }
};

// 标记消息为已读
export const markMessageAsRead = async (userId: string, messageId: string): Promise<MessageOperationResult> => {
  try {
    const messageKey = keys.message(userId);
    const messagesData = await getDataJSONParseByKey(messageKey);
    const messages: Message[] = Array.isArray(messagesData) ? messagesData : [];

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
  } catch (error) {
    logger.error('标记消息为已读失败:', error);

    return {
      success: false,
      message: `标记消息为已读失败: ${error}`
    };
  }
};

// 删除消息
export const deleteMessage = async (userId: string, messageId: string): Promise<MessageOperationResult> => {
  try {
    const messageKey = keys.message(userId);
    const messagesData = await getDataJSONParseByKey(messageKey);
    const messages: Message[] = Array.isArray(messagesData) ? messagesData : [];

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
  } catch (error) {
    logger.error('删除消息失败:', error);

    return {
      success: false,
      message: `删除消息失败: ${error}`
    };
  }
};

// 获取用户消息统计
export const getUserMessageStats = async (userId: string): Promise<MessageStats> => {
  try {
    const messageKey = keys.message(userId);
    const messagesData = await getDataJSONParseByKey(messageKey);
    const messages: Message[] = Array.isArray(messagesData) ? messagesData : [];

    // 过滤已删除的消息
    const activeMessages = messages.filter(msg => msg.status !== MessageStatus.DELETED);

    const stats: MessageStats = {
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

    // 统计各类型和优先级
    activeMessages.forEach(msg => {
      stats.byType[msg.type]++;
      stats.byPriority[msg.priority]++;
    });

    return stats;
  } catch (error) {
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

// 获取全服消息统计（管理员用）
export const getGlobalMessageStats = async (): Promise<MessageStats> => {
  try {
    // 检查缓存，缓存5分钟
    const cacheKey = 'global_message_stats_cache';
    const cachedStats = await redis.get(cacheKey);

    if (cachedStats) {
      try {
        const parsed = JSON.parse(cachedStats);
        const cacheTime = parsed.cacheTime || 0;

        // 如果缓存时间在5分钟内，直接返回缓存数据
        if (Date.now() - cacheTime < 5 * 60 * 1000) {
          return parsed.stats;
        }
      } catch (error) {
        logger.warn('解析缓存的全服统计失败:', error);
      }
    }

    // 获取所有消息key
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

    // 统计所有用户的消息
    for (const key of messageKeys) {
      const messagesData = await getDataJSONParseByKey(key);
      const messages: Message[] = Array.isArray(messagesData) ? messagesData : [];

      messages.forEach(msg => {
        totalMessages++;

        if (msg.status === MessageStatus.UNREAD) {
          totalUnread++;
        } else if (msg.status === MessageStatus.READ) {
          totalRead++;
        } else if (msg.status === MessageStatus.DELETED) {
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

    // 缓存结果
    try {
      await redis.setex(
        cacheKey,
        300,
        JSON.stringify({
          stats,
          cacheTime: Date.now()
        })
      );
    } catch (error) {
      logger.warn('缓存全服统计失败:', error);
    }

    return stats;
  } catch (error) {
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

// 清理过期消息
export const cleanExpiredMessages = async (): Promise<number> => {
  try {
    const messageKeys = await redis.keys(`${keys.message('*').replace('*', '*')}`);
    const now = Date.now();
    let cleanedCount = 0;

    for (const key of messageKeys) {
      const messagesData = await getDataJSONParseByKey(key);
      const messages: Message[] = Array.isArray(messagesData) ? messagesData : [];

      // 过滤掉过期的消息
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
  } catch (error) {
    logger.error('清理过期消息失败:', error);

    return 0;
  }
};
