import { authRequest } from './base';
import type { SendMessageParams, MessageListResponse, MessageStats, MessageOperationResult } from '../types/message';

// 获取用户站内信列表
export const getUserMessages = (params: {
  userId: string;
  page?: number;
  pageSize?: number;
  type?: string;
  status?: number;
  priority?: number;
  keyword?: string;
}): Promise<{ code: number; message: string; data: MessageListResponse }> => {
  return authRequest({
    url: '/messages',
    method: 'GET',
    params
  });
};

// 发送站内信
export const sendMessage = (data: SendMessageParams): Promise<{ code: number; message: string; data: MessageOperationResult }> => {
  return authRequest({
    url: '/messages',
    method: 'POST',
    data
  });
};

// 标记消息为已读
export const markMessageAsRead = (data: { userId: string; messageId: string }): Promise<{ code: number; message: string; data: MessageOperationResult }> => {
  return authRequest({
    url: '/messages',
    method: 'PUT',
    data
  });
};

// 删除消息
export const deleteMessage = (data: { userId: string; messageId: string }): Promise<{ code: number; message: string; data: MessageOperationResult }> => {
  return authRequest({
    url: '/messages',
    method: 'DELETE',
    data
  });
};

// 获取消息统计
export const getMessageStats = (params: { userId?: string; global?: boolean }): Promise<{ code: number; message: string; data: MessageStats }> => {
  return authRequest({
    url: '/message-stats',
    method: 'GET',
    params
  });
};

// 清理过期消息
export const cleanExpiredMessages = (): Promise<{
  code: number;
  message: string;
  data: { cleanedCount: number };
}> => {
  return authRequest({
    url: '/message-stats',
    method: 'POST'
  });
};
