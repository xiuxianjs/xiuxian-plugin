import { getIoRedis } from '@alemonjs/db';
import sectHelpConfig from '../config/help/association.js';
import mainHelpConfig from '../config/help/base.js';
import helpConfig from '../config/help/admin.js';
import masterDiscipleHelpConfig from '../config/help/professor.js';
import xiuxian from '../config/xiuxian.js';

const baseDataKey = 'data:alemonjs-xiuxian';
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
    player_currency: `${baseDataKey}:currency`,
    currency_log: `${baseDataKey}:currency_log`,
    currency_index: `${baseDataKey}:currency_index`,
    captcha: `${baseDataKey}:captcha`,
    mute: `${baseDataKey}:mute`,
    message: `${baseDataKey}:message`,
    fuzhi: 'xiuxian:player'
};
const keys = {
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
    fuzhi: (id) => `${__PATH.fuzhi}:${id}:fuzhi`
};
const baseKey = 'xiuxian@1.3.0';
const keysAction = {
    lunhui: (id) => `${baseKey}:lunhui:${id}`,
    action10: (id) => `${baseKey}:action10:${id}`,
    action: (id) => `${baseKey}:${id}:action`,
    xijie: (id) => `${baseKey}:xijie:${id}`,
    lastDajieTime: (id) => `${baseKey}:last_dajie_time:${id}`,
    lastBiwuTime: (id) => `${baseKey}:last_biwu_time:${id}`,
    shangjing: (id) => `${baseKey}:shangjing:${id}`,
    lastShuangxiuTime: (id) => `${baseKey}:last_shuangxiu_time:${id}`,
    couple: (id) => `${baseKey}:couple:${id}`,
    record: (id) => `${baseKey}:Record:${id}`,
    record2: (id) => `${baseKey}:Record2:${id}`,
    exchange: (id) => `${baseKey}:Exchange:${id}`,
    lastXijieTime: (id) => `${baseKey}:lastxijie_time:${id}`,
    lastReCreateTime: (id) => `${baseKey}:last_reCreate_time:${id}`,
    reCreateAcount: (id) => `${baseKey}:reCreate_acount:${id}`,
    lastSignTime: (id) => `${baseKey}:lastsign_time:${id}`,
    lastSetXuanyanTime: (id) => `${baseKey}:last_setxuanyan_time:${id}`,
    lastSetNameTime: (id) => `${baseKey}:last_setname_time:${id}`,
    duihuan: (id) => `${baseKey}:duihuan:${id}`,
    showNajieCD: (id) => `${baseKey}:showNajieCD:${id}`,
    lastBisaiTime: (id) => `${baseKey}:lastbisai_time:${id}`,
    petShowCD: (id) => `${baseKey}:petShowCD:${id}`,
    gameAction: (id) => `${baseKey}:game_action:${id}`,
    lastDagongTime: (id) => `${baseKey}:lastdagong_time:${id}`,
    bisai: (id) => `${baseKey}:bisai:${id}`,
    lastGameTime: (id) => `${baseKey}:last_game_time:${id}`,
    lastSignAssoTime: (id) => `${baseKey}:lastsign_Asso_time:${id}`,
    getLastSignExplor: (id) => `${baseKey}:getLastsign_Explor:${id}`,
    zytCd: (id) => `${baseKey}:zyt_cd:${id}`,
    dscCd: (id) => `${baseKey}:dsc_cd:${id}`,
    lastGardenTime: (id) => `${baseKey}:last_garden_time:${id}`,
    forumShowCD: (id) => `${baseKey}:forumShowCD:${id}`,
    supermarketCD: (id) => `${baseKey}:supermarketCD:${id}`,
    exchangeCD: (id) => `${baseKey}:ExchangeCD:${id}`,
    forumCD: (id) => `${baseKey}:ForumCD:${id}`,
    moneyGame: (id) => `${baseKey}:money_game:${id}`,
    getLastSignBonus: (id) => `${baseKey}:getLastsign_Bonus:${id}`,
    bossCD: (id) => `${baseKey}:BOSSCD:${id}`,
    system: (id, botId) => `${baseKey}:system:${botId ? `${id}_${botId}` : id}`,
    config: (id) => `${baseKey}:config:${id}`
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
const KEY_WORLD_BOOS_STATUS_TWO = keysAction.system('world_boss_king_status');
const KEY_RECORD_TWO = keysAction.system('record_king');
const KEY_AUCTION_GROUP_LIST = keysAction.system('auctionofficialtask_grouplist');
const KEY_AUCTION_OFFICIAL_TASK = keysAction.system('auctionofficialtask');

export { GAME_KEY, KEY_AUCTION_GROUP_LIST, KEY_AUCTION_OFFICIAL_TASK, KEY_RECORD, KEY_RECORD_TWO, KEY_WORLD_BOOS_STATUS, KEY_WORLD_BOOS_STATUS_TWO, __PATH, __PATH_CONFIG, baseKey, getRedisConfigKey, getRedisKey, getRedisSystemKey, keys, keysAction, keysByPath, keysTask };
