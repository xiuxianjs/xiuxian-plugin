import { client as clientICQQ } from '@alemonjs/qq'
import { client as clientQQBot } from '@alemonjs/qq-bot'
import { client as clientQQGroup } from '@alemonjs/qq-group-bot'
import config from '../model/Config'
import data from '../model/XiuxianData'
import Show from '../model/show'
import { Redis } from 'ioredis'
import puppeteer from 'image/index'

export const verc = ({ e }) => {
  const { whitecrowd, blackid } = config.getConfig('parameter', 'namelist')
  if (whitecrowd.indexOf(e.group_id) == -1) return false
  if (blackid.indexOf(e.UserId) != -1) return false
  return true
}

export { data, config, Show, puppeteer }
export const redis = new Redis({
  port: 6379, // Redis port
  host: '127.0.0.1', // Redis host
  db: 3 // use the first database
})
export async function pushInfo(
  platform,
  guild_id,
  isGroup,
  msg: Buffer | string
) {
  switch (platform) {
    case 'qq':
      if (isGroup) {
        await clientICQQ.sendGroupMsg(
          guild_id,
          Buffer.isBuffer(msg) ? { type: 'image', file: msg } : msg
        )
      } else {
        await clientICQQ.sendPrivateMsg(
          guild_id,
          Buffer.isBuffer(msg) ? { type: 'image', file: msg } : msg
        )
      }
      break
    case 'qq-bot':
      const key = Buffer.isBuffer(msg) ? 'image' : 'content'
      if (isGroup) {
        await clientQQBot.channelsMessagesPost(guild_id, { [key]: msg })
      } else {
        await clientQQBot.dmsMessage(guild_id, { [key]: msg })
      }
      break
    case 'qq-group-bot':
      const msg_type = Buffer.isBuffer(msg) ? 7 : 0
      const key1 = Buffer.isBuffer(msg) ? 'image' : 'content'
      if (isGroup) {
        await clientQQGroup.groupOpenMessages(guild_id, {
          msg_type,
          [key1]: msg
        })
      } else {
        await clientQQGroup.usersOpenMessages(guild_id, {
          msg_type,
          [key1]: msg
        })
      }
  }
}
