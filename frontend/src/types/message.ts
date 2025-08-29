// 站内信状态枚举
export enum MessageStatus {
  UNREAD = 0, // 未读
  READ = 1, // 已读
  DELETED = 2 // 已删除
}

// 站内信类型枚举
export enum MessageType {
  SYSTEM = 'system', // 系统消息
  ANNOUNCEMENT = 'announcement', // 公告
  REWARD = 'reward', // 奖励通知
  ACTIVITY = 'activity', // 活动通知
  PERSONAL = 'personal' // 个人消息
}

// 站内信优先级枚举
export enum MessagePriority {
  LOW = 1, // 低优先级
  NORMAL = 2, // 普通优先级
  HIGH = 3, // 高优先级
  URGENT = 4 // 紧急优先级
}

// 站内信基础接口
export interface Message {
  id: string; // 消息ID
  title: string; // 消息标题
  content: string; // 消息内容
  type: MessageType; // 消息类型
  priority: MessagePriority; // 消息优先级
  status: MessageStatus; // 消息状态
  sender: string; // 发送者ID (system表示系统消息)
  senderName?: string; // 发送者名称
  receiver: string; // 接收者ID (all表示全服消息)
  receiverName?: string; // 接收者名称
  createTime: number; // 创建时间戳
  readTime?: number; // 阅读时间戳
  expireTime?: number; // 过期时间戳 (可选)
  attachments?: MessageAttachment[]; // 附件信息
  metadata?: Record<string, any>; // 元数据
}

// 消息附件接口
export interface MessageAttachment {
  type: 'item' | 'currency' | 'equipment' | 'image'; // 附件类型
  name: string; // 附件名称
  value: any; // 附件值
  description?: string; // 附件描述
}

// 站内信列表查询参数
export interface MessageQueryParams {
  page?: number; // 页码
  pageSize?: number; // 每页数量
  type?: MessageType; // 消息类型过滤
  status?: MessageStatus; // 消息状态过滤
  priority?: MessagePriority; // 消息优先级过滤
  startTime?: number; // 开始时间
  endTime?: number; // 结束时间
  keyword?: string; // 关键词搜索
}

// 站内信列表响应
export interface MessageListResponse {
  messages: Message[]; // 消息列表
  total: number; // 总数量
  page: number; // 当前页码
  pageSize: number; // 每页数量
  totalPages: number; // 总页数
}

// 发送站内信参数
export interface SendMessageParams {
  title: string; // 消息标题
  content: string; // 消息内容
  type: MessageType; // 消息类型
  priority?: MessagePriority; // 消息优先级
  receivers: string[]; // 接收者ID列表 (空数组表示全服)
  expireTime?: number; // 过期时间
  attachments?: MessageAttachment[]; // 附件
  metadata?: Record<string, any>; // 元数据
}

// 站内信统计信息
export interface MessageStats {
  total: number; // 总消息数
  unread: number; // 未读消息数
  read: number; // 已读消息数
  deleted: number; // 已删除消息数
  byType: Record<MessageType, number>; // 按类型统计
  byPriority: Record<MessagePriority, number>; // 按优先级统计
}

// 站内信操作结果
export interface MessageOperationResult {
  success: boolean; // 操作是否成功
  message: string; // 操作结果消息
  data?: any; // 操作返回数据
}
