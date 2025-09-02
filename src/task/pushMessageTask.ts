import { getIoRedis } from '@alemonjs/db';
import { getAppCofig, keysAction } from '@src/model';
import { clearOldMessages, getIdsByBotId, getRecentMessages, IMessage, setIds } from '@src/model/MessageSystem';
import { sendToChannel, sendToUser } from 'alemonjs';
import dayjs from 'dayjs';

/**
 * 推送消息任务。每分钟执行一次。
 * - 动态调整读取窗口，防止定时任务漂移漏消息
 * - 推送成功后才记录为已推送
 */
export const PushMessageTask = async (): Promise<void> => {
  const redis = getIoRedis();

  const value = getAppCofig();
  const botId = value?.botId ?? 'xiuxian';

  // 以 dayjs 获取当前时间
  const now = dayjs();
  let windowMinutes = 5;

  // bot专属上次执行时间key
  const lastRunKey = keysAction.system('push-lastRunTime', botId);

  try {
    await clearOldMessages();

    const lastRunStr = await redis.get(lastRunKey);

    if (lastRunStr) {
      const lastRun = dayjs(Number(lastRunStr));

      // 动态窗口：实际间隔(分钟)，最少3分钟，最多15分钟
      windowMinutes = Math.max(3, Math.min(30, Math.ceil(now.diff(lastRun, 'minute', true))));
    }

    const { cids, uids, mids } = await getIdsByBotId();

    const isMe = (item: IMessage) => !mids.has(item.id) && (cids.has(item.cid) || uids.has(item.uid));

    // 读取最近 windowMinutes 分钟的消息
    const messages: IMessage[] = (await getRecentMessages(windowMinutes)).filter(isMe);

    if (messages.length) {
      await Promise.all(
        messages.map(item => {
          try {
            const isGroup = !!item.cid;

            if (isGroup) {
              const id = String(item.cid);
              const data = JSON.parse(item.data);

              void sendToChannel(id, data);
            } else {
              const id = String(item.uid);

              const data = JSON.parse(item.data);

              void sendToUser(id, data);
            }
            // 推送成功后再记录为已推送
            void setIds({ mid: item.id });
          } catch (err) {
            logger.error(`推送单条消息失败: ${item.id}`, err);
          }
        })
      );
    }

    // 更新本次执行时间
    await redis.set(lastRunKey, now.valueOf());
  } catch (error) {
    logger.error(error);
  }
};
