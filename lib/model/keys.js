import { getIoRedis } from '@alemonjs/db';
import sectHelpConfig from '../config/help/association.js';
import mainHelpConfig from '../config/help/base.js';
import helpConfig from '../config/help/admin.js';
import masterDiscipleHelpConfig from '../config/help/professor.js';
import xiuxian from '../config/xiuxian.js';

const baseDataKey = 'data:alemonjs-xiuxian';
const __PATH = {
    server_user: `${baseDataKey}:server:auth:user`,
    username: `${baseDataKey}:server:auth:username`,
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
    player_currency: `${baseDataKey}:currency`,
    currency_log: `${baseDataKey}:currency_log`,
    currency_index: `${baseDataKey}:currency_index`,
    captcha: `${baseDataKey}:captcha`,
    mute: `${baseDataKey}:mute`,
    shortcut: `${baseDataKey}:shortcut`,
    message: `${baseDataKey}:message`,
    fuzhi: 'xiuxian:player',
    proactive_message_log: 'xiuxian:proactive_message_log'
};
const keys = {
    serverUser: (id) => `${__PATH.server_user}:${id}`,
    serverUsername: (username) => `${__PATH.username}:${username}`,
    serverSession: (id) => `${__PATH.server_session}:${id}`,
    player: (id) => `${__PATH.player_path}:${id}`,
    equipment: (id) => `${__PATH.equipment_path}:${id}`,
    najie: (id) => `${__PATH.najie_path}:${id}`,
    occupation: (id) => `${__PATH.occupation}:${id}`,
    danyao: (id) => `${__PATH.danyao_path}:${id}`,
    lib: (id) => `${__PATH.lib_path}:${id}`,
    timelimit: (id) => `${__PATH.Timelimit}:${id}`,
    exchange: (id) => `${__PATH.Exchange}:${id}`,
    level: (id) => `${__PATH.Level}:${id}`,
    shop: (id) => `${__PATH.shop}:${id}`,
    log: (id) => `${__PATH.log_path}:${id}`,
    association: (id) => `${__PATH.association}:${id}`,
    associationAudit: (associationName) => `${__PATH.association}:${associationName}:audit`,
    tiandibang: (id) => `${__PATH.tiandibang}:${id}`,
    qinmidu: (id) => `${__PATH.qinmidu}:${id}`,
    backup: (id) => `${__PATH.backup}:${id}`,
    shitu: (id) => `${__PATH.shitu}:${id}`,
    duanlu: (id) => `${__PATH.duanlu}:${id}`,
    temp: (id) => `${__PATH.temp_path}:${id}`,
    custom: (id) => `${__PATH.custom}:${id}`,
    autoBackup: (id) => `${__PATH.auto_backup}:${id}`,
    playerCurrency: (id) => `${__PATH.player_currency}:${id}`,
    currencyLog: (id) => `${__PATH.currency_log}:${id}`,
    currencyIndex: () => `${__PATH.currency_index}`,
    captcha: (id) => `${__PATH.captcha}:${id}`,
    mute: (id) => `${__PATH.mute}:${id}`,
    message: (id) => `${__PATH.message}:${id}`,
    shortcut: (id) => `${__PATH.shortcut}:${id}`,
    fuzhi: (id) => `${__PATH.fuzhi}:${id}:fuzhi`,
    proactiveMessageLog: (id) => `${__PATH.proactive_message_log}:${id}`
};
const baseKey = 'xiuxian@1.3.0';
const keysAction = {
    lunhui: (id) => `${baseKey}:${id}:lunhui`,
    action10: (id) => `${baseKey}:${id}:action10`,
    action: (id) => `${baseKey}:${id}:action`,
    xijie: (id) => `${baseKey}:${id}:xijie`,
    lastDajieTime: (id) => `${baseKey}:${id}:last_dajie_time`,
    lastBiwuTime: (id) => `${baseKey}:${id}:last_biwu_time`,
    shangjing: (id) => `${baseKey}:${id}:shangjing`,
    lastShuangxiuTime: (id) => `${baseKey}:${id}:last_shuangxiu_time`,
    couple: (id) => `${baseKey}:${id}:couple`,
    record: (id) => `${baseKey}:${id}:record`,
    record2: (id) => `${baseKey}:${id}:record2`,
    exchange: (id) => `${baseKey}:${id}:exchange`,
    lastXijieTime: (id) => `${baseKey}:${id}:lastxijie_time`,
    lastReCreateTime: (id) => `${baseKey}:${id}:last_reCreate_time`,
    reCreateAcount: (id) => `${baseKey}:${id}:reCreate_acount`,
    lastSignTime: (id) => `${baseKey}:${id}:lastsign_time`,
    lastSetXuanyanTime: (id) => `${baseKey}:${id}:last_setxuanyan_time`,
    lastSetNameTime: (id) => `${baseKey}:${id}:last_setname_time`,
    duihuan: (id) => `${baseKey}:${id}:duihuan`,
    showNajieCD: (id) => `${baseKey}:${id}:showNajieCD`,
    lastBisaiTime: (id) => `${baseKey}:${id}:lastbisai_time`,
    petShowCD: (id) => `${baseKey}:${id}:petShowCD`,
    gameAction: (id) => `${baseKey}:${id}:game_action`,
    lastDagongTime: (id) => `${baseKey}:${id}:lastdagong_time`,
    bisai: (id) => `${baseKey}:${id}:bisai`,
    lastGameTime: (id) => `${baseKey}:${id}:last_game_time`,
    lastSignAssoTime: (id) => `${baseKey}:${id}:lastsign_Asso_time`,
    getLastSignExplor: (id) => `${baseKey}:${id}:getLastsign_Explor`,
    zytCd: (id) => `${baseKey}:${id}:zyt_cd`,
    dscCd: (id) => `${baseKey}:${id}:dsc_cd`,
    lastGardenTime: (id) => `${baseKey}:${id}:last_garden_time`,
    forumShowCD: (id) => `${baseKey}:${id}:forumShowCD`,
    supermarketCD: (id) => `${baseKey}:${id}:supermarketCD`,
    exchangeCD: (id) => `${baseKey}:${id}:ExchangeCD`,
    forumCD: (id) => `${baseKey}:${id}:ForumCD`,
    moneyGame: (id) => `${baseKey}:${id}:money_game`,
    getLastSignBonus: (id) => `${baseKey}:${id}:getLastsign_Bonus`,
    bossCD: (id) => `${baseKey}:${id}:BOSSCD`,
    system: (id, botId) => `${baseKey}:${botId ? `${id}_${botId}` : id}:system`,
    config: (id) => `${baseKey}:${id}:config`
};
const keysTask = {
    xijie: () => `${baseKey}:task:xijie`
};
const __PATH_CONFIG = {
    Association: sectHelpConfig,
    help: mainHelpConfig,
    set: helpConfig,
    shituhelp: masterDiscipleHelpConfig,
    xiuxian
};
const getRedisKey = (userId, action) => {
    return `${baseKey}:${userId}:${action}`;
};
const getRedisConfigKey = (name) => {
    return keysAction.config(name);
};
const getRedisSystemKey = (name) => {
    return keysAction.system(name);
};
const keysByPath = async (path) => {
    const redis = getIoRedis();
    const keys = await redis.keys(`${path}:*`);
    return keys.map(key => key.replace(`${path}:`, ''));
};
const GAME_KEY = keysAction.system('money_game');
const KEY_WORLD_BOOS_STATUS = keysAction.system('world_boss_demon_king_status');
const KEY_RECORD = keysAction.system('record_demon_king');
const KEY_WORLD_BOOS_STATUS_INIT = keysAction.system('world_boss_demon_king_init');
const KEY_WORLD_BOOS_STATUS_TWO = keysAction.system('world_boss_king_status');
const KEY_RECORD_TWO = keysAction.system('record_king');
const KEY_WORLD_BOOS_STATUS_INIT_TWO = keysAction.system('world_boss_king_init');
const KEY_AUCTION_GROUP_LIST = keysAction.system('auctionofficialtask_grouplist');
const KEY_AUCTION_OFFICIAL_TASK = keysAction.system('auctionofficialtask');
const keysLock = {
    boss: (bossId) => `${baseKey}:locks:boss:${bossId}`,
    task: (taskName) => `${baseKey}:locks:task:${taskName}`,
    exchange: (goodsId) => `${baseKey}:locks:exchange:${goodsId}`,
    forum: (goodsId) => `${baseKey}:locks:forum:${goodsId}`,
    emergency: (operation) => `${baseKey}:locks:emergency:${operation}`
};

export { GAME_KEY, KEY_AUCTION_GROUP_LIST, KEY_AUCTION_OFFICIAL_TASK, KEY_RECORD, KEY_RECORD_TWO, KEY_WORLD_BOOS_STATUS, KEY_WORLD_BOOS_STATUS_INIT, KEY_WORLD_BOOS_STATUS_INIT_TWO, KEY_WORLD_BOOS_STATUS_TWO, __PATH, __PATH_CONFIG, baseKey, getRedisConfigKey, getRedisKey, getRedisSystemKey, keys, keysAction, keysByPath, keysLock, keysTask };
