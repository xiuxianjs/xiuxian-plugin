import sectHelpConfig from '../config/help/association.js';
import mainHelpConfig from '../config/help/base.js';
import helpConfig from '../config/help/admin.js';
import masterDiscipleHelpConfig from '../config/help/professor.js';
import xiuxian from '../config/xiuxian.js';
import { baseKey } from './constants.js';
import { getIoRedis } from '@alemonjs/db';

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
    player_currency: 'data:alemonjs-xiuxian:currency',
    currency_log: 'data:alemonjs-xiuxian:currency_log',
    currency_index: 'data:alemonjs-xiuxian:currency_index',
    captcha: 'data:alemonjs-xiuxian:captcha',
    mute: 'data:alemonjs-xiuxian:mute',
    fuzhi: 'xiuxian:player'
};
const __PATH_CONFIG = {
    Association: sectHelpConfig,
    help: mainHelpConfig,
    set: helpConfig,
    shituhelp: masterDiscipleHelpConfig,
    xiuxian
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
    fuzhi: (id) => `${__PATH.fuzhi}:${id}:fuzhi`
};
const keysAction = {
    action: (id) => `${baseKey}:action:${id}`,
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
    system: (id) => `${baseKey}:system:${id}`,
    config: (id) => `${baseKey}:config:${id}`
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

export { __PATH, __PATH_CONFIG, getRedisConfigKey, getRedisKey, getRedisSystemKey, keys, keysAction, keysByPath };
