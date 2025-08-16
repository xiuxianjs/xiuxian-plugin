import YAML from 'yaml'
import { readFileSync } from 'fs'
import { __PATH_CONFIG, __PATH_CONFIG_MAP } from './paths'
import { getIoRedis } from '@alemonjs/db'
import { getRedisConfigKey } from './key'

export type ConfigKey = keyof typeof __PATH_CONFIG

export const hasConfig = async (name: ConfigKey) => {
  const redis = getIoRedis()
  const key = getRedisConfigKey(name)
  const e = await redis.exists(key)
  return e > 0
}

export const setConfig = async (name: ConfigKey, data: any) => {
  try {
    const redis = getIoRedis()
    const key = getRedisConfigKey(name)
    await redis.set(key, JSON.stringify(data))
    return true
  } catch (error) {
    logger.error(error)
    return false
  }
}

/**
 *
 * @param _app
 * @param name
 * @returns
 */
export async function getConfig(_app: string, name: ConfigKey) {
  const redis = getIoRedis()
  const key = getRedisConfigKey(name)
  const fileURL = __PATH_CONFIG[name]
  const data = YAML.parse(readFileSync(fileURL, 'utf8'))
  const curData = await redis.get(key)
  if (curData) {
    const db = JSON.parse(curData)
    return {
      ...data,
      ...db
    }
  }
  return data
}

export default {
  getConfig
}
