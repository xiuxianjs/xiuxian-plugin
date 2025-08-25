import { getIoRedis } from '@alemonjs/db'
import { __PATH } from './keys.js'
import type { JSONData, FilePathType } from '../types/model'
import { filePathMap } from './settions.js'

/**
 * @param key
 * @returns
 */
export const getDataJSONParseByKey = async (key: string) => {
  const redis = getIoRedis()
  const ext = await redis.exists(key)
  if (!ext) {
    return null
  }
  const res = await redis.get(key)
  if (!res) {
    return null
  }
  let data = null
  try {
    data = JSON.parse(res)
  } catch (error) {
    logger.warn(error)
    return null
  }
  if (!data) {
    return null
  }
  return data
}

/**
 *
 * @param key
 * @returns
 */
export const getDataByKey = async (key: string) => {
  const redis = getIoRedis()
  const exists = await redis.exists(key)
  if (!exists) {
    return null
  }
  const res = await redis.get(key)
  if (!res) {
    return null
  }
  return res
}

/**
 * @param key
 * @param data
 */
export const setDataJSONStringifyByKey = async (key: string, data: unknown) => {
  const redis = getIoRedis()
  try {
    await redis.set(key, JSON.stringify(data))
    return true
  } catch (error) {
    logger.warn(error)
    return false
  }
}

/**
 * @param key
 * @returns
 */
export const existDataByKey = async (key: string) => {
  const redis = getIoRedis()
  const exists = await redis.exists(key)
  return exists === 1
}

/**
 * @param key
 * @param from
 * @param name
 * @returns
 */
export const existDataByPath = (
  key: keyof typeof __PATH,
  from: string,
  name: string
) => {
  const dir = `${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`
  const redis = getIoRedis()
  return redis.exists(dir)
}

/**
 * @param key
 * @param from
 * @param name
 * @returns
 */
export const readDataByPath = async (
  key: keyof typeof __PATH,
  from: string,
  name: string
) => {
  const redis = getIoRedis()
  try {
    const data = await redis.get(
      `${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`
    )
    return JSON.parse(data)
  } catch (error) {
    logger.error('读取文件错误：' + error)
    return null
  }
}

/**
 *
 * @param key
 * @param from
 * @param name
 * @param data
 */
export const writeDataByPath = (
  key: keyof typeof __PATH,
  from: string,
  name: string,
  data: JSONData
): void => {
  const redis = getIoRedis()
  redis.set(
    `${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`,
    JSON.stringify(data)
  )
}

/**
 * 检测存档存在
 * @param file_path_type ["player" , "association" ]
 * @param file_name
 * @deprecated
 */
async function existData(file_path_type: FilePathType, file_name: string) {
  const redis = getIoRedis()
  const res = await redis.exists(`${filePathMap[file_path_type]}:${file_name}`)
  return res === 1
}

/**
 * 获取文件数据(user_qq为空查询item下的file_name文件)
 * @param file_name  [player,equipment,najie]
 * @param user_qq
 * @deprecated
 */
async function getData(file_name: FilePathType | string, user_qq?: string) {
  const redis = getIoRedis()
  if (user_qq) {
    const data = await redis.get(`${filePathMap[file_name]}:${user_qq}`)
    return data ? JSON.parse(data) : null
  } else {
    const data = await redis.get(`${filePathMap[file_name]}`)
    return data ? JSON.parse(data) : null
  }
}

/**
 * 写入数据
 * @param file_name [player,equipment,najie]
 * @param user_qq
 * @param data
 * @deprecated
 */
function setData(
  file_name: FilePathType | string,
  user_qq: string | null,
  data: JSONData
): void {
  const redis = getIoRedis()
  redis.set(
    `${filePathMap[file_name]}${user_qq ? `:${user_qq}` : ''}`,
    JSON.stringify(data)
  )
  return
}
export default {
  existData,
  getData,
  setData
}
