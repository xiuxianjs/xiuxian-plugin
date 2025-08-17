import { baseKey } from './constants'

type ActionType =
  | 'action'
  | 'xijie'
  | 'last_dajie_time'
  | 'last_biwu_time'
  | 'shangjing'
  | 'last_shuangxiu_time'
  | 'couple'
  | 'Record'
  | 'Record2'
  | 'Exchange'
  | 'lastxijie_time'
  | 'last_reCreate_time'
  | 'reCreate_acount'
  | 'lastsign_time'
  | 'last_setxuanyan_time'
  | 'last_setname_time'
  | 'duihuan'
  | 'showNajieCD'
  | 'lastbisai_time'
  | 'petShowCD'
  | 'game_action'
  | 'lastdagong_time'
  | 'bisai'
  | 'last_game_time'
  | 'last_dajie_time'
  | 'lastsign_Asso_time'
  | 'getLastsign_Explor'
  | 'zyt_cd'
  | 'dsc_cd'
  | 'last_garden_time'
  | 'forumShowCD'
  | 'supermarketCD'
  | 'ExchangeCD'
  | 'ForumCD'
  | 'money_game'
  | 'getLastsign_Bonus'
  | 'BOSSCD'

/**
 *
 * @param user_id
 * @param action
 * @returns
 */
export const getRedisKey = (user_id: string, action: ActionType) => {
  return baseKey + ':' + user_id + ':' + action
}

/**
 * @param name
 * @returns
 */
export const getRedisConfigKey = (name: string) => {
  return baseKey + ':config:' + name
}

export const getRedisSystemKey = (name: string) => {
  return baseKey + ':system:' + name
}
