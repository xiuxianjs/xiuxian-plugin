import { getIoRedis } from '@alemonjs/db';
import Association from '@src/config/help/association';
import help from '@src/config/help/base';
import set from '@src/config/help/admin';
import shituhelp from '@src/config/help/professor';
import xiuxian from '@src/config/xiuxian';
import { ActionType } from '@src/types/keys';

const baseDataKey = 'data:alemonjs-xiuxian';

// 存档存放路径
const __PATH = {
  player_path: `${baseDataKey}:player`,
  equipment_path: `${baseDataKey}:equipment`,
  najie_path: `${baseDataKey}:xiuxian_najie`,
  danyao_path: `${baseDataKey}:xiuxian_danyao`,
  lib_path: `${baseDataKey}:item`,
  Timelimit: `${baseDataKey}:Timelimit`,
  Exchange: `${baseDataKey}:Exchange`,
  Level: `${baseDataKey}:Level`,
  shop: `${baseDataKey}:shop`,
  log_path: `${baseDataKey}:suduku`,
  association: `${baseDataKey}:association`,
  tiandibang: `${baseDataKey}:tiandibang`,
  qinmidu: `${baseDataKey}:qinmidu`,
  backup: `${baseDataKey}:backup`,
  shitu: `${baseDataKey}:shitu`,
  duanlu: `${baseDataKey}:duanlu`,
  temp_path: `${baseDataKey}:temp`,
  custom: `${baseDataKey}:custom`,
  auto_backup: `${baseDataKey}:auto_backup`,
  occupation: `${baseDataKey}:occupation`,
  // 用户货币数据
  player_currency: `${baseDataKey}:currency`,
  // 所有充值记录
  currency_log: `${baseDataKey}:currency_log`,
  // 充值记录索引。根据索引生成。
  currency_index: `${baseDataKey}:currency_index`,
  // 验证码
  captcha: `${baseDataKey}:captcha`,
  // 禁言
  mute: `${baseDataKey}:mute`,
  // 站内信
  message: `${baseDataKey}:message`,
  // 副职
  fuzhi: 'xiuxian:player'
};

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
  mute: (id: string) => `${__PATH.mute}:${id}`,
  message: (id: string) => `${__PATH.message}:${id}`,
  fuzhi: (id: string) => `${__PATH.fuzhi}:${id}:fuzhi`
};

// 基础 Redis Key 前缀
export const baseKey = 'xiuxian@1.3.0';

export const keysAction = {
  lunhui: (id: string) => `${baseKey}:lunhui:${id}`,
  action10: (id: string) => `${baseKey}:action10:${id}`,
  action: (id: string) => `${baseKey}:${id}:action`,
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
  system: (id: string, botId?: string) => `${baseKey}:system:${botId ? `${id}_${botId}` : id}`,
  config: (id: string) => `${baseKey}:config:${id}`
};

export const keysTask = {
  // 洗劫任务数据队列
  xijie: () => `${baseKey}:task:xijie`
};

export { __PATH };

export const __PATH_CONFIG = {
  Association,
  help,
  set,
  shituhelp,
  xiuxian
};

export type RedisKeyGenerator = typeof keys;

/**
 * @param user_id
 * @param action
 * @returns
 * @deprecated
 */
export const getRedisKey = (userId: string, action: ActionType) => {
  return `${baseKey}:${userId}:${action}`;
};

/**
 * @deprecated
 * @param name
 * @returns
 */
export const getRedisConfigKey = (name: string) => {
  return keysAction.config(name);
};

/**
 * @deprecated
 * @param name
 * @returns
 */
export const getRedisSystemKey = (name: string) => {
  return keysAction.system(name);
};

/**
 * @param path
 * @returns
 */
export const keysByPath = async path => {
  const redis = getIoRedis();
  const keys = await redis.keys(`${path}:*`);

  return keys.map(key => key.replace(`${path}:`, ''));
};

// 金银坊 - 资金池 Redis Key
export const GAME_KEY = keysAction.system('money_game');

// 妖王 - demon king
export const KEY_WORLD_BOOS_STATUS = keysAction.system('world_boss_demon_king_status');
export const KEY_RECORD = keysAction.system('record_demon_king');

// 金角 大王 - king
export const KEY_WORLD_BOOS_STATUS_TWO = keysAction.system('world_boss_king_status');
export const KEY_RECORD_TWO = keysAction.system('record_king');

// 星阁 - 旧版本key（兼容性保留，仅内部使用）
export const KEY_AUCTION_GROUP_LIST = keysAction.system('auctionofficialtask_grouplist');
export const KEY_AUCTION_OFFICIAL_TASK = keysAction.system('auctionofficialtask');
