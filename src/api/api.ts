import config from '@src/model/Config'
import data from '@src/model/XiuxianData'
import { getIoRedis } from '@alemonjs/db'
import puppeteer from '@src/image/index'
import { DataMention, Image, sendToChannel, sendToUser, Text } from 'alemonjs'

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
export async function pushInfo(
  guild_id: string,
  isGroup: boolean,
  msg: Buffer | string | Array<string | DataMention>
) {
  let message: any
  if (typeof msg == 'string') message = format(Text(msg))
  else if (Buffer.isBuffer(msg)) message = format(Image(msg))
  else {
    const list = msg.map(item => {
      if (typeof item == 'string') return Text(item)
      else return item
    })
    message = format(...list)
  }

  if (isGroup) {
    // 向指定频道发送消息 。SpaceId 从消息中获得，注意这可能不是 ChannelId
    sendToChannel(String(guild_id), message)
    return
  }
  // 向指定用户发送消息  OpenID 从消息中获得，注意这可能不是 UserId
  sendToUser(String(guild_id), message)
}
