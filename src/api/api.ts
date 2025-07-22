import config from '../model/Config'
import data from '../model/XiuxianData'
import Show from '../model/show'
import { getIoRedis } from '@alemonjs/db'
import puppeteer from '@src/image/index'
import { Image, sendToChannel, sendToUser, Text } from 'alemonjs'

/**
 *
 * @param param0
 * @returns
 */
export const verc = ({ e }) => {
  const { whitecrowd, blackid } = config.getConfig('parameter', 'namelist')
  if (whitecrowd.indexOf(e.group_id) == -1) return false
  if (blackid.indexOf(e.UserId) != -1) return false
  return true
}

export { data, config, Show, puppeteer }

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
export async function pushInfo(
  _platform: string,
  guild_id: string,
  isGroup: boolean,
  msg: Buffer | string
) {
  if (isGroup) {
    // 向指定频道发送消息 。SpaceId 从消息中获得，注意这可能不是 ChannelId
    sendToChannel(
      guild_id,
      format(typeof msg === 'string' ? Text(msg) : Image(msg))
    )
    return
  }
  // 向指定用户发送消息  OpenID 从消息中获得，注意这可能不是 UserId
  sendToUser(guild_id, format(typeof msg === 'string' ? Text(msg) : Image(msg)))
}
