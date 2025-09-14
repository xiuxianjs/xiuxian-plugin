import { Text, useSend } from 'alemonjs';
import { readPlayer, readForum, writeForum, addCoin, keysLock, compulsoryToNumber } from '@src/model/index';
import { withLock } from '@src/model/locks';
import mw from '@src/response/mw-captcha';
import { selects } from '@src/response/mw-captcha';

export const regular = /^(#|＃|\/)?取消[1-9]\d*$/;

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

// 解析订单索引
function parseOrderIndex(messageText: string): number | null {
  const indexStr = messageText.replace(/^(#|＃|\/)?取消/, '').trim();

  if (!indexStr || !/^[1-9]\d*$/.test(indexStr)) {
    return null;
  }

  const index = compulsoryToNumber(indexStr, 1) - 1;

  return index >= 0 ? index : null;
}

// 验证订单所有权
function validateOrderOwnership(order: any, userId: string): boolean {
  return String(order.qq) === String(userId);
}

// 核心取消逻辑（在锁保护下执行）
const executeCancelWithLock = async (e: any, userId: string, orderIndex: number) => {
  const Send = useSend(e);

  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text(ERROR_MESSAGES.ARCHIVE_ERROR));

    return;
  }

  const forum = await readForum();

  if (orderIndex >= forum.length) {
    void Send(Text(ERROR_MESSAGES.ORDER_NOT_FOUND(orderIndex + 1)));

    return;
  }

  const order = forum[orderIndex];

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
const executeCancelWithLockWrapper = async (e: any, userId: string, orderIndex: number) => {
  const lockKey = keysLock.forum(String(orderIndex));

  const result = await withLock(
    lockKey,
    async () => {
      await executeCancelWithLock(e, userId, orderIndex);
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

  // 解析订单索引
  const orderIndex = parseOrderIndex(e.MessageText);

  if (orderIndex === null) {
    void Send(Text(ERROR_MESSAGES.INVALID_INDEX));

    return false;
  }

  // 使用锁执行取消操作
  void executeCancelWithLockWrapper(e, userId, orderIndex);

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
