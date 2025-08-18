import Association from '@src/config/help/association'
import help from '@src/config/help/base'
import help2 from '@src/config/help/extensions'
import set from '@src/config/help/admin'
import shituhelp from '@src/config/help/professor'
import xiuxian from '@src/config/xiuxian'

// 存档存放路径
const __PATH = {
  player_path: 'data:alemonjs-xiuxian:player',
  equipment_path: 'data:alemonjs-xiuxian:equipment',
  najie_path: 'data:alemonjs-xiuxian:xiuxian_najie',
  danyao_path: 'data:alemonjs-xiuxian:xiuxian_danyao',
  lib_path: 'data:alemonjs-xiuxian:item',
  Timelimit: 'data:alemonjs-xiuxian:Timelimit',
  Exchange: 'data:alemonjs-xiuxian:Exchange',
  Level: 'data:alemonjs-xiuxian:Level',
  shop: 'data:alemonjs-xiuxian:shop',
  log_path: 'data:alemonjs-xiuxian:suduku',
  association: 'data:alemonjs-xiuxian:association',
  tiandibang: 'data:alemonjs-xiuxian:tiandibang',
  qinmidu: 'data:alemonjs-xiuxian:qinmidu',
  backup: 'data:alemonjs-xiuxian:backup',
  shitu: 'data:alemonjs-xiuxian:shitu',
  duanlu: 'data:alemonjs-xiuxian:duanlu',
  temp_path: 'data:alemonjs-xiuxian:temp',
  custom: 'data:alemonjs-xiuxian:custom',
  auto_backup: 'data:alemonjs-xiuxian:auto_backup',
  occupation: 'data:alemonjs-xiuxian:occupation',
  // 用户货币数据
  player_currency: 'data:alemonjs-xiuxian:currency',
  // 所有充值记录
  currency_log: 'data:alemonjs-xiuxian:currency_log',
  // 充值记录索引。根据索引生成。
  currency_index: 'data:alemonjs-xiuxian:currency_index',
  // 验证码
  captcha: 'data:alemonjs-xiuxian:captcha',
  // 禁言
  mute: 'data:alemonjs-xiuxian:mute'
}

export { __PATH }

export const __PATH_CONFIG = {
  Association,
  help,
  help2,
  set,
  shituhelp,
  xiuxian
}

import { baseKey } from './constants'

export type ActionType =
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

export const keys = {
  player: (id: string) => `${__PATH.player_path}:${id}`,
  equipment: (id: string) => `${__PATH.equipment_path}:${id}`,
  najie: (id: string) => `${__PATH.najie_path}:${id}`,
  occupation: (id: string) => `${__PATH.occupation}:${id}`,
  danyao: (id: string) => `${__PATH.danyao_path}:${id}`,
  lib: (id: string) => `${__PATH.lib_path}:${id}`,
  timelimit: (id: string) => `${__PATH.Timelimit}:${id}`,
  exchange: (id: string) => `${__PATH.Exchange}:${id}`,
  level: (id: string) => `${__PATH.Level}:${id}`,
  shop: (id: string) => `${__PATH.shop}:${id}`,
  log: (id: string) => `${__PATH.log_path}:${id}`,
  association: (id: string) => `${__PATH.association}:${id}`,
  tiandibang: (id: string) => `${__PATH.tiandibang}:${id}`,
  qinmidu: (id: string) => `${__PATH.qinmidu}:${id}`,
  backup: (id: string) => `${__PATH.backup}:${id}`,
  shitu: (id: string) => `${__PATH.shitu}:${id}`,
  duanlu: (id: string) => `${__PATH.duanlu}:${id}`,
  temp: (id: string) => `${__PATH.temp_path}:${id}`,
  custom: (id: string) => `${__PATH.custom}:${id}`,
  autoBackup: (id: string) => `${__PATH.auto_backup}:${id}`,
  playerCurrency: (id: string) => `${__PATH.player_currency}:${id}`,
  currencyLog: (id: string) => `${__PATH.currency_log}:${id}`,
  currencyIndex: () => `${__PATH.currency_index}`,
  captcha: (id: string) => `${__PATH.captcha}:${id}`,
  mute: (id: string) => `${__PATH.mute}:${id}`
}

export type RedisKeyGenerator = typeof keys

/**
 * @param user_id
 * @param action
 * @returns
 * @deprecated
 */
export const getRedisKey = (user_id: string, action: ActionType) => {
  return baseKey + ':' + user_id + ':' + action
}

/**
 * @deprecated
 * @param name
 * @returns
 */
export const getRedisConfigKey = (name: string) => {
  return baseKey + ':config:' + name
}

/**
 * @deprecated
 * @param name
 * @returns
 */
export const getRedisSystemKey = (name: string) => {
  return baseKey + ':system:' + name
}

export const keysAction = {
  action: (id: string) => `${baseKey}:action:${id}`,
  xijie: (id: string) => `${baseKey}:xijie:${id}`,
  lastDajieTime: (id: string) => `${baseKey}:last_dajie_time:${id}`,
  lastBiwuTime: (id: string) => `${baseKey}:last_biwu_time:${id}`,
  shangjing: (id: string) => `${baseKey}:shangjing:${id}`,
  lastShuangxiuTime: (id: string) => `${baseKey}:last_shuangxiu_time:${id}`,
  couple: (id: string) => `${baseKey}:couple:${id}`,
  record: (id: string) => `${baseKey}:Record:${id}`,
  record2: (id: string) => `${baseKey}:Record2:${id}`,
  exchange: (id: string) => `${baseKey}:Exchange:${id}`,
  lastXijieTime: (id: string) => `${baseKey}:lastxijie_time:${id}`,
  lastReCreateTime: (id: string) => `${baseKey}:last_reCreate_time:${id}`,
  reCreateAcount: (id: string) => `${baseKey}:reCreate_acount:${id}`,
  lastSignTime: (id: string) => `${baseKey}:lastsign_time:${id}`,
  lastSetXuanyanTime: (id: string) => `${baseKey}:last_setxuanyan_time:${id}`,
  lastSetNameTime: (id: string) => `${baseKey}:last_setname_time:${id}`,
  duihuan: (id: string) => `${baseKey}:duihuan:${id}`,
  showNajieCD: (id: string) => `${baseKey}:showNajieCD:${id}`,
  lastBisaiTime: (id: string) => `${baseKey}:lastbisai_time:${id}`,
  petShowCD: (id: string) => `${baseKey}:petShowCD:${id}`,
  gameAction: (id: string) => `${baseKey}:game_action:${id}`,
  lastDagongTime: (id: string) => `${baseKey}:lastdagong_time:${id}`,
  bisai: (id: string) => `${baseKey}:bisai:${id}`,
  lastGameTime: (id: string) => `${baseKey}:last_game_time:${id}`,
  lastSignAssoTime: (id: string) => `${baseKey}:lastsign_Asso_time:${id}`,
  getLastSignExplor: (id: string) => `${baseKey}:getLastsign_Explor:${id}`,
  zytCd: (id: string) => `${baseKey}:zyt_cd:${id}`,
  dscCd: (id: string) => `${baseKey}:dsc_cd:${id}`,
  lastGardenTime: (id: string) => `${baseKey}:last_garden_time:${id}`,
  forumShowCD: (id: string) => `${baseKey}:forumShowCD:${id}`,
  supermarketCD: (id: string) => `${baseKey}:supermarketCD:${id}`,
  exchangeCD: (id: string) => `${baseKey}:ExchangeCD:${id}`,
  forumCD: (id: string) => `${baseKey}:ForumCD:${id}`,
  moneyGame: (id: string) => `${baseKey}:money_game:${id}`,
  getLastSignBonus: (id: string) => `${baseKey}:getLastsign_Bonus:${id}`,
  bossCD: (id: string) => `${baseKey}:BOSSCD:${id}`,
  system: (id: string) => `${baseKey}:system:${id}`,
  config: (id: string) => `${baseKey}:config:${id}`
}
