import { getAppConfig, keys, redis } from '@src/model';
import { clearOldMessages, getIdsByBotId, getLastRunTime, getRecentMessages, IMessage, setIds, setLastRunTime } from '@src/model/MessageSystem';
import { DataEnums, sendToChannel, sendToUser } from 'alemonjs';
import dayjs from 'dayjs';

/**
 * 推送消息任务。每分钟执行一次。
 * - 动态调整读取窗口，防止定时任务漂移漏消息
 * - 推送成功后才记录为已推送
 */
export const PushMessageTask = async (): Promise<void> => {
  // const value = getAppConfig();
  // const botId = value?.botId ?? 'xiuxian';

  // 以 dayjs 获取当前时间
  const now = dayjs();
  let windowMinutes = 5;

  // bot专属上次执行时间key

  try {
    await clearOldMessages();

    const lastRunStr = await getLastRunTime();

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
      for (const item of messages) {
        try {
          const isGroup = !!item.cid;

          const value = getAppConfig();
          const closeProactiveMessage = value?.close_proactive_message ?? false;

          if (closeProactiveMessage) {
            const id = String(item.uid);

            if (!id) {
              continue;
            }

            // 消息推送到 redis里。
            const data: DataEnums[] = JSON.parse(item.data);

            void redis.lpush(
              keys.proactiveMessageLog(id),
              JSON.stringify({
                message: data,
                timestamp: Date.now()
              })
            );

            continue;
          }

          if (isGroup) {
            const id = String(item.cid);
            const data: DataEnums[] = JSON.parse(item.data);

            void sendToChannel(id, data);
          } else {
            const id = String(item.uid);

            const data: DataEnums[] = JSON.parse(item.data);

            void sendToUser(id, data);
          }
          // 推送成功后再记录为已推送
          void setIds({ mid: item.id });
        } catch (err) {
          logger.error(`推送单条消息失败: ${item.id}`, err);
        }
      }
    }

    // 更新本次执行时间
    void setLastRunTime();

    // logger.debug('消息池', {
    //   botId,
    //   lastRun: lastRunStr,
    //   windowMinutes,
    //   messages: messages
    // });
  } catch (error) {
    logger.error(error);
  }
};
