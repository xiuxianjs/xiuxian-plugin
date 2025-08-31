import { Text, useSend } from 'alemonjs';
import {
  Go,
  readPlayer,
  readForum,
  writeForum,
  convert2integer,
  existNajieThing,
  addNajieThing,
  addCoin,
  compulsoryToNumber,
  keysLock
} from '@src/model/index';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { withLock } from '@src/model/locks';
import type { NajieCategory } from '@src/types/model';
import type { ForumOrder } from '@src/types/forum';

// 正则表达式匹配接取指令
export const regular = /^(#|＃|\/)?接取.*$/;

// 常量定义
const MAX_QTY = 1_000_000_000;
const MAX_PRICE_SUM = 1e15;

// 锁配置
const FORUM_LOCK_CONFIG = {
  timeout: 30000, // 30秒超时
  retryDelay: 100, // 100ms重试间隔
  maxRetries: 5, // 最大重试5次
  enableRenewal: true, // 启用锁续期
  renewalInterval: 10000 // 10秒续期间隔
} as const;

// 错误消息常量
const ERROR_MESSAGES = {
  ARCHIVE_ERROR: '存档异常',
  FORMAT_ERROR: '格式: 接取编号*数量 (数量可省略为全部)',
  PARSE_ERROR: '指令解析失败',
  INVALID_INDEX: '编号不合法',
  ORDER_NOT_FOUND: '没有该编号的求购单',
  SELF_ORDER: '没事找事做?',
  ORDER_INVALID: '该求购单已失效',
  INVALID_QTY: '数量需为正整数',
  NO_ITEM: (itemName: string) => `你没有【${itemName}】`,
  INSUFFICIENT_ITEM: (itemName: string, qty: number) => `你只有【${itemName}】 x ${qty}`,
  PRICE_ERROR: '价格计算异常',
  LOCK_ERROR: '系统繁忙，请稍后重试',
  SUCCESS: (playerName: string, gain: number, itemName: string, qty: number) => `${playerName}在聚宝堂收获了${gain}灵石！(交付 ${itemName} x ${qty})`
} as const;

// 解析指令参数
interface ParsedCommand {
  orderIndex: number;
  deliverQty: number;
}

function parseCommand(messageText: string): ParsedCommand | null {
  const body = messageText.replace(/^(#|＃|\/)?接取/, '').trim();

  if (!body) {
    return null;
  }

  const segments = body
    .split('*')
    .map(s => s.trim())
    .filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const idxRaw = segments[0];
  const qtyRaw = segments[1];

  const orderIndex = compulsoryToNumber(idxRaw, 1) - 1;

  if (orderIndex < 0) {
    return null;
  }

  // 解析数量
  let deliverQty: number;

  if (!qtyRaw) {
    deliverQty = -1; // 表示全部
  } else {
    deliverQty = compulsoryToNumber(convert2integer(qtyRaw), 0);
    if (deliverQty <= 0) {
      return null;
    }
  }

  return { orderIndex, deliverQty };
}

// 验证订单有效性
function validateOrder(order: ForumOrder, userId: string): string | null {
  if (String(order.qq) === String(userId)) {
    return ERROR_MESSAGES.SELF_ORDER;
  }

  const unitPrice = compulsoryToNumber(order.price, 0);
  const remaining = compulsoryToNumber(order.aconut, 0);

  if (unitPrice <= 0 || remaining <= 0) {
    return ERROR_MESSAGES.ORDER_INVALID;
  }

  return null;
}

// 计算交付数量
function calculateDeliverQty(requestedQty: number, remaining: number): number {
  if (requestedQty === -1) {
    return remaining; // 全部
  }

  let deliverQty = Math.min(requestedQty, remaining);

  deliverQty = Math.min(deliverQty, MAX_QTY);

  return deliverQty;
}

// 验证价格计算
function validatePrice(unitPrice: number, deliverQty: number): number | null {
  const gain = unitPrice * deliverQty;

  if (!Number.isFinite(gain) || gain <= 0 || gain > MAX_PRICE_SUM) {
    return null;
  }

  return gain;
}

// 执行交易
async function executeTransaction(userId: string, order: ForumOrder, deliverQty: number, gain: number): Promise<void> {
  const orderOwnerId = String(order.qq ?? '');

  if (!orderOwnerId) {
    return;
  }

  // 扣除物品 & 增加灵石 & 给对方物品
  await addNajieThing(userId, order.name, order.class as NajieCategory, -deliverQty);
  await addCoin(userId, gain);
  await addNajieThing(orderOwnerId, order.name, order.class as NajieCategory, deliverQty);
}

// 更新订单状态
function updateOrder(order: ForumOrder, deliverQty: number, gain: number): boolean {
  const remaining = compulsoryToNumber(order.aconut, 0);
  const newRemaining = remaining - deliverQty;

  order.aconut = newRemaining;

  // 更新总价
  if (typeof order.whole === 'number') {
    order.whole = order.whole - gain;
  }

  return newRemaining <= 0; // 返回是否应该删除订单
}

// 核心业务逻辑（在锁保护下执行）
const executePurchaseWithLock = async (e: any, userId: string, orderIndex: number, requestedQty: number) => {
  const Send = useSend(e);

  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text(ERROR_MESSAGES.ARCHIVE_ERROR));

    return;
  }

  // 读取论坛数据
  const forum = await readForum();

  if (orderIndex >= forum.length) {
    void Send(Text(ERROR_MESSAGES.ORDER_NOT_FOUND));

    return;
  }

  const order = forum[orderIndex];

  // 验证订单
  const validationError = validateOrder(order, userId);

  if (validationError) {
    void Send(Text(validationError));

    return;
  }

  const unitPrice = compulsoryToNumber(order.price, 0);
  const remaining = compulsoryToNumber(order.aconut, 0);

  // 计算实际交付数量
  const actualDeliverQty = calculateDeliverQty(requestedQty, remaining);

  // 检查库存
  const hasNum = await existNajieThing(userId, order.name, order.class as NajieCategory);

  if (!hasNum) {
    void Send(Text(ERROR_MESSAGES.NO_ITEM(order.name)));

    return;
  }

  if (hasNum < actualDeliverQty) {
    void Send(Text(ERROR_MESSAGES.INSUFFICIENT_ITEM(order.name, hasNum)));

    return;
  }

  // 验证价格计算
  const gain = validatePrice(unitPrice, actualDeliverQty);

  if (gain === null) {
    void Send(Text(ERROR_MESSAGES.PRICE_ERROR));

    return;
  }

  // 执行交易
  await executeTransaction(userId, order, actualDeliverQty, gain);

  // 更新订单
  const shouldDelete = updateOrder(order, actualDeliverQty, gain);

  if (shouldDelete) {
    forum.splice(orderIndex, 1);
  }

  await writeForum(forum);

  void Send(Text(ERROR_MESSAGES.SUCCESS(player.名号, gain, order.name, actualDeliverQty)));
};

// 使用锁执行购买操作
const executePurchaseWithLockWrapper = async (e: any, userId: string, orderIndex: number, requestedQty: number) => {
  const lockKey = keysLock.forum(String(orderIndex));

  const result = await withLock(
    lockKey,
    async () => {
      await executePurchaseWithLock(e, userId, orderIndex, requestedQty);
    },
    FORUM_LOCK_CONFIG
  );

  if (!result.success) {
    const Send = useSend(e);

    void Send(Text(ERROR_MESSAGES.LOCK_ERROR));
  }
};

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await Go(e))) {
    return false;
  }

  // 解析指令
  const parsed = parseCommand(e.MessageText);

  if (!parsed) {
    void Send(Text(ERROR_MESSAGES.FORMAT_ERROR));

    return false;
  }

  const { orderIndex, deliverQty: requestedQty } = parsed;

  // 使用锁执行购买操作
  void executePurchaseWithLockWrapper(e, userId, orderIndex, requestedQty);

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
