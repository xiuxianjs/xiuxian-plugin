import { pushInfo } from '@src/model/api';
import { readTemp, writeTemp } from '@src/model/temp';
import type { TempMessage } from '@src/types';
import { screenshot } from '@src/image';

interface GroupMessage {
  groupId: string;
  messages: string[];
}

interface ProcessResult {
  success: boolean;
  processedGroups: number;
  errorCount: number;
}

/**
 * 获取唯一的群组ID列表
 * @param tempMessages 临时消息列表
 * @returns 唯一的群组ID列表
 */
const getUniqueGroupIds = (tempMessages: TempMessage[]): string[] => {
  const groupIds = new Set<string>();

  for (const message of tempMessages) {
    if (message.qq_group) {
      groupIds.add(message.qq_group);
    }
  }

  return Array.from(groupIds);
};

/**
 * 按群组分组消息
 * @param tempMessages 临时消息列表
 * @param groupIds 群组ID列表
 * @returns 分组后的消息
 */
const groupMessagesByGroupId = (tempMessages: TempMessage[], groupIds: string[]): GroupMessage[] => {
  const groupedMessages: GroupMessage[] = [];

  for (const groupId of groupIds) {
    const messages = tempMessages.filter(message => message.qq_group === groupId).map(message => message.msg);

    groupedMessages.push({
      groupId,
      messages
    });
  }

  return groupedMessages;
};

/**
 * 处理单个群组的消息
 * @param groupMessage 群组消息
 * @returns 是否处理成功
 */
const processGroupMessages = async (groupMessage: GroupMessage): Promise<boolean> => {
  try {
    const { groupId, messages } = groupMessage;

    if (messages.length === 0) {
      return false;
    }

    // 准备截图数据
    const tempData = { temp: messages };

    // 生成截图
    const img = await screenshot('temp', groupId, tempData);

    if (!img) {
      return false;
    }

    // 推送消息
    pushInfo(groupId, true, img);

    return true;
  } catch (error) {
    logger.error(error);

    return false;
  }
};

/**
 * 处理所有群组消息
 * @param groupedMessages 分组后的消息
 * @returns 处理结果
 */
const processAllGroupMessages = async (groupedMessages: GroupMessage[]): Promise<ProcessResult> => {
  let processedGroups = 0;
  let errorCount = 0;

  for (const groupMessage of groupedMessages) {
    try {
      const success = await processGroupMessages(groupMessage);

      if (success) {
        processedGroups++;
      } else {
        errorCount++;
      }
    } catch (error) {
      logger.error(error);
      errorCount++;
    }
  }

  return {
    success: processedGroups > 0,
    processedGroups,
    errorCount
  };
};

/**
 * 消息任务 - 处理临时消息推送
 * 读取临时消息列表，按群分组整理消息，生成截图并推送到对应群组
 */
export const MsgTask = async (): Promise<void> => {
  try {
    // 读取临时消息
    const tempMessages: TempMessage[] = await readTemp();

    if (!tempMessages || tempMessages.length === 0) {
      return;
    }

    // 获取唯一的群组ID
    const groupIds = getUniqueGroupIds(tempMessages);

    if (groupIds.length === 0) {
      return;
    }

    // 按群组分组消息
    const groupedMessages = groupMessagesByGroupId(tempMessages, groupIds);

    // 处理所有群组消息
    await processAllGroupMessages(groupedMessages);

    // 清空临时消息记录
    await writeTemp([]);
  } catch (error) {
    logger.error(error);
  }
};
