import { dirname } from 'path'
import { fileURLToPath } from 'url'

/**
 * 创建app名称
 * @param url
 * @param select
 * @returns
 */
export const createEventName = (url: string, select = 'apps') => {
  const __dirname = dirname(fileURLToPath(url))
  const dirs = __dirname.split('/').reverse()
  const name = dirs.slice(0, dirs.indexOf(select)).join(':')
  return `xiuxian:${select}:${name}`
}

const cdCache = {}

/**
 * @param UID
 * @returns
 */
export const operationLocalLock = (UID: string) => {
  const Now = Date.now()
  // 2300
  if (cdCache[UID] && Number(cdCache[UID]) + 2300 > Now) {
    return false
  }
  cdCache[UID] = Now
  return true
}

const testCache = {}

/**
 * @param UID
 * @returns
 */
/**
 * @param UID
 * @returns
 */
export const testTip = (UID: string) => {
  if (testCache) return true
  testCache[UID] = true
  return false
}
