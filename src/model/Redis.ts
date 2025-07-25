import { getIoRedis } from '@alemonjs/db'

const baseKey = 'xiuxian@1.3.0'

/**
 * @param user_id
 * @param action
 * @returns
 */
export const getDataByUserId = async (
  user_id: string,
  action: 'shangjing' | 'lastsign_time' | 'action' | 'game_action'
) => {
  const redis = getIoRedis()
  return await redis.get(baseKey + ':' + user_id + ':' + action)
}

export const setDataByUserId = async (
  user_id: string,
  action: 'shangjing' | 'lastsign_time' | 'action' | 'game_action',
  value: any
) => {
  const redis = getIoRedis()
  return await redis.set(baseKey + ':' + user_id + ':' + action, value)
}
