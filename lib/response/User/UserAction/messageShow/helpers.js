import { STATUS_MAP, PRIORITY_MAP, MESSAGE_TYPE_MAP } from './constants.js';

const getMessageTypeName = (type) => {
    return MESSAGE_TYPE_MAP[type] || '未知类型';
};
const getPriorityName = (priority) => {
    return PRIORITY_MAP[priority] || '普通';
};
const getStatusName = (status) => {
    return STATUS_MAP[status] || '未知';
};
const formatMessageContent = (content, maxLength = 50) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
};
const formatCreateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('zh-CN');
};
const prepareImageData = (userId, stats, messages, pagination) => {
    return {
        userId,
        stats: {
            total: stats.total,
            unread: stats.unread,
            read: stats.read
        },
        messages: messages.map(msg => ({
            id: msg.id,
            title: msg.title,
            content: formatMessageContent(msg.content),
            type: getMessageTypeName(msg.type),
            priority: getPriorityName(msg.priority),
            status: getStatusName(msg.status),
            createTime: formatCreateTime(msg.createTime),
            sender: msg.senderName || '系统'
        })),
        pagination: {
            current: pagination.page,
            total: pagination.totalPages,
            totalMessages: pagination.total
        }
    };
};

export { formatCreateTime, formatMessageContent, getMessageTypeName, getPriorityName, getStatusName, prepareImageData };
