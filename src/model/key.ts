import { baseKey } from './settions'

type ActionType = 'action' | 'xijie'

/**
 *
 * @param user_id
 * @param action
 * @returns
 */
export const getRedisKey = (user_id: string, action: ActionType) => {
  return baseKey + ':' + user_id + ':' + action
}
