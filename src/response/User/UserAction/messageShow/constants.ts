import type { MessageType, MessagePriority, MessageStatus } from '@src/types/message';

// 冷却时间（秒）
export const CD_MS = 5 * 1000;

// 消息类型映射
export const MESSAGE_TYPE_MAP: Record<MessageType, string> = {
  system: '系统消息',
  announcement: '公告',
  reward: '奖励通知',
  activity: '活动通知',
  personal: '个人消息'
};

// 优先级映射
export const PRIORITY_MAP: Record<MessagePriority, string> = {
  1: '低',
  2: '普通',
  3: '高',
  4: '紧急'
};

// 状态映射
export const STATUS_MAP: Record<MessageStatus, string> = {
  0: '未读',
  1: '已读',
  2: '已删除'
};

// 分页配置
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 5
};
