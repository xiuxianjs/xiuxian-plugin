import config from './Config';
import { getIoRedis } from '@alemonjs/db';
import { Image, sendToChannel, sendToUser, Text } from 'alemonjs';
import type { MessageEnumsArray, MessageInput } from '../types/model';

export { config };

export const redis = getIoRedis();

/**
 * @param guild_id
 * @param isGroup
 * @param msg
 * @returns
 */
export function pushInfo(guildId: string, isGroup: boolean, msg: MessageInput) {
  let message: MessageEnumsArray = [];

  if (typeof msg === 'string') {
    message = format(Text(msg)) as MessageEnumsArray;
  } else if (Buffer.isBuffer(msg)) {
    message = format(Image(msg)) as MessageEnumsArray;
  } else if (Array.isArray(msg)) {
    const list = msg.map(item => (typeof item === 'string' ? Text(item) : item));

    message = format(...list) as MessageEnumsArray;
  }
  if (message.length === 0) {
    return;
  }
  if (isGroup) {
    // 向指定频道发送消息 。SpaceId 从消息中获得，注意这可能不是 ChannelId
    void sendToChannel(String(guildId), message);

    return;
  }
  // 向指定用户发送消息  OpenID 从消息中获得，注意这可能不是 UserId
  void sendToUser(String(guildId), message);
}
