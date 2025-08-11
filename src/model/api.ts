import config from './Config'
import data from './XiuxianData'
import { getIoRedis } from '@alemonjs/db'
import puppeteer from '@src/image/index'
import { Image, sendToChannel, sendToUser, Text } from 'alemonjs'
import type {
  AnyIncomingEvent,
  NameListConfig,
  MessageEnumsArray,
  MessageInput
} from '../types/model'

/**
 * 校验事件是否通过白名单/黑名单限制
 * @param param0 包含事件对象
 */
export const verc = ({
  e
}: {
  e: AnyIncomingEvent & { group_id?: string | number }
}): boolean => {
  const { whitecrowd, blackid } = config.getConfig(
    'parameter',
    'namelist'
  ) as NameListConfig
  if (
    Array.isArray(whitecrowd) &&
    whitecrowd.indexOf(e.group_id as string | number) === -1
  )
    return false
  if (Array.isArray(blackid) && blackid.indexOf(e.UserId) !== -1) return false
  return true
}

export { data, config, puppeteer }

/**
 *
 */
export const redis = getIoRedis()

/**
 *
 * @param platform
 * @param guild_id
 * @param isGroup
 * @param msg
 * @returns
 */
// alemonjs 的 format(Text(..), ...) 返回内部统一的 DataEnums[]，这里用宽松别名
export async function pushInfo(
  guild_id: string,
  isGroup: boolean,
  msg: MessageInput
) {
  let message: MessageEnumsArray
  if (typeof msg == 'string') message = format(Text(msg)) as MessageEnumsArray
  else if (Buffer.isBuffer(msg))
    message = format(Image(msg)) as MessageEnumsArray
  else {
    const list = msg.map(item => (typeof item == 'string' ? Text(item) : item))
    message = format(...list) as MessageEnumsArray
  }

  if (isGroup) {
    // 向指定频道发送消息 。SpaceId 从消息中获得，注意这可能不是 ChannelId
    sendToChannel(String(guild_id), message)
    return
  }
  // 向指定用户发送消息  OpenID 从消息中获得，注意这可能不是 UserId
  sendToUser(String(guild_id), message)
}
