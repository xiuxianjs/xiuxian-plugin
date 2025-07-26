import { getIoRedis } from '@alemonjs/db'

const baseKey = 'xiuxian@1.3.0'

type ActionType =
  | 'shangjing'
  | 'lastsign_time'
  | 'action'
  | 'game_action'
  | 'lastxijie_time'

/**
 * @param user_id
 * @param action
 * @returns
 */
export const getDataByUserId = async (user_id: string, action: ActionType) => {
  const redis = getIoRedis()
  return await redis.get(baseKey + ':' + user_id + ':' + action)
}

export const setDataByUserId = async (
  user_id: string,
  action: ActionType,
  value: any
) => {
  const redis = getIoRedis()
  return await redis.set(baseKey + ':' + user_id + ':' + action, value)
}
