import { getIoRedis } from '@alemonjs/db';
import Association from '@src/config/help/association';
import help from '@src/config/help/base';
import set from '@src/config/help/admin';
import shituhelp from '@src/config/help/professor';
import xiuxian from '@src/config/xiuxian';
import { ActionType } from '@src/types/keys';

const baseDataKey = 'data:alemonjs-xiuxian';

// 存档存放路径
export const __PATH = {
  // 服务端用户
  server_user: `${baseDataKey}:server:auth:user`,
  // username
  username: `${baseDataKey}:server:auth:username`,
  // 服务端会话
  server_session: `${baseDataKey}:server:auth:session`,
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
  // 快捷指令
  shortcut: `${baseDataKey}:shortcut`,
  // 站内信
  message: `${baseDataKey}:message`,
  // 副职
  fuzhi: 'xiuxian:player',
  // 个人的主动消息发送日志，用于在主动消息又限制的平台。
  proactive_message_log: 'xiuxian:proactive_message_log'
};

export const keys = {
  serverUser: (id: string) => `${__PATH.server_user}:${id}`,
  serverUsername: (username: string) => `${__PATH.username}:${username}`,
  serverSession: (id: string) => `${__PATH.server_session}:${id}`,
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
  associationAudit: (associationName: string) => `${__PATH.association}:${associationName}:audit`, // 宗门审核列表
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
  shortcut: (id: string) => `${__PATH.shortcut}:${id}`,
  fuzhi: (id: string) => `${__PATH.fuzhi}:${id}:fuzhi`,
  proactiveMessageLog: (id: string) => `${__PATH.proactive_message_log}:${id}`
};

// 基础 Redis Key 前缀
export const baseKey = 'xiuxian@1.3.0';

export const keysAction = {
  lunhui: (id: string) => `${baseKey}:${id}:lunhui`,
  action10: (id: string) => `${baseKey}:${id}:action10`,
  action: (id: string) => `${baseKey}:${id}:action`,
  xijie: (id: string) => `${baseKey}:${id}:xijie`,
  lastDajieTime: (id: string) => `${baseKey}:${id}:last_dajie_time`,
  lastBiwuTime: (id: string) => `${baseKey}:${id}:last_biwu_time`,
  shangjing: (id: string) => `${baseKey}:${id}:shangjing`,
  lastShuangxiuTime: (id: string) => `${baseKey}:${id}:last_shuangxiu_time`,
  couple: (id: string) => `${baseKey}:${id}:couple`,
  record: (id: string) => `${baseKey}:${id}:record`,
  record2: (id: string) => `${baseKey}:${id}:record2`,
  exchange: (id: string) => `${baseKey}:${id}:exchange`,
  lastXijieTime: (id: string) => `${baseKey}:${id}:lastxijie_time`,
  lastReCreateTime: (id: string) => `${baseKey}:${id}:last_reCreate_time`,
  reCreateAcount: (id: string) => `${baseKey}:${id}:reCreate_acount`,
  lastSignTime: (id: string) => `${baseKey}:${id}:lastsign_time`,
  lastSetXuanyanTime: (id: string) => `${baseKey}:${id}:last_setxuanyan_time`,
  lastSetNameTime: (id: string) => `${baseKey}:${id}:last_setname_time`,
  duihuan: (id: string) => `${baseKey}:${id}:duihuan`,
  showNajieCD: (id: string) => `${baseKey}:${id}:showNajieCD`,
  lastBisaiTime: (id: string) => `${baseKey}:${id}:lastbisai_time`,
  petShowCD: (id: string) => `${baseKey}:${id}:petShowCD`,
  gameAction: (id: string) => `${baseKey}:${id}:game_action`,
  lastDagongTime: (id: string) => `${baseKey}:${id}:lastdagong_time`,
  bisai: (id: string) => `${baseKey}:${id}:bisai`,
  lastGameTime: (id: string) => `${baseKey}:${id}:last_game_time`,
  lastSignAssoTime: (id: string) => `${baseKey}:${id}:lastsign_Asso_time`,
  getLastSignExplor: (id: string) => `${baseKey}:${id}:getLastsign_Explor`,
  zytCd: (id: string) => `${baseKey}:${id}:zyt_cd`,
  dscCd: (id: string) => `${baseKey}:${id}:dsc_cd`,
  lastGardenTime: (id: string) => `${baseKey}:${id}:last_garden_time`,
  forumShowCD: (id: string) => `${baseKey}:${id}:forumShowCD`,
  supermarketCD: (id: string) => `${baseKey}:${id}:supermarketCD`,
  exchangeCD: (id: string) => `${baseKey}:${id}:ExchangeCD`,
  forumCD: (id: string) => `${baseKey}:${id}:ForumCD`,
  moneyGame: (id: string) => `${baseKey}:${id}:money_game`,
  getLastSignBonus: (id: string) => `${baseKey}:${id}:getLastsign_Bonus`,
  bossCD: (id: string) => `${baseKey}:${id}:BOSSCD`,
  system: (id: string, botId?: string) => `${baseKey}:${botId ? `${id}_${botId}` : id}:system`,
  config: (id: string) => `${baseKey}:${id}:config`
};

export const keysTask = {
  // 洗劫任务数据队列
  xijie: () => `${baseKey}:task:xijie`
};

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
export const KEY_WORLD_BOOS_STATUS_INIT = keysAction.system('world_boss_demon_king_init');

// 金角 大王 - king
export const KEY_WORLD_BOOS_STATUS_TWO = keysAction.system('world_boss_king_status');
export const KEY_RECORD_TWO = keysAction.system('record_king');
export const KEY_WORLD_BOOS_STATUS_INIT_TWO = keysAction.system('world_boss_king_init');

// 星阁 - 旧版本key（兼容性保留，仅内部使用）
export const KEY_AUCTION_GROUP_LIST = keysAction.system('auctionofficialtask_grouplist');
export const KEY_AUCTION_OFFICIAL_TASK = keysAction.system('auctionofficialtask');

/**
 * 锁相关的 Redis Key 管理
 */
export const keysLock = {
  // 系统相关锁
  boss: (bossId: 'boss1' | 'boss2') => `${baseKey}:locks:boss:${bossId}`,
  task: (taskName: string) => `${baseKey}:locks:task:${taskName}`,
  exchange: (goodsId: string) => `${baseKey}:locks:exchange:${goodsId}`,
  forum: (goodsId: string) => `${baseKey}:locks:forum:${goodsId}`,

  // 紧急锁（用于系统维护等）
  emergency: (operation: string) => `${baseKey}:locks:emergency:${operation}`
};
