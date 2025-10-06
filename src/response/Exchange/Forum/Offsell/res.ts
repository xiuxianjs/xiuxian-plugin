import { Text, useSend } from 'alemonjs';
import { readPlayer, readForum, writeForum, addCoin, keysLock, compulsoryToNumber } from '@src/model/index';
import { withLock } from '@src/model/locks';
import mw from '@src/response/mw-captcha';
import { selects } from '@src/response/mw-captcha';

export const regular = /^(#|＃|\/)?取消.+$/;

// 锁配置
const FORUM_CANCEL_LOCK_CONFIG = {
  timeout: 30000, // 30秒超时
  retryDelay: 100, // 100ms重试间隔
  maxRetries: 5, // 最大重试5次
  enableRenewal: true, // 启用锁续期
  renewalInterval: 10000 // 10秒续期间隔
} as const;

// 错误消息常量
const ERROR_MESSAGES = {
  ARCHIVE_ERROR: '存档异常',
  INVALID_INDEX: '编号不合法',
  ORDER_NOT_FOUND: (index: number) => `没有编号为${index}的宝贝需求`,
  NOT_OWNER: '不能取消别人的宝贝需求',
  LOCK_ERROR: '系统繁忙，请稍后重试',
  SUCCESS: (playerName: string, itemName: string, refundAmount: number) => `${playerName}取消${itemName}成功,返还${refundAmount}灵石`
} as const;

// 解析订单ID
interface ParsedCancelCommand {
  orderId: string;
  isLegacyIndex: boolean;
}

function parseOrderId(messageText: string): ParsedCancelCommand | null {
  const idStr = messageText.replace(/^(#|＃|\/)?取消/, '').trim();

  if (!idStr) {
    return null;
  }

  // 判断是否为旧格式数字索引（纯数字且长度<=3，即1-999）或新格式ID（4-6位数字）
  // 旧格式：1, 2, 3 ... 999（数组索引）
  // 新格式：1000-999999（唯一ID）
  const numValue = parseInt(idStr, 10);
  const isLegacyIndex = /^\d{1,3}$/.test(idStr) && numValue >= 1 && numValue <= 999;

  return { orderId: idStr, isLegacyIndex };
}

// 验证订单所有权
function validateOrderOwnership(order: any, userId: string): boolean {
  return String(order.qq) === String(userId);
}

// 核心取消逻辑（在锁保护下执行）
const executeCancelWithLock = async (e: any, userId: string, orderId: string, isLegacyIndex: boolean) => {
  const Send = useSend(e);

  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text(ERROR_MESSAGES.ARCHIVE_ERROR));

    return;
  }

  const forum = await readForum();

  // 查找订单
  let orderIndex = -1;
  let order;

  if (isLegacyIndex) {
    // 旧格式：使用数字索引
    orderIndex = compulsoryToNumber(orderId, 1) - 1;
    if (orderIndex >= 0 && orderIndex < forum.length) {
      order = forum[orderIndex];
    }
  } else {
    // 新格式：使用ID查找
    orderIndex = forum.findIndex(item => item.id === orderId);
    if (orderIndex >= 0) {
      order = forum[orderIndex];
    }
  }

  if (!order || orderIndex < 0) {
    void Send(Text(ERROR_MESSAGES.ORDER_NOT_FOUND(isLegacyIndex ? compulsoryToNumber(orderId, 0) : 0)));

    return;
  }

  // 验证订单所有权
  if (!validateOrderOwnership(order, userId)) {
    void Send(Text(ERROR_MESSAGES.NOT_OWNER));

    return;
  }

  const refundAmount = compulsoryToNumber(order.whole, 0);

  // 返还灵石
  if (refundAmount > 0) {
    await addCoin(userId, refundAmount);
  }

  // 从论坛中移除订单
  forum.splice(orderIndex, 1);
  await writeForum(forum);

  void Send(Text(ERROR_MESSAGES.SUCCESS(player.名号, order.name, refundAmount)));
};

// 使用锁执行取消操作
const executeCancelWithLockWrapper = async (e: any, userId: string, orderId: string, isLegacyIndex: boolean) => {
  const lockKey = keysLock.forum(orderId);

  const result = await withLock(
    lockKey,
    async () => {
      await executeCancelWithLock(e, userId, orderId, isLegacyIndex);
    },
    FORUM_CANCEL_LOCK_CONFIG
  );

  if (!result.success) {
    const Send = useSend(e);

    logger.error('Forum cancel lock error:', result.error);
    void Send(Text('操作失败，请稍后再试'));
  }
};

const res = onResponse(selects, e => {
  const Send = useSend(e);
  const userId = e.UserId;

  // 解析订单ID
  const parsed = parseOrderId(e.MessageText);

  if (!parsed) {
    void Send(Text(ERROR_MESSAGES.INVALID_INDEX));

    return false;
  }

  const { orderId, isLegacyIndex } = parsed;

  // 使用锁执行取消操作
  void executeCancelWithLockWrapper(e, userId, orderId, isLegacyIndex);

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
